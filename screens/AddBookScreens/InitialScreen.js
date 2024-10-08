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
import LoadingAnimation from "../../components/LoadingAnimation";
import ImagePickerModal from "../../components/ImagePickerModal";

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

            <ImagePickerModal isVisible={isModalVisible} onPickImage={handlePickImage} onTakePhoto={handleTakePhoto} onClose={() => setModalVisible(false)} />

            <Modal
                transparent={true}
                animationType="fade"
                visible={isProcessing}
                onRequestClose={() => {}}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <LoadingAnimation />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default InitialScreen;
