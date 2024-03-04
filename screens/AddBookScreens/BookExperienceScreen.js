import Styles_screens from "../../constants/Styles";
import {Alert, Modal, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../../constants";
import React, {useState} from "react";
import {Rating} from "react-native-ratings";


const BookExperienceScreen = ({navigation,route}) => {
    const { title, author, description, numPages, language } = route.params;


    const genres = {
        Fiction: ['Fantasy', 'Science Fiction', 'Dystopian', 'Adventure', 'Romance', 'Detective & Mystery', 'Horror', 'Thriller', 'Literary Fiction', 'Historical Fiction'],
        NonFiction: ['Biography', 'Autobiography', 'Self-help', 'Motivational', 'Health', 'History', 'Travel', 'Guide / How-to', 'Families & Relationships', 'Humor'],
    };
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState('');
    const [rating, setRating] = useState(0);
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Fiction');
    const [errors, setErrors] = useState({});


    const conditions = [
        {label: "New"},
        {label: "Used - Good"},
        {label: "Used - Acceptable"}
    ];
    const renderGenres = () => {
        return genres[selectedCategory].map((genre, index) => (
            <TouchableOpacity
                key={index}
                style={[Styles_screens.genreButton, selectedGenre === genre && Styles_screens.selectedGenre]}
                onPress={() => setSelectedGenre(genre)}
            >
                <Text style={Styles_screens.genreButtonText}>{genre}</Text>
            </TouchableOpacity>
        ));
    };




    const handleBackPress = () => {
        navigation.goBack();
    };
    const validateInput = () => {
        let isValid = true;
        let newErrors = {};

        if (!selectedCondition) {
            isValid = false;
            newErrors.selectedCondition = 'Book condition is required';
        }

        if (!selectedGenre) {
            isValid = false;
            newErrors.selectedGenre = 'Genre selection is required';
        }

        setErrors(newErrors);
        return isValid;
    };
    const handleNextPress = () => {

        if(validateInput()) {
            navigation.navigate('UploadImages', {
                title,
                author,
                description,
                numPages,
                language,
                rating,
                selectedCondition,
                selectedCategory,
                selectedGenre,
            });
        }else{
            Alert.alert('Input Error', 'Please correct the errors before proceeding.');

        }
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedGenre(null);
    };

    return (
        <SafeAreaView style={Styles_screens.container}>

            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Book Experience Details</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

            <View style={Styles_screens.inputContainer}>
                <Text style={Styles_screens.inputTitle}>Book Condition:</Text>
                <TouchableOpacity style={[Styles_screens.button, {width: "100%"}]} onPress={() => setVisible(true)}>
                    <Text style={Styles_screens.buttonText}>
                        {"Condition: " + (selectedCondition || "Choose Book Condition")}
                    </Text>
                </TouchableOpacity>
                <Modal visible={visible} animationType="slide" transparent={true}>
                    <View style={Styles_screens.modalContainer}>
                        <View style={Styles_screens.modalContent}>
                            {conditions.map((condition, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={Styles_screens.modalItem}
                                    onPress={() => {
                                        setSelectedCondition(condition.label);
                                        setVisible(false);
                                    }}>
                                    <Text style={Styles_screens.modalItemText}>{condition.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>

                <View>
                    <Text style={Styles_screens.inputTitle}>Book Rating:</Text>
                    <Rating
                        type="custom"
                        ratingColor={COLORS.secondary}
                        ratingBackgroundColor={COLORS.lightGray}
                        ratingCount={5}
                        imageSize={48}
                        onFinishRating={setRating}
                        startingValue={rating}
                        style={{paddingVertical: 10, marginVertical: 10, alignSelf: 'center'}}
                        tintColor={COLORS.backgroundColor}
                    />
                </View>

                <Text style={Styles_screens.inputTitle}>Book Category:</Text>
                <View style={Styles_screens.categoryContainer}>
                    <TouchableOpacity
                        style={[Styles_screens.categoryButton, selectedCategory === 'Fiction' && Styles_screens.selectedCategory]}
                        onPress={() => handleCategoryChange('Fiction')}
                    >
                        <Text>Fiction</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[Styles_screens.categoryButton, selectedCategory === 'NonFiction' && Styles_screens.selectedCategory]}
                        onPress={() => handleCategoryChange('NonFiction')}
                    >
                        <Text>Non-Fiction</Text>
                    </TouchableOpacity>
                </View>

                <View style={Styles_screens.genresContainer}>
                    {renderGenres()}
                </View>
            </View>
            {errors.selectedCondition && <Text style={{ color: 'red' }}>{errors.selectedCondition}</Text>}
            {errors.selectedGenre && <Text style={{ color: 'red', textAlign: 'center' }}>{errors.selectedGenre}</Text>}

            <View style={[Styles_screens.buttonsContainerRow]}>
                <TouchableOpacity style={Styles_screens.buttonR} onPress={handleBackPress} >
                    <Text style={Styles_screens.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.submitButtonR} onPress={handleNextPress} >
                    <Text style={Styles_screens.submitButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

export default BookExperienceScreen;
