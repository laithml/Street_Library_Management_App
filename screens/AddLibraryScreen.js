import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    FlatList, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {COLORS, SIZES} from "../constants";
import {GOOGLE_API_KEY} from "../constants/env";
import * as Location from "expo-location";
import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../Config/Firebase";

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

    const descRef = useRef(null);
    const locationRef = useRef(null);


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
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView
                keyboardShouldPersistTaps='handled'
                style={{
                flex: 1,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                backgroundColor: COLORS.backgroundColor,
                margin: SIZES.padding
            }}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>Add Library</Text>
                </View>
                <View style={{height: 1.5, backgroundColor: 'grey', width: '100%'}}/>
                <ScrollView>
                    <View style={[Styles_screens.inputContainer, {width: 'auto'}]}>
                        <Text style={Styles_screens.inputTitle}>Library Title</Text>
                        <TextInput style={Styles_screens.input}
                                   placeholder="Library Title"
                                   placeholderTextColor={COLORS.textColor}
                                   returnKeyType="next"
                                   onSubmitEditing={() => descRef.current.focus()}
                                   onChangeText={text => setTitle(text)}
                        />
                        <Text style={Styles_screens.inputTitle}>Description</Text>
                        <TextInput style={[Styles_screens.input, Styles_screens.descriptionInput]}
                                   placeholder="Description"
                                   placeholderTextColor={COLORS.textColor}
                                   ref={descRef}
                                   returnKeyType="next"
                                   onSubmitEditing={() => locationRef.current.focus()}
                                   onChangeText={text => setDescription(text)}
                                   multiline/>

                        <Text style={Styles_screens.inputTitle}>Location</Text>
                        <GooglePlacesAutocomplete
                            placeholder='Enter location'
                            fetchDetails={true}
                            ref={locationRef}
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
                                textInput: Styles_screens.input,

                            }}
                            textInputProps={{
                                placeholderTextColor: COLORS.textColor,
                            }}
                        />

                        {location && (
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={Styles_screens.map}
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
                    </View>
                </ScrollView>
            </SafeAreaView>
                <View style={Styles_screens.buttonsContainer}>
                    <View style={Styles_screens.buttonsContainerRow}>
                        <TouchableOpacity style={Styles_screens.buttonR} onPress={pickImage}>
                            <Text style={Styles_screens.buttonText}>Upload Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles_screens.buttonR} onPress={takePhoto}>
                            <Text style={Styles_screens.buttonText}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSubmit}>
                        <Text style={Styles_screens.submitButtonText}>Add Library</Text>
                    </TouchableOpacity>
                </View>

        </KeyboardAvoidingView>
    );
};


export default AddLibraryScreen;
