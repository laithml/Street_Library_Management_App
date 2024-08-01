import React, { useState } from 'react';
import { Text, TouchableOpacity, SafeAreaView, View, Modal, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Styles_screens from "../../constants/Styles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { pickImageFromLibrary, takePhotoWithCamera } from "../../Utils/ImagePickerUtils";
import { processImage } from "../../actions/model_actions";
import { setBooks, setCurrentBookIndex } from "../../redux/store";
import { COLORS } from "../../constants";

const InitialScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();

    const handleImageProcess = async (imageUri) => {
        try {
            setIsProcessing(true);
            const processedResult = await processImage(imageUri);
            setIsProcessing(false);
            if (processedResult.books && processedResult.books.length > 0) {
                dispatch(setBooks(processedResult.books));
                dispatch(setCurrentBookIndex(0));
                navigation.navigate('BookEdit');
            } else {
                Alert.alert(t('error'), t('noBooksDetected'));
            }
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            Alert.alert(t('error'), t('failedToProcessImage'));
        }
    };

    const handlePickImage = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            handleImageProcess(uri);
        }
        setModalVisible(false);
    };

    const handleTakePhoto = async () => {
        const uri = await takePhotoWithCamera();
        if (uri) {
            handleImageProcess(uri);
        }
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>{t('addBook')}</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

            <View style={Styles_screens.optionContainer}>
                <TouchableOpacity style={Styles_screens.optionButton} onPress={() => navigation.navigate('BookInfo')}>
                    <FontAwesome name="book" size={30} color={COLORS.secondary} />
                    <Text style={[Styles_screens.buttonText, Styles_screens.iconPadding]}>{t('manualAddBook')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.optionButton} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="camera" size={30} color={COLORS.secondary} />
                    <Text style={[Styles_screens.buttonText, Styles_screens.iconPadding]}>{t('automaticAddBook')}</Text>
                </TouchableOpacity>
            </View>
            {isProcessing && <Text>{t('processing')}</Text>}

            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={Styles_screens.modalContainer}>
                    <View style={Styles_screens.modalContent}>
                        <TouchableOpacity style={Styles_screens.modalButton} onPress={handleTakePhoto}>
                            <FontAwesome name="camera" size={30} color="#fff" />
                            <Text style={Styles_screens.modalButtonText}>{t('takePhoto')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles_screens.modalButton} onPress={handlePickImage}>
                            <FontAwesome name="image" size={30} color="#fff" />
                            <Text style={Styles_screens.modalButtonText}>{t('pickImage')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles_screens.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={Styles_screens.modalButtonText}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default InitialScreen;
