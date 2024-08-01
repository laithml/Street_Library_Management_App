import React, { useRef, useState, useEffect } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../../constants";
import Styles_screens from "../../constants/Styles";
import { useTranslation } from 'react-i18next';

const BookInfoScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { book } = route.params;
    const [title, setTitle] = useState(book.title || '');
    const [author, setAuthor] = useState(book.author || '');
    const [description, setDescription] = useState(book.description || '');
    const [numPages, setNumPages] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
    const authorRef = useRef(null);
    const descriptionRef = useRef(null);
    const numPagesRef = useRef(null);
    const languageRef = useRef(null);

    const resetFormFields = () => {
        setTitle('');
        setAuthor('');
        setDescription('');
        setNumPages('');
        setLanguage('');
    };

    const validateInput = () => {
        let isValid = true;
        let newErrors = {};

        if (!title.trim()) {
            isValid = false;
            newErrors.title = t('titleRequired');
        }
        if (!author.trim()) {
            isValid = false;
            newErrors.author = t('authorRequired');
        }
        if (numPages.trim() === '') {
            isValid = false;
            newErrors.numPages = t('numPagesRequired');
        } else if (numPages <= 0) {
            isValid = false;
            newErrors.numPages = t('numPagesPositive');
        }
        if (!language.trim()) {
            isValid = false;
            newErrors.language = t('languageRequired');
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNextPress = () => {
        if (validateInput()) {
            navigation.navigate('BookExperience', {
                book: {
                    title,
                    author,
                    description,
                    numPages,
                    language,
                }
            });
            resetFormFields();
        } else {
            Alert.alert(t('inputError'), t('pleaseCorrectErrors'));
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>{t('basicBookDetails')}</Text>
                </View>
                <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

                <View style={Styles_screens.inputContainer}>
                    <Text style={Styles_screens.inputTitle}>{t('title')}</Text>
                    {errors.title && <Text style={Styles_screens.error}>{errors.title}</Text>}
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.title && Styles_screens.errorField]}
                        placeholder={t('bookTitle')}
                        returnKeyType={"next"}
                        onSubmitEditing={() => authorRef.current.focus()}
                        onChangeText={(text) => { setTitle(text); setErrors(prev => ({ ...prev, title: null })); }}
                        value={title}
                    />
                    <Text style={Styles_screens.inputTitle}>{t('author')}</Text>
                    {errors.author && <Text style={Styles_screens.error}>{errors.author}</Text>}
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.author && Styles_screens.errorField]}
                        placeholder={t('bookAuthor')}
                        ref={authorRef}
                        returnKeyType={"next"}
                        onSubmitEditing={() => descriptionRef.current.focus()}
                        onChangeText={(text) => { setAuthor(text); setErrors(prev => ({ ...prev, author: null })); }}
                        value={author}
                    />
                    <Text style={Styles_screens.inputTitle}>{t('description')}</Text>
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, Styles_screens.descriptionInput]}
                        placeholder={t('bookDescription')}
                        ref={descriptionRef}
                        returnKeyType={"next"}
                        onSubmitEditing={() => numPagesRef.current.focus()}
                        onChangeText={(text) => setDescription(text)}
                        value={description}
                        multiline
                    />
                    <Text style={Styles_screens.inputTitle}>{t('numPages')}</Text>
                    {errors.numPages && <Text style={Styles_screens.error}>{errors.numPages}</Text>}
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.numPages && Styles_screens.errorField]}
                        placeholder={t('numPages')}
                        keyboardType="numeric"
                        ref={numPagesRef}
                        onSubmitEditing={() => languageRef.current.focus()}
                        onChangeText={(text) => { setNumPages(text); setErrors(prev => ({ ...prev, numPages: null })); }}
                        value={numPages}
                    />
                    <Text style={Styles_screens.inputTitle}>{t('language')}</Text>
                    {errors.language && <Text style={Styles_screens.error}>{errors.language}</Text>}
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.language && Styles_screens.errorField]}
                        placeholder={t('language')}
                        ref={languageRef}
                        returnKeyType={"next"}
                        onSubmitEditing={handleNextPress}
                        onChangeText={(text) => { setLanguage(text); setErrors(prev => ({ ...prev, language: null })); }}
                        value={language}
                    />
                </View>
                <View style={Styles_screens.buttonsContainer}>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleNextPress}>
                        <Text style={Styles_screens.submitButtonText}>{t('next')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default BookInfoScreen;
