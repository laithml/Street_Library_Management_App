import Styles_screens from "../../constants/Styles";
import {Alert, KeyboardAvoidingView, Modal, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../../constants";
import React, {useState} from "react";
import {Rating} from "react-native-ratings";
import CategoriesSelection from "../../components/CategoriesSelection";


const BookExperienceScreen = ({navigation, route}) => {
    const {title, author, description, numPages, language} = route.params;

    const [selectedGenres, setSelectedGenres] = useState([]);
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

        if (selectedGenres.length === 0) {
            isValid = false;
            newErrors.selectedGenre = 'Genre selection is required';
        }

        setErrors(newErrors);
        return isValid;
    };
    const handleNextPress = () => {

            console.log(selectedGenres)
        if (validateInput()) {
            navigation.navigate('UploadImages', {
                title,
                author,
                description,
                numPages,
                language,
                rating,
                selectedCondition,
                selectedCategory,
                selectedGenres,
            });
        } else {
            Alert.alert('Input Error', 'Please correct the errors before proceeding.');

        }
    }



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

        <SafeAreaView style={Styles_screens.container}>

            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Book Experience Details</Text>
            </View>
            <View style={{height: 1.5, backgroundColor: 'grey', width: '100%'}}></View>

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
                <CategoriesSelection
                    onGenreChange={setSelectedGenres}
                    onCategoryChange={setSelectedCategory}
                    selectedCategory={selectedCategory}
                    selectedGenres={selectedGenres}
                />

            </View>
            {errors.selectedCondition && <Text style={{color: 'red'}}>{errors.selectedCondition}</Text>}
            {errors.selectedGenre && <Text style={{color: 'red', textAlign: 'center'}}>{errors.selectedGenre}</Text>}

            <View style={[Styles_screens.buttonsContainerRow]}>
                <TouchableOpacity style={Styles_screens.buttonR} onPress={handleBackPress}>
                    <Text style={Styles_screens.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.submitButtonR} onPress={handleNextPress}>
                    <Text style={Styles_screens.submitButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </KeyboardAvoidingView>
    )

}

export default BookExperienceScreen;
