import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../Config/Firebase";

export const uploadImagesAndGetURLs = async (images, folder) => {
    const imageUrls = await Promise.all(images.map(async (uri) => {
        // Fetch the image as a blob
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = uri.split('/').pop(); // Extract file name from URI

        // Create a storage reference
        const imageRef = ref(storage, `${folder}/${new Date().toISOString()}-${fileName}`);

        // Start the file upload
        const uploadTask = uploadBytesResumable(imageRef, blob);


        // Wait for upload to complete
        await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Optional: Monitor progress, pause, resume here
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.log(error);
                    reject(error);
                },
                () => {
                    // Handle successful uploads on complete
                    resolve();
                }
            );
        });

        // After upload completes, get the download URL
        return getDownloadURL(uploadTask.snapshot.ref);
    }));

    return imageUrls;
};

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
        quality: 1,
    });

    if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        return uri;
    }
    return null;
};

export const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return null;
    }

    let result = await ImagePicker.launchCameraAsync({
        quality: 1,
    });

    if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        return uri;
    }
    return null;
};
