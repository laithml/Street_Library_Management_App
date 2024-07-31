export const processImage = async (imageUri) => {
    const url = 'http://localhost:8000/upload-images';  // Change this URL to your actual FastAPI server URL

    try {
        // Convert the image URI to a blob since fetch API needs FormData with a blob for file upload
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('files', {
            uri: imageUri,
            name: 'image.jpg',  // Adjust the name and extension as needed
            type: 'image/jpeg',  // Adjust the MIME type as needed
        });

        console.log('Sending image to server...');

        // Make the fetch request to the FastAPI server
        const fetchResponse = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('Server response:', fetchResponse);

        if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            console.error('Server responded with error:', errorText);
            throw new Error(`Failed to process image. Server responded with: ${fetchResponse.status} ${fetchResponse.statusText}`);
        }

        // Assuming the server responds with JSON data containing the processed results
        const json = await fetchResponse.json();

        // Print the structure of the object
        console.log('Processed JSON:', JSON.stringify(json, null, 2));

        return json;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image.');
    }
};
