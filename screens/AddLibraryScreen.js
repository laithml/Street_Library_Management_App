import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView,Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {COLORS} from "../constants";
import {GOOGLE_API_KEY} from "../constants/env";
import * as Location from "expo-location";
import {collection, addDoc} from "firebase/firestore";
import {db} from "../Config/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/Firebase";
import {pickImageFromLibrary, requestPermissionsAsync, takePhotoWithCamera} from "../Utils/ImagePickerUtils";

const AddLibraryScreen = ({navigation}) => {
    const [location, setLocation] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

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

    const handleSubmit = async () => {
        try {
            if (!title || !description || !location || images.length === 0) {
                alert('Please fill in all the fields');
                return;
            }

            // Example: Upload each image to Firebase Storage and get their URLs
            const imageUrls = await Promise.all(images.map(async (uri) => {
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uri.split('/').pop();
                const imageRef = ref(storage, `libraries/${new Date().toISOString()}-${fileName}`);
                await uploadBytes(imageRef, blob);
                return getDownloadURL(imageRef);
            }));


            // Add the new library document with image URLs
            const docRef = await addDoc(collection(db, "LibrariesData"), {
                name: title,
                id: Math.random().toString(36).substr(2, 9),
                description,
                latitude: location.latitude,
                longitude: location.longitude,
                imgSrcs: imageUrls,
            });
            console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Map');

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            let currLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currLocation.coords.latitude,
                longitude: currLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        };

        fetchLocation();
    }, []);


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Library Title" placeholderTextColor={COLORS.textColor}
                               onChangeText={text => setTitle(text)}/>
                    <TextInput style={[styles.input, styles.descriptionInput]} placeholder="Description"
                               placeholderTextColor={COLORS.textColor} onChangeText={text => setDescription(text)}
                               multiline/>
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
                <View>
                    {images.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={{ width: 100, height: 100 }} />
                    ))}

                </View>
            </SafeAreaView>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
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
        height: 100,
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
