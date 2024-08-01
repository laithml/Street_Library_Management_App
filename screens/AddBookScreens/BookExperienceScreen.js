import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants";
import { Rating } from "react-native-ratings";
import CategoriesSelection from "../../components/CategoriesSelection";
import SelectionModal from "../../components/SelectionModal";
import Styles_screens from "../../constants/Styles";
import { useTranslation } from 'react-i18next';

const BookExperienceScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { title, author, description, numPages, language, image } = route.params;

    const [genre, setGenre] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState('');
    const [rating, setRating] = useState(0);
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Fiction');
    const [errors, setErrors] = useState({});

    const conditions = [
        { label: t('new') },
        { label: t('usedGood') },
        { label: t('usedAcceptable') }
    ];

    const handleBackPress = () => {
        navigation.goBack();
    };

    const validateInput = () => {
        let isValid = true;
        let newErrors = {};

        if (!selectedCondition) {
            isValid = false;
            newErrors.selectedCondition = t('bookConditionRequired');
        }

        if (genre.length === 0) {
            isValid = false;
            newErrors.selectedGenre = t('genreSelectionRequired');
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNextPress = () => {
        if (validateInput()) {
            console.log("image is: " + image);
            navigation.navigate('UploadImages', {
                title,
                author,
                description,
                numPages,
                language,
                rating,
                selectedCondition,
                selectedCategory,
                selectedGenres: genre,
                image
            });
        } else {
            Alert.alert(t('inputError'), t('pleaseCorrectErrors'));
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>{t('bookExperienceDetails')}</Text>
                </View>
                <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

                <View style={Styles_screens.inputContainer}>
                    <Text style={Styles_screens.inputTitle}>{t('bookCondition')}</Text>
                    <TouchableOpacity style={[Styles_screens.button, { width: "100%" }]} onPress={() => setVisible(true)}>
                        <Text style={Styles_screens.buttonText}>
                            {"Condition: " + (selectedCondition || t('chooseBookCondition'))}
                        </Text>
                    </TouchableOpacity>

                    <SelectionModal
                        items={conditions}
                        visible={visible}
                        setVisible={setVisible}
                        onSelect={(condition) => {
                            setSelectedCondition(condition.label);
                            setVisible(false);
                        }}
                        renderItem={(item) => (
                            <Text style={Styles_screens.modalItemText}>{item.label}</Text>
                        )}
                    />

                    <View>
                        <Text style={Styles_screens.inputTitle}>{t('bookRating')}</Text>
                        <Rating
                            type="custom"
                            ratingColor={COLORS.secondary}
                            ratingBackgroundColor={COLORS.lightGray}
                            ratingCount={5}
                            imageSize={48}
                            onFinishRating={setRating}
                            startingValue={rating}
                            style={{ paddingVertical: 10, marginVertical: 10, alignSelf: 'center' }}
                            tintColor={COLORS.backgroundColor}
                        />
                    </View>

                    <Text style={Styles_screens.inputTitle}>{t('bookCategory')}</Text>
                    <CategoriesSelection
                        onGenreChange={setGenre}
                        selectedGenres={genre}
                    />
                </View>
                {errors.selectedCondition && <Text style={{ color: 'red' }}>{errors.selectedCondition}</Text>}
                {errors.selectedGenre && <Text style={{ color: 'red', textAlign: 'center' }}>{errors.selectedGenre}</Text>}

                <View style={[Styles_screens.buttonsContainerRow]}>
                    <TouchableOpacity style={Styles_screens.buttonR} onPress={handleBackPress}>
                        <Text style={Styles_screens.buttonText}>{t('back')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.submitButtonR} onPress={handleNextPress}>
                        <Text style={Styles_screens.submitButtonText}>{t('next')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default BookExperienceScreen;
