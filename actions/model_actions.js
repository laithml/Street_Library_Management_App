export const processImage = async (imageUri) => {
    const url = 'http://172.20.10.2:8000/process-image/';  // Change this URL to your actual FastAPI server URL

    try {
        // Convert the image URI to blob since fetch API needs FormData with a blob for file upload
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');  // Append the blob to FormData, 'image.jpg' is the filename that will be used on the server side

        console.log('Sending image to server...');
        console.log('response:', response);
        console.log('Image URI:', imageUri);
        console.log('Image blob:', blob);
        // Make the fetch request to the FastAPI server
        const fetchResponse = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        // Assuming the server responds with JSON data containing the processed results
        const json = await fetchResponse.json();

        return json;  // Contains texts and images from the processed image
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image.');
    }
};
