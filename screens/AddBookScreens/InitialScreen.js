// InitialScreen.js (New or adjusted UploadImagesScreen.js)

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import Styles_screens from "../../constants/Styles";
import {processImage} from "../../actions/model_actions";
import {pickImageFromLibrary} from "../../Utils/ImagePickerUtils";

const InitialScreen = ({ navigation }) => {
    const [imageUri, setImageUri] = useState('');

    const handleImageProcess = async () => {
        try {
            const uri = await pickImageFromLibrary();  // or takePhotoWithCamera();
            if (uri) {
                setImageUri(uri);
                const processedData = await processImage(uri);
                // Assuming processedData contains all the required book details
                // navigation.navigate('BookInfoScreen', processedData);
                console.log(processedData);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to process image.");
        }
    };

    return (
        <SafeAreaView style={Styles_screens.container}>
            <Text style={Styles_screens.headerText}>Add New Book</Text>
            <TouchableOpacity style={Styles_screens.button} onPress={handleImageProcess}>
                <Text style={Styles_screens.buttonText}>Upload and Process Image</Text>
            </TouchableOpacity>
            {imageUri ? <Image source={{ uri: imageUri }} style={Styles_screens.image} /> : null}
        </SafeAreaView>
    );
};

export default InitialScreen;
