import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Alert,
    Keyboard
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, SIZES } from "../../constants";
import * as Location from "expo-location";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import {
    pickImageFromLibrary,
    requestPermissionsAsync,
    takePhotoWithCamera,
    uploadImagesAndGetURLs
} from "../../Utils/ImagePickerUtils";
import Styles_screens from "../../constants/Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useTranslation } from 'react-i18next';

const AddLibraryScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [location, setLocation] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const descRef = useRef(null);
    const locationRef = useRef(null);

    useEffect(() => {
        requestPermissionsAsync();
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        setIsLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('permissionDenied'), t('locationPermissionDenied'));
                return;
            }
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.error("Error fetching location: ", error);
            Alert.alert(t('error'), t('locationFetchError'));
        } finally {
            setIsLoading(false);
        }
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

    const handleRemoveImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    const handleSubmit = async () => {
        if (!title || !description || !location || images.length === 0) {
            Alert.alert(t('inputError'), t('pleaseFillAllFields'));
            return;
        }

        setIsLoading(true);
        try {
            const imageUrls = await uploadImagesAndGetURLs(images, 'libraries');
            const docRef = await addDoc(collection(db, "LibrariesData"), {
                name: title,
                description,
                latitude: location.latitude,
                longitude: location.longitude,
                imgSrcs: imageUrls,
            });

            await updateDoc(doc(db, "LibrariesData", docRef.id), {
                id: docRef.id
            });

            console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Map');
            Alert.alert(t('success'), t('libraryAddedSuccessfully'));

        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert(t('error'), t('libraryAddError'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    const renderHeader = () => (
        <View>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>{t('addLibrary')}</Text>
            </View>
            <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }} />
            <View style={[Styles_screens.inputContainer, { width: 'auto' }]}>
                <Text style={Styles_screens.inputTitle}>{t('libraryTitle')}</Text>
                <TextInput
                    style={Styles_screens.input}
                    placeholder={t('libraryTitle')}
                    placeholderTextColor={COLORS.textColor}
                    returnKeyType="next"
                    onSubmitEditing={() => descRef.current.focus()}
                    onChangeText={text => setTitle(text)}
                />
                <Text style={Styles_screens.inputTitle}>{t('description')}</Text>
                <TextInput
                    style={[Styles_screens.input, Styles_screens.descriptionInput]}
                    placeholder={t('description')}
                    placeholderTextColor={COLORS.textColor}
                    ref={descRef}
                    returnKeyType="next"
                    onSubmitEditing={() => locationRef.current.focus()}
                    onChangeText={text => setDescription(text)}
                    multiline
                />
                <Text style={Styles_screens.inputTitle}>{t('location')}</Text>
                <GooglePlacesAutocomplete
                    placeholder={t('location')}
                    fetchDetails={true}
                    ref={locationRef}
                    onPress={(data, details = null) => {
                        setLocation({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });
                    }}
                    query={{
                        key: "AIzaSyBGWn55gEQDaNM78WI9brE_RXcBpxdmUFw",
                        language: 'en',
                    }}
                    styles={{
                        textInput: Styles_screens.input,
                    }}
                    textInputProps={{
                        placeholderTextColor: COLORS.textColor,
                    }}
                    enablePoweredByContainer={false}
                />
                {location && (
                    <MapView
                        style={{ height: 300, width: '100%', marginTop: 20, borderRadius: SIZES.radius, overflow: 'hidden' }}
                        region={location}
                        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
                    >
                        <Marker coordinate={location} />
                    </MapView>
                )}
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                    backgroundColor: COLORS.backgroundColor,
                    margin: SIZES.padding
                }}
            >
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <View style={Styles_screens.imageItemContainer}>
                            <Image key={index} source={{ uri: item }} style={Styles_screens.image} />
                            <TouchableOpacity
                                style={Styles_screens.removeImageButton}
                                onPress={() => handleRemoveImage(item)}
                            >
                                <FontAwesome name="times" size={24} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <View style={Styles_screens.imageUploadSection}>
                            <TouchableOpacity onPress={pickImage} style={Styles_screens.addImageButton}>
                                <FontAwesome name="plus" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={Styles_screens.buttonsContainer}>
                    <View style={Styles_screens.buttonsContainerRow}>
                        <TouchableOpacity style={Styles_screens.buttonR} onPress={pickImage}>
                            <Text style={Styles_screens.buttonText}>{t('uploadPhoto')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles_screens.buttonR} onPress={takePhoto}>
                            <Text style={Styles_screens.buttonText}>{t('takePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSubmit}>
                        <Text style={Styles_screens.submitButtonText}>{t('addLibrary')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default AddLibraryScreen;
