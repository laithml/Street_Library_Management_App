import React, { useState, useRef, useEffect } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    Modal,
    ActivityIndicator,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import Styles_screens from "../../constants/Styles";
import { useTranslation } from 'react-i18next';
import { updateBookDetails, getUserById } from "../../actions/db_actions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {pickImageFromLibrary, takePhotoWithCamera, uploadImagesAndGetURLs} from "../../Utils/ImagePickerUtils";
import ImagePickerModal from "../../components/ImagePickerModal";
import CategoriesSelection from "../../components/CategoriesSelection";

const BookEditAdmin = ({ route, navigation }) => {
    const { t } = useTranslation();
    const book = route.params?.book || {};
    const [title, setTitle] = useState(book.title || '');
    const [author, setAuthor] = useState(book.author || '');
    const [description, setDescription] = useState(book.description || '');
    const [language, setLanguage] = useState(book.language || '');
    const [numPages, setNumPages] = useState(book.numPages || '');
    const [selectedGenres, setSelectedGenres] = useState(book.genre || []);
    const [images, setImages] = useState(book.images || []);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
    const [errors, setErrors] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const [isTakerModalVisible, setTakerModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [addedByUser, setAddedByUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [takerDetailsArray, setTakerDetailsArray] = useState([]);

    const authorRef = useRef(null);
    const descriptionRef = useRef(null);
    const numPagesRef = useRef(null);
    const languageRef = useRef(null);

    // Convert timestamp to a readable date format
    const addedAt = book.addedAt ? new Date(book.addedAt.seconds * 1000).toLocaleString() : '';

    useEffect(() => {
        const fetchAddedByUser = async () => {
            setLoading(true);
            try {
                const user = await getUserById(book.addedBy);
                setAddedByUser(user);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddedByUser();
    }, [book.addedBy]);

    const pickImage = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            setImages([...images, uri]);
        }
        setModalVisible(false);

    };

    const takePhoto = async () => {
        const uri = await takePhotoWithCamera();
        if (uri) {
            setImages([...images, uri]);
        }
        setModalVisible(false);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));

        // Update thumbnail index if needed
        if (thumbnailIndex >= index) {
            setThumbnailIndex(Math.max(thumbnailIndex - 1, 0));
        }
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
        if (!numPages.trim()) {
            isValid = false;
            newErrors.numPages = t('numPagesRequired');
        } else if (parseInt(numPages) <= 0) {
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

    const handleSaveChanges = async () => {
        if (validateInput()) {
            try {
                // Upload new images and get their URLs
                const newImageURLs = await uploadImagesAndGetURLs(images);

                const updatedBook = {
                    title,
                    author,
                    description,
                    language,
                    numPages,
                    genre: selectedGenres,
                    images: newImageURLs,
                };

                // Update the book document with the new data
                await updateBookDetails(book.id, updatedBook);

                Alert.alert(t('success'), t('bookUpdated'));
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BookDetails', params: { book: { ...book, ...updatedBook } } }],
                });
            } catch (error) {
                Alert.alert(t('error'), t('failedToUpdateBook'));
            }
        } else {
            Alert.alert(t('inputError'), t('pleaseCorrectErrors'));
        }
    };



    const handleThumbnailSelect = (index) => {
        setThumbnailIndex(index);
    };

    const showAddedByUserDetails = () => {
        if (addedByUser) {
            setModalContent({
                title: t('addedByUserDetails'),
                details: [
                    { label: t('name'), value: addedByUser.name },
                    { label: t('email'), value: addedByUser.email },
                ],
            });
            setTakerModalVisible(true);
        }
    };

    const fetchTakerDetails = async () => {
        if (book.takenBy && book.takenBy.length > 0) {
            setLoading(true);
            try {
                const detailsArray = await Promise.all(book.takenBy.map(async (userId) => {
                    const user = await getUserById(userId);
                    return user;
                }));
                setTakerDetailsArray(detailsArray);
                setModalContent(null);
                setTakerModalVisible(true);
            } catch (error) {
                console.error("Failed to fetch taker details:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const showTakerDetails = (taker) => {
        setModalContent({
            title: t('takerDetails'),
            details: [
                { label: t('name'), value: taker.name },
                { label: t('email'), value: taker.email },
            ],
        });
        setTakerModalVisible(true);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>{t('editBookDetails')}</Text>
                </View>
                <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>

                <ScrollView style={Styles_screens.inputContainer}>
                    {/* Display the date the book was added and the user who added it */}
                    <View style={{ marginBottom: 20, justifyContent: "center", alignItems: 'center' }}>
                        <Text style={[Styles_screens.inputTitle, { color: COLORS.secondary }]}>{t('addedAt')}: {addedAt}</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            addedByUser && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[Styles_screens.inputTitle, { color: COLORS.secondary }]}>{t('addedBy')}: </Text>
                                    <TouchableOpacity  style={[Styles_screens.submitButton,{width:'',paddingHorizontal:SIZES.radius}]} onPress={showAddedByUserDetails}>
                                        <Text style={Styles_screens.submitButtonText}> {addedByUser.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>

                    {/* Button to show all takers */}
                    {book.takenBy && book.takenBy.length > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>

                        <TouchableOpacity
                            style={[Styles_screens.submitButton, { backgroundColor: COLORS.primary,width: "100%"}]}
                            onPress={fetchTakerDetails}
                        >
                            <Text style={Styles_screens.buttonText}>{t('viewAllTakers')}</Text>
                        </TouchableOpacity>
                        </View>
                    )}

                    {/* Input fields for book details */}
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

                    {/* Additional fields for author, description, numPages, language, etc. */}
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
                        onSubmitEditing={handleSaveChanges}
                        onChangeText={(text) => { setLanguage(text); setErrors(prev => ({ ...prev, language: null })); }}
                        value={language}
                    />

                    <Text style={Styles_screens.inputTitle}>{t('selectThumbnail')}</Text>
                    <FlatList
                        style={{marginBottom: 20}}
                        horizontal
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={Styles_screens.imageItemContainer}>
                                <TouchableOpacity onPress={() => handleThumbnailSelect(index)}>
                                    <Image
                                        source={{ uri: item }}
                                        style={Styles_screens.image}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={Styles_screens.removeImageButton}
                                    onPress={() => handleRemoveImage(index)}
                                >
                                    <FontAwesome name="times" size={24} />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={Styles_screens.addImageButton}>
                                <FontAwesome name="plus" size={24} />
                            </TouchableOpacity>
                        )}
                    />

                    <Text style={Styles_screens.inputTitle}>{t('preferredCategories')}</Text>
                    <CategoriesSelection
                        onGenreChange={setSelectedGenres}
                        selectedGenres={selectedGenres}
                    />

                </ScrollView>

                <View style={[Styles_screens.buttonsContainer,{marginBottom:SIZES.margin}]}>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSaveChanges}>
                        <Text style={Styles_screens.submitButtonText}>{t('saveChanges')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Image Picker Modal */}
                <ImagePickerModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onPickImage={pickImage}
                    onTakePhoto={takePhoto}
                />

                {/* Combined Modal for Added By and Taker Details */}
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isTakerModalVisible}
                    onRequestClose={() => setTakerModalVisible(false)}
                >
                    <View style={Styles_screens.modalContainer}>
                        <View style={[Styles_screens.modalContent, { alignItems: "center", justifyContent: "center", maxHeight: '60%' }]}>
                            <Text style={Styles_screens.modalItemText}>{modalContent?.title}</Text>
                            {loading ? (
                                <ActivityIndicator size="small" color={COLORS.primary} />
                            ) : (
                                modalContent?.details?.length > 0 ? (
                                    modalContent.details.map((detail, index) => (
                                        <View key={index}>
                                            <Text style={Styles_screens.modalItemText}>{detail.label}: {detail.value}</Text>
                                        </View>
                                    ))
                                ) : takerDetailsArray.length > 0 ? (
                                    takerDetailsArray.map((taker, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => showTakerDetails(taker)}
                                            style={[Styles_screens.submitButton, { marginBottom: 10 }]}
                                        >
                                            <Text style={Styles_screens.submitButtonText}>{taker.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={Styles_screens.modalItemText}>{t('noDetailsAvailable')}</Text>
                                )
                            )}
                            <TouchableOpacity onPress={() => setTakerModalVisible(false)} style={[Styles_screens.button, { backgroundColor: COLORS.lightRed }]}>
                                <Text style={[Styles_screens.buttonText, { color: COLORS.white }]}>{t("close")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default BookEditAdmin;
