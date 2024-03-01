import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";


export const requestPermissionsAsync = async () => {
    await Location.requestForegroundPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
};
export const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        return result.uri;
    }
    return null;
};

export const takePhotoWithCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        return result.uri;
    }
    return null;
};
