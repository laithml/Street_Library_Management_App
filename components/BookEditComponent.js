import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import {pickImageFromLibrary} from "../Utils/ImagePickerUtils";

const BookEditComponent = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { book, onSave, nextBook } = route.params;
    const [editedBook, setEditedBook] = useState(book);
    const [rotation, setRotation] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');

    const handleTextChange = (field, value) => {
        setEditedBook({ ...editedBook, [field]: value });
    };

    const handleImageChange = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            setEditedBook({ ...editedBook, image: uri });
        }
    };

    const handleRotate = () => {
        setRotation((prevRotation) => prevRotation + 90);
    };

    const handleSave = () => {
        onSave(editedBook);
        if (nextBook) {
            navigation.push('BookEditComponent', { book: nextBook, onSave, nextBook: null });
        } else {
            Alert.alert(t('saved'), t('allBooksProcessed'));
            navigation.popToTop();
        }
    };

    const addLabel = () => {
        if (selectedLabel && editedBook.selectedText) {
            setEditedBook({
                ...editedBook,
                [selectedLabel]: editedBook.selectedText,
                text: editedBook.text.replace(editedBook.selectedText, ''),
                selectedText: '',
            });
            setSelectedLabel('');
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('editBookDetails')}</Text>
            <Text style={styles.instructions}>{t('selectTextAndLabel')}</Text>
            <TextInput
                style={styles.input}
                value={editedBook.text}
                onChangeText={(value) => handleTextChange('text', value)}
                multiline
                onSelectionChange={({ nativeEvent: { selection } }) => {
                    const selectedText = editedBook.text.substring(selection.start, selection.end);
                    setEditedBook({ ...editedBook, selectedText });
                }}
            />
            <Image
                source={{ uri: `data:image/png;base64,${editedBook.image}` }}
                style={[styles.image, { transform: [{ rotate: `${rotation}deg` }] }]}
            />
            <TouchableOpacity style={styles.button} onPress={handleImageChange}>
                <Text style={styles.buttonText}>{t('changeImage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRotate}>
                <Text style={styles.buttonText}>{t('rotateImage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>{t('selectLabel')}</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder={t('title')}
                value={editedBook.title}
                onChangeText={(value) => handleTextChange('title', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('author')}
                value={editedBook.author}
                onChangeText={(value) => handleTextChange('author', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('description')}
                value={editedBook.description}
                onChangeText={(value) => handleTextChange('description', value)}
                multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{t('selectLabel')}</Text>
                    <Picker
                        selectedValue={selectedLabel}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedLabel(itemValue)}
                    >
                        <Picker.Item label={t('title')} value="title" />
                        <Picker.Item label={t('author')} value="author" />
                        <Picker.Item label={t('description')} value="description" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={addLabel}>
                        <Text style={styles.buttonText}>{t('apply')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default BookEditComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    instructions: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 8,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: 200,
        marginBottom: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
