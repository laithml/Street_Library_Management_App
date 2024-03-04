import React, {useEffect, useState} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    FlatList
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {COLORS} from "../constants";
import {GOOGLE_API_KEY} from "../constants/env";
import * as Location from "expo-location";
import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../Config/Firebase";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {storage} from "../Config/Firebase";
import {
    pickImageFromLibrary,
    requestPermissionsAsync,
    takePhotoWithCamera,
    uploadImagesAndGetURLs
} from "../Utils/ImagePickerUtils";
import Styles_screens from "../constants/Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoadingAnimation from "../components/LoadingAnimation";


const AddLibraryScreen = ({navigation}) => {
    const [location, setLocation] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
    const handleRemoveImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    const handleSubmit = async () => {
        try {
            if (!title || !description || !location || images.length === 0) {
                alert('Please fill in all the fields');
                return;
            }

            setIsLoading(true);
            // Example: Upload each image to Firebase Storage and get their URLs
            const imageUrls = await uploadImagesAndGetURLs(images, 'libraries');
            const docRef = await addDoc(collection(db, "LibrariesData"), {
                name: title,
                description,
                latitude: location.latitude,
                longitude: location.longitude,
                imgSrcs: imageUrls,
            });

            // Update the same document with its ID
            await updateDoc(doc(db, "LibrariesData", docRef.id), {
                id: docRef.id
            });

            console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Map');
            alert('Library added successfully');

        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchLocation = async () => {
            setIsLoading(true);
            let currLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currLocation.coords.latitude,
                longitude: currLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setIsLoading(false);
        };

        fetchLocation();
    }, []);


    if (isLoading) {
        return <LoadingAnimation/>;
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={styles.container}>

                <View style={styles.inputContainer}>
                    <Text style={Styles_screens.inputTitle}>Library Title</Text>
                    <TextInput style={styles.input} placeholder="Library Title" placeholderTextColor={COLORS.textColor}
                               onChangeText={text => setTitle(text)}/>
                    <Text style={Styles_screens.inputTitle}>Description</Text>
                    <TextInput style={[styles.input, styles.descriptionInput]} placeholder="Description"
                               placeholderTextColor={COLORS.textColor} onChangeText={text => setDescription(text)}
                               multiline/>

                    <Text style={Styles_screens.inputTitle}>Location</Text>
                    <GooglePlacesAutocomplete
                        placeholder='Enter location'
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            setLocation({
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            });
                        }}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        styles={{
                            textInputContainer: styles.input,
                            textInput: styles.googleTextInput,

                        }}
                        textInputProps={{
                            placeholderTextColor: COLORS.textColor,
                        }}
                    />
                </View>
                {location && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={location}
                        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
                    >
                        <Marker coordinate={location}/>
                    </MapView>
                )}
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
                                <FontAwesome name="plus" size={24} color="#000"/>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
                <View style={[Styles_screens.buttonsContainerRow, {position: '',margin:10}]}>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={pickImage}>
                        <Text style={styles.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={takePhoto}>
                        <Text style={styles.buttonText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            <View style={styles.buttonsContainer}>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Add Library</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor,
    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
    },
    googleTextInput: {
        height: 50,
        color: COLORS.textColor,
        fontSize: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    descriptionInput: {
        height: 80,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    button: {
        width: '80%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
        height: 50,
    },
    buttonText: {
        color: COLORS.black,
        fontSize: 18,
    },
    submitButton: {
        width: '90%',
        height: 50,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
    },
    map: {
        width: '90%',
        height: 250,
        marginTop: 10,
    },
});

export default AddLibraryScreen;
