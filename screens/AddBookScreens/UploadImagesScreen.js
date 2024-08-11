import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Styles_screens from "../../constants/Styles";
import { Timestamp } from "firebase/firestore";
import { pickImageFromLibrary, requestPermissionsAsync, takePhotoWithCamera, uploadImagesAndGetURLs } from "../../Utils/ImagePickerUtils";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useUser } from "../../Context/UserContext";
import { addBook, fetchLibraries, fetchLibraryById, updateUserBooks } from "../../actions/db_actions";
import LibrarySelectionModal from "../../components/LibrarySelectionModal";
import { useTranslation } from 'react-i18next';
import {setCurrentBookIndex} from "../../redux/store";
import {useDispatch, useSelector} from "react-redux";

const UploadImagesScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { title, author, description, numPages, language, rating, selectedCondition, selectedCategory, selectedGenres, image } = route.params || {};
    const { user } = useUser();
    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const [selectedLib, setSelectedLib] = useState('');
    const [images, setImages] = useState(image ? [`data:image/png;base64,${image}`] : []);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibId, setSelectedLibId] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const books = useSelector((state) => state.books);
    const currentIndex = useSelector((state) => state.currentBookIndex);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLibrariesData = async () => {
            setIsLoading(true);
            const librariesData = await fetchLibraries();
            setLibraries(librariesData);

            if (user?.defaultLibrary) {
                const defaultLibrary = await fetchLibraryById(user.defaultLibrary);
                setSelectedLib(defaultLibrary.name);
                setSelectedLibId(defaultLibrary.id);
            }
            setIsLoading(false);
        };

        fetchLibrariesData();
        requestPermissionsAsync();
    }, [user?.defaultLibrary]);

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
            newErrors.selectedLib = t('libraryLocationRequired');
        }
        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async () => {
        if (!validateInput()) {
            Alert.alert(t('inputError'), t('pleaseCorrectErrors'));
            return;
        }
        setIsLoading(true);

        try {
            // Upload the images and get the URLs
            const imageUrls = await uploadImagesAndGetURLs(images, 'books');

            // Create the book data object
            const bookData = {
                title,
                author,
                description,
                numPages,
                language,
                rating,
                selectedCondition,
                selectedCategory,
                genre: selectedGenres,
                images: imageUrls,
                location: selectedLibId,
                addedBy: user.id,
                addedAt: Timestamp.now(),
                takenBy: [],
                isTaken: false,
            };

            console.log("Book Data: ", bookData);

            // Add the book to the database
            const bookId = await addBook(bookData);
            const newBook = { id: bookId, ...bookData };
            await updateUserBooks(user.id, bookId);

            const nextIndex = currentIndex + 1;
            if (nextIndex < books.length) {
                dispatch(setCurrentBookIndex(nextIndex));
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BookEdit' }],
                });
            } else {
                navigation.navigate('BookDetails', { book: newBook });
                Alert.alert(t('bookSubmitted'), t('bookSubmittedSuccess'));            }
        } catch (error) {
            console.error("Error adding book: ", error);
            Alert.alert(t('submissionError'), t('submissionErrorMessage'));
        } finally {
            setIsLoading(false);
        }
    };



    const handleRemoveImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    const handleLibrarySelect = (id, name) => {
        setSelectedLibId(id);
        setSelectedLib(name);
    };

    if (isLoading) {
        return <LoadingAnimation />
    }

    return (
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>{t('uploadBookDetails')}</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>
            <View style={Styles_screens.inputContainer}>
                <Text style={Styles_screens.descriptionText}>{t('chooseLibrary')}</Text>
                <TouchableOpacity style={[Styles_screens.button, { width: "100%" }]} onPress={() => setVisibleLibModel(true)}>
                    <Text style={Styles_screens.buttonText}>
                        {"Library: " + (selectedLib || t('chooseLibraryLocation'))}
                    </Text>
                </TouchableOpacity>

                <LibrarySelectionModal
                    visible={visibleLibModel}
                    onClose={() => setVisibleLibModel(false)}
                    libraries={libraries}
                    onSelect={handleLibrarySelect}
                />

                <Text style={[Styles_screens.descriptionText, { marginTop: 20 }]}>
                    {t('uploadPhotos')}
                </Text>
                <View style={[Styles_screens.buttonsContainerRow, { position: '', paddingBottom: 18 }]}>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={pickImage}>
                        <Text style={Styles_screens.buttonText}>{t('uploadPhoto')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={takePhoto}>
                        <Text style={Styles_screens.buttonText}>{t('takePhoto')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={Styles_screens.imageUploadSection}>
                <FlatList
                    horizontal
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={Styles_screens.imageItemContainer}>
                            <Image key={index} source={{ uri: item }} style={Styles_screens.image} />
                            <TouchableOpacity
                                style={Styles_screens.removeImageButton}
                                onPress={() => handleRemoveImage(item)}
                            >
                                <FontAwesome name="times" size={24} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <TouchableOpacity onPress={pickImage} style={Styles_screens.addImageButton}>
                            <FontAwesome name="plus" size={24} />
                        </TouchableOpacity>
                    )}
                />
            </View>
            {errors.selectedLib && <Text style={Styles_screens.error}>{errors.selectedLib}</Text>}

            {errors.images && <Text style={Styles_screens.error}>{errors.images}</Text>}

            <View style={[Styles_screens.buttonsContainerRow]}>
                <TouchableOpacity style={Styles_screens.buttonR} onPress={handleBackPress}>
                    <Text style={Styles_screens.buttonText}>{t('back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.submitButtonR} onPress={handleSubmit}>
                    <Text style={Styles_screens.submitButtonText}>{t('submit')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default UploadImagesScreen;
