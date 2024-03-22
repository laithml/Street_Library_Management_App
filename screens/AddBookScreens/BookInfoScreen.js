import Styles_screens from "../../constants/Styles";
import {Alert, KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {COLORS} from "../../constants";
import React, {useRef, useState} from "react";


const BookInfoScreen = ( {navigation}) => {


    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
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
            newErrors.title = 'Title is required';
        }
        if (!author.trim()) {
            isValid = false;
            newErrors.author = 'Author is required';
        }
        if (numPages.trim() === '') {
            isValid = false;
            newErrors.numPages = 'Number of pages must be a number';
        } else if (numPages <= 0) {
            isValid = false;
            newErrors.numPages = 'Number of pages must be positive';
        }
        if (!language.trim()) {
            isValid = false;
            newErrors.language = 'Language is required';
        }

        setErrors(newErrors);
        return isValid;
    };
    const handleNextPress = () => {
        if(validateInput()) {

            // Navigate to the next screen and pass the collected book information
            navigation.navigate('BookExperience', {
                title,
                author,
                description,
                numPages,
                language,
            });
            resetFormFields();
        }else{
            Alert.alert('Input Error', 'Please correct the errors before proceeding.');

        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Basic Book Details</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

            <View style={Styles_screens.inputContainer}>
                <Text style={Styles_screens.inputTitle}>Title</Text>
                {errors.title && <Text style={  Styles_screens.error}>{errors.title}</Text>}

                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.title &&   Styles_screens.errorField]}
                    placeholder="Book Title"
                    returnKeyType={"next"}
                    onSubmitEditing={() => authorRef.current.focus()}
                    onChangeText={(text) => { setTitle(text); setErrors(prev => ({...prev, title: null})); }}
                    value={title}
                />
                <Text style={Styles_screens.inputTitle}>Author</Text>
                {errors.author && <Text style={  Styles_screens.error}>{errors.author}</Text>}

                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.author &&   Styles_screens.errorField]}
                    placeholder="Book Author"
                    ref={authorRef}
                    returnKeyType={"next"}
                    onSubmitEditing={() => descriptionRef.current.focus()}
                    onChangeText={(text) => {setAuthor(text);setErrors(prev => ({...prev, author: null}));}}
                    value={author}
                />

                <Text style={Styles_screens.inputTitle}>Description</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input, Styles_screens.descriptionInput]}
                    placeholder="Book Description (Optional)"
                    ref={descriptionRef}
                    returnKeyType={"next"}
                    onSubmitEditing={() => numPagesRef.current.focus()}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    multiline
                />

                <Text style={Styles_screens.inputTitle}>Language</Text>
                {errors.language && <Text style={  Styles_screens.error}>{errors.language}</Text>}

                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.language &&   Styles_screens.errorField]}
                    placeholder="Language"
                    ref={languageRef}
                    returnKeyType={"next"}
                    onSubmitEditing={() => numPagesRef.current.focus()}
                    onChangeText={(text) => { setLanguage(text); setErrors(prev => ({...prev, language: null})); }}
                    value={language}
                />

                <Text style={Styles_screens.inputTitle}>Number of Pages</Text>
                {errors.numPages && <Text style={  Styles_screens.error}>{errors.numPages}</Text>}

                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.numPages &&   Styles_screens.errorField]}
                    placeholder="Number of Pages"
                    keyboardType="numeric"
                    ref={numPagesRef}
                    onChangeText={(text) => { setNumPages(text); setErrors(prev => ({...prev, numPages: null})); }}
                    value={numPages}
                />
            </View>
            <View style={Styles_screens.buttonsContainer}>
                <TouchableOpacity style={Styles_screens.submitButton} onPress={handleNextPress} >
                    <Text style={Styles_screens.submitButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </KeyboardAvoidingView>
    )

}

export default BookInfoScreen;
