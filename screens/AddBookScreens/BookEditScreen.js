import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Styles_screens from "../../constants/Styles";
import { COLORS, SIZES } from "../../constants";
import { setCurrentBookIndex } from '../../redux/store';

const BookEditScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const books = useSelector((state) => state.books);
    const currentIndex = useSelector((state) => state.currentBookIndex);
    const dispatch = useDispatch();

    const book = books[currentIndex];

    const [imageUri, setImageUri] = useState(`data:image/png;base64,${book.image}`);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] = useState(book.text);
    const [selection, setSelection] = useState({ start: 0, end: 0 });



    const handleLabelSelect = (label) => {
        const selectedText = text.slice(selection.start, selection.end);
        const remainingText = text.slice(0, selection.start) + text.slice(selection.end);

        switch (label) {
            case 'title':
                setTitle(selectedText);
                break;
            case 'author':
                setAuthor(selectedText);
                break;
            case 'description':
                setDescription(selectedText);
                break;
            default:
                break;
        }
        setText(remainingText);
    };

    const handleSaveBook = () => {
        navigation.navigate('BookInfo', { book: { title, author, description, image: book.image } });
    };

    const handleDelete = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < books.length) {
            dispatch(setCurrentBookIndex(nextIndex));
            navigation.replace('BookEdit');
        } else {
            navigation.navigate('InitialScreen');
        }
    };

    return (
        <SafeAreaView style={[Styles_screens.defContainer]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>{t('editBook')}</Text>
                </View>
                <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }}
                           style={Styles_screens.image} />
                </View>
                <TextInput
                    style={[Styles_screens.input, styles.textArea]}
                    value={text}
                    onChangeText={setText}
                    placeholder={t('extractedText')}
                    multiline
                    onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                />
                <View style={styles.labelContainer}>
                    <TouchableOpacity style={styles.labelButton} onPress={() => handleLabelSelect('title')}>
                        <Text style={styles.labelButtonText}>{t('title')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.labelButton} onPress={() => handleLabelSelect('author')}>
                        <Text style={styles.labelButtonText}>{t('author')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.labelButton} onPress={() => handleLabelSelect('description')}>
                        <Text style={styles.labelButtonText}>{t('description')}</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={Styles_screens.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={t('title')}
                />
                <TextInput
                    style={Styles_screens.input}
                    value={author}
                    onChangeText={setAuthor}
                    placeholder={t('author')}
                />
                <TextInput
                    style={[Styles_screens.input, styles.description]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t('description')}
                    multiline
                />
                <TouchableOpacity style={Styles_screens.button} onPress={handleSaveBook}>
                    <Text style={Styles_screens.buttonText}>{t('save')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>{t('delete')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookEditScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    textArea: {
        height: 200,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    labelButton: {
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '30%',
    },
    labelButtonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    description: {
        height: 150,
    },
    deleteButton: {
        backgroundColor: '#FF0000',
        width: '90%',
        padding: 16,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
