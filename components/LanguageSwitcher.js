import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../constants';
import Styles_screens from '../constants/Styles';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <FontAwesome name="globe" size={24} color={COLORS.textColor} />
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.languageOption}>
                            <Text style={styles.languageText}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('he')} style={styles.languageOption}>
                            <Text style={styles.languageText}>עברית</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('ar')} style={styles.languageOption}>
                            <Text style={styles.languageText}>العربية</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    languageOption: {
        paddingVertical: 10,
    },
    languageText: {
        fontSize: 18,
        color: COLORS.textColor,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default LanguageSwitcher;
