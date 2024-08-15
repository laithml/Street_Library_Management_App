import {uploadImagesAndGetURLs} from "../Utils/ImagePickerUtils";

export const processImage = async (imageUri) => {

    try {
        // Upload the image to Firebase Storage and get the download URL
        const [downloadURL] = await uploadImagesAndGetURLs([imageUri], 'images');
        console.log('Sending image URL to server:', downloadURL);
        const url = `https://laithml_bookscannerapi.jce.ac/upload-image-url?imageUrl=${encodeURIComponent(downloadURL)}`;

        // Send the image URL to the FastAPI server
        const fetchResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ imageUrl: downloadURL }),
        });

        console.log('Server responded with status:', fetchResponse.status);

        if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            console.error('Server responded with error:', errorText);
            throw new Error(`Failed to process image. Server responded with: ${fetchResponse.status} ${fetchResponse.statusText}`);
        }

        return await fetchResponse.json();
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image.');
    }
};
