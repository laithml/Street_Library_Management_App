import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import {COLORS} from "../constants";
import Styles_screens from "../constants/Styles";

const ImagePickerModal = ({ isVisible, onClose, onPickImage, onTakePhoto }) => {
    const { t } = useTranslation();

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={Styles_screens.modalContainer}>
                <View style={Styles_screens.modalContent}>
                    <TouchableOpacity style={Styles_screens.modalButton} onPress={onTakePhoto}>
                        <FontAwesome name="camera" size={30} color={COLORS.secondary} />
                        <Text style={[Styles_screens.modalButtonText, { color: COLORS.black }]}>{t('takePhoto')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.modalButton} onPress={onPickImage}>
                        <FontAwesome name="image" size={30} color={COLORS.secondary} />
                        <Text style={[Styles_screens.modalButtonText, { color: COLORS.black }]}>{t('pickImage')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles_screens.modalButton, { backgroundColor: COLORS.lightRed }]} onPress={onClose}>
                        <Text style={Styles_screens.modalButtonText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ImagePickerModal;
