import {
    Alert,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Styles_screens from "../../constants/Styles";
import React, {useEffect, useState} from "react";
import {addDoc, collection, doc, getDocs, getDoc, updateDoc, Timestamp} from "firebase/firestore";
import {db} from "../../Config/Firebase";
import {
    pickImageFromLibrary,
    requestPermissionsAsync,
    takePhotoWithCamera,
    uploadImagesAndGetURLs
} from "../../Utils/ImagePickerUtils";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoadingAnimation from "../../components/LoadingAnimation";


const UploadImagesScreen = ({navigation, route}) => {
    const {
        title,
        author,
        description,
        numPages,
        language,
        rating,
        selectedCondition,
        selectedCategory,
        selectedGenres,
    } = route.params;


    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const [selectedLib, setSelectedLib] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibId, setSelectedLibId] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchLibraries = async () => {
            setIsLoading(true);
            const querySnapshot = await getDocs(collection(db, 'LibrariesData'));
            const librariesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLibraries(librariesData);
            setIsLoading(false);
        };

        fetchLibraries();
    }, []);
    useEffect(() => {
        requestPermissionsAsync();
    }, []);


    const pickImage = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            setImages([...images, uri]);
        }
    };

    const takePhoto = async () => {
        const uri = await takePhotoWithCamera();
        if (uri) {
            setImages([...images, uri]);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const validateInput = () => {
        let isValid = true;
        let newErrors = {};
        if (!selectedLibId) {
            isValid = false;
            newErrors.selectedLib = 'Library location is required';
        }
        if (images.length < 3) {
            isValid = false;
            newErrors.images = 'Please upload more images, front, back and side view of the book';
        }
        setErrors(newErrors);
        return isValid;
    }


    const handleSubmit = async () => {
        if (!validateInput()) {
            Alert.alert('Input Error', 'Please correct the errors before proceeding.');
            return;
        }
        setIsLoading(true);

        const imageUrls = await uploadImagesAndGetURLs(images, 'books');

        const bookData = {
            title,
            author,
            description,
            numPages: parseInt(numPages),
            language,
            rating: parseInt(rating),
            condition: selectedCondition,
            category: selectedCategory,
            genre: selectedGenres,
            location: selectedLibId,
            images: imageUrls,
            addedAt: Timestamp.now(),
        };

        try {
            const bookRef = await addDoc(collection(db, "BooksData"), bookData);
            const libraryRef = doc(db, "LibrariesData", selectedLibId);

            await updateDoc(doc(db, "BooksData", bookRef.id), {
                id: bookRef.id
            });

            getDoc(libraryRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const currentBooks = docSnap.data().books || [];
                    updateDoc(libraryRef, {
                        books: [...currentBooks, bookRef.id]
                    }).then(() => {
                        console.log("Library updated with new book ID");
                    }).catch((error) => {
                        console.error("Error updating library: ", error);
                    });
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
            });

            console.log("Document written with ID: ", bookRef.id);
            navigation.navigate('OverView');
            Alert.alert("Book Submitted", "Your book has been successfully submitted!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }



        setIsLoading(false);
    };
    const handleRemoveImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    if (isLoading) {
        return <LoadingAnimation/>
    }

    return (

        <SafeAreaView style={Styles_screens.container}>
            {/* Header Section */}
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Upload Book Details</Text>
            </View>
            <View style={{height: 1.5, backgroundColor: 'grey', width: '100%'}}></View>
            {/* Main Content Section */}
            <View style={Styles_screens.inputContainer}>
                <Text style={Styles_screens.descriptionText}>
                    Choose the library where you'd like to place the book. This helps us organize books by location.
                </Text>
                <TouchableOpacity style={[Styles_screens.button, {width: "100%"}]}
                                  onPress={() => setVisibleLibModel(true)}>
                    <Text style={Styles_screens.buttonText}>
                        {"Library: " + (selectedLib || "Choose Library Location")}
                    </Text>
                </TouchableOpacity>


                <Modal visible={visibleLibModel} animationType="slide" transparent={true}>
                    <View style={Styles_screens.modalContainer}>
                        <View style={Styles_screens.modalContent}>
                            <TextInput
                                style={Styles_screens.searchInput}
                                placeholder="Search Library..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <ScrollView style={{maxHeight: '80%'}}>
                                {libraries.filter(library => library.name?.toLowerCase()
                                    .includes(searchQuery.toLowerCase())).map((library, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={Styles_screens.modalItem}
                                        onPress={() => {
                                            setSelectedLibId(library.id);
                                            setSelectedLib(library.name); // Update to display library name instead of ID
                                            setVisibleLibModel(false);
                                            setSearchQuery(''); // Clear search query upon selection
                                        }}>
                                        <Text style={Styles_screens.modalItemText}>{library.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <Text style={[Styles_screens.descriptionText, {marginTop: 20}]}>
                    Upload at least 3 photos of the book: one for the front, one for the back, and one for the side.
                </Text>
                <View style={[Styles_screens.buttonsContainerRow, {position: '', paddingBottom: 18}]}>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={pickImage}>
                        <Text style={Styles_screens.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={takePhoto}>
                        <Text style={Styles_screens.buttonText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={Styles_screens.imageUploadSection}>
                <FlatList
                    horizontal
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <View style={Styles_screens.imageItemContainer}>
                            <Image key={index} source={{uri: item}} style={Styles_screens.image}/>
                            <TouchableOpacity
                                style={Styles_screens.removeImageButton}
                                onPress={() => handleRemoveImage(item)}
                            >
                                <FontAwesome name="times" size={24}/>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <TouchableOpacity onPress={pickImage} style={Styles_screens.addImageButton}>
                            <FontAwesome name="plus" size={24}/>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {errors.selectedLib && <Text style={  Styles_screens.error}>{errors.selectedLib}</Text>}

            {errors.images && <Text style={  Styles_screens.error}>{errors.images}</Text>}

            {/* Footer Section */}
            <View style={[Styles_screens.buttonsContainerRow]}>
                <TouchableOpacity style={Styles_screens.buttonR} onPress={handleBackPress}>
                    <Text style={Styles_screens.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.submitButtonR} onPress={handleSubmit}>
                    <Text style={Styles_screens.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>


    )


}

export default UploadImagesScreen;
