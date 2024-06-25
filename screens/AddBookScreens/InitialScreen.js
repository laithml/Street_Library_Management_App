import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import Styles_screens from "../../constants/Styles";
import {processImage} from "../../actions/model_actions";
import {pickImageFromLibrary} from "../../Utils/ImagePickerUtils";
import { useTranslation } from 'react-i18next';

const InitialScreen = ({ navigation }) => {
    const { t } = useTranslation();
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
            Alert.alert(t('error'), t('failedToProcessImage'));
        }
    };

    return (
        <SafeAreaView style={Styles_screens.container}>
            <Text style={Styles_screens.headerText}>{t('addNewBook')}</Text>
            <TouchableOpacity style={Styles_screens.button} onPress={handleImageProcess}>
                <Text style={Styles_screens.buttonText}>{t('uploadAndProcessImage')}</Text>
            </TouchableOpacity>
            {imageUri ? <Image source={{ uri: imageUri }} style={Styles_screens.image} /> : null}
        </SafeAreaView>
    );
};

export default InitialScreen;
