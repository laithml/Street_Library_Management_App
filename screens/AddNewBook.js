import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    SafeAreaView,
    ScrollView, Modal
} from 'react-native';
import Styles_screens from "../constants/Styles";
import {COLORS} from "../constants";
import {pickImageFromLibrary, requestPermissionsAsync, takePhotoWithCamera} from "../Utils/ImagePickerUtils";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../Config/Firebase";

const AddNewBook = () => {
    const conditions = [
        {label: "New"},
        {label: "Used - Good"},
        {label: "Used - Acceptable"}
    ];
    const [selectedCondition, setSelectedCondition] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const [selectedLib, setSelectedLib] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        condition: '',
        location: '',
        images: [],
    });
    const [images, setImages] = useState([]);

    const [libraries, setLibraries] = useState([]);

    useEffect(() => {
        const fetchLibraries = async () => {
            const querySnapshot = await getDocs(collection(db, 'LibrariesData'));
            const librariesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLibraries(librariesData);
        };

        fetchLibraries();
    }, []);
    useEffect(() => {
        requestPermissionsAsync();
    }, []);
    const handleInputChange = (name, value) => {
        setFormData({...formData, [name]: value});
    };

    const pickImage = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            setImages([...images, uri]);
        }
    };

    const takePhoto = async () => {
        const uri = await takePhotoWithCamera();
        if (uri) {
            setImages([...images, uri]);
        }
    };

    const handleSubmit = () => {
        // Validate form data, then save to database or send to API endpoint
        console.log(formData);
        Alert.alert("Book Submitted", "Your book has been successfully submitted!");
    };

    return (
        <ScrollView style={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.inputContainer}>

                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={Styles_screens.input}
                        placeholder="Book Title"
                        onChangeText={(text) => handleInputChange('title', text)}
                        value={formData.title}
                    />
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={Styles_screens.input}
                        placeholder="Book Author"
                        onChangeText={(text) => handleInputChange('author', text)}
                        value={formData.author}
                    />
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, Styles_screens.descriptionInput]}
                        placeholder="Book Description (Optional)"
                        onChangeText={(text) => handleInputChange('description', text)}
                        value={formData.description}
                        multiline
                    />

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
                                            handleInputChange('condition', condition.label);
                                            setSelectedCondition(condition.label);
                                            setVisible(false);
                                        }}>
                                        <Text style={Styles_screens.modalItemText}>{condition.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={[Styles_screens.button, {width: "100%"}]}
                                      onPress={() => setVisibleLibModel(true)}>
                        <Text style={Styles_screens.buttonText}>
                            {"Library: " + (selectedLib || "Choose Library Location")}
                        </Text>
                    </TouchableOpacity>
                    <Modal visible={visibleLibModel} animationType="slide" transparent={true}>
                        <View style={Styles_screens.modalContainer}>
                            <View style={Styles_screens.modalContent}>
                                <TextInput
                                    style={Styles_screens.searchInput}
                                    placeholder="Search Library..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <ScrollView style={{maxHeight: '80%'}}>
                                    {libraries.filter(library => library.name?.toLowerCase()
                                        .includes(searchQuery.toLowerCase())).map((library, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={Styles_screens.modalItem}
                                            onPress={() => {
                                                handleInputChange('location', library.id);
                                                setSelectedLib(library.name); // Update to display library name instead of ID
                                                setVisibleLibModel(false);
                                                setSearchQuery(''); // Clear search query upon selection
                                            }}>
                                            <Text style={Styles_screens.modalItemText}>{library.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>

            <View style={Styles_screens.buttonsContainer}>
                <TouchableOpacity style={Styles_screens.button} onPress={pickImage}>
                    <Text style={Styles_screens.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.button} onPress={takePhoto}>
                    <Text style={Styles_screens.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                {formData.image && <Image source={{uri: formData.image}} style={Styles_screens.image}/>}
                <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSubmit}>
                    <Text style={Styles_screens.submitButtonText}>Add Book</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


export default AddNewBook;
