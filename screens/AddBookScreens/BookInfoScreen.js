import Styles_screens from "../../constants/Styles";
import {Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {COLORS} from "../../constants";
import React, {useEffect, useState} from "react";


const BookInfoScreen = ( {navigation,route}) => {


    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [numPages, setNumPages] = useState('');
    const [language, setLanguage] = useState('');
    const [errors, setErrors] = useState({});
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
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Basic Book Details</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

            <View style={Styles_screens.inputContainer}>
                <Text style={Styles_screens.inputTitle}>Title</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.title && { borderColor: 'red',borderWidth: 1}]}
                    placeholder="Book Title"
                    onChangeText={(text) => { setTitle(text); setErrors(prev => ({...prev, title: null})); }}
                    value={title}
                />
                {errors.title && <Text style={{color: 'red'}}>{errors.title}</Text>}
                <Text style={Styles_screens.inputTitle}>Author</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.author && { borderColor: 'red',borderWidth: 1}]}
                    placeholder="Book Author"
                    onChangeText={(text) => {setAuthor(text);setErrors(prev => ({...prev, author: null}));}}
                    value={author}
                />
                {errors.author && <Text style={{color: 'red'}}>{errors.author}</Text>}

                <Text style={Styles_screens.inputTitle}>Description</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input, Styles_screens.descriptionInput]}
                    placeholder="Book Description (Optional)"
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    multiline
                />

                <Text style={Styles_screens.inputTitle}>Language</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.language && { borderColor: 'red',borderWidth: 1}]}
                    placeholder="Language"
                    onChangeText={(text) => { setLanguage(text); setErrors(prev => ({...prev, language: null})); }}
                    value={language}
                />
                {errors.language && <Text style={{color: 'red'}}>{errors.language}</Text>}

                <Text style={Styles_screens.inputTitle}>Number of Pages</Text>
                <TextInput
                    placeholderTextColor={COLORS.textColor}
                    style={[Styles_screens.input,errors.numPages && { borderColor: 'red',borderWidth: 1}]}
                    placeholder="Number of Pages"
                    keyboardType="numeric"
                    onChangeText={(text) => { setNumPages(text); setErrors(prev => ({...prev, numPages: null})); }}
                    value={numPages}
                />
                {errors.numPages && <Text style={{color: 'red'}}>{errors.numPages}</Text>}
            </View>
            <View style={Styles_screens.buttonsContainer}>
                <TouchableOpacity style={Styles_screens.submitButton} onPress={handleNextPress} >
                    <Text style={Styles_screens.submitButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

export default BookInfoScreen;
