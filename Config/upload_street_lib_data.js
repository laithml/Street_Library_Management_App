// const fs = require('fs');
// // const xml2js = require('xml2js');
// const {collection, addDoc} = require('firebase/firestore');
// const xml2js = require('xml2js');
// // Path to your XML file
// const xmlFilePath = './Street_libraries.xml';
// const {db} = require('./Firebase');
//
// // Read the XML file
// fs.readFile(xmlFilePath, (err, data) => {
//     if (err) {
//         console.error("Error reading XML file:", err);
//         return;
//     }
//
//     // Parse XML to JSON
//     xml2js.parseString(data, (err, result) => {
//         if (err) {
//             console.error("Error parsing XML:", err);
//             return;
//         }
//
//         // Array to hold all libraries
//         const libraries = [];
//
//         // Assuming the structure based on the provided snippet
//         const placemarks = result.Folder.Placemark;
//         placemarks.forEach(placemark => {
//             const name = placemark.name[0];
//             const description = placemark.description[0];
//             let image = '';
//             let coordinates = '';
//
//             if (placemark.ExtendedData && placemark.ExtendedData[0].Data) {
//                 const data = placemark.ExtendedData[0].Data.find(d => d.$.name === 'gx_media_links');
//                 if (data && data.value && data.value[0]) {
//                     image = data.value[0];
//                 }
//             }
//
//             if (placemark.Point && placemark.Point[0].coordinates && placemark.Point[0].coordinates[0]) {
//                 coordinates = placemark.Point[0].coordinates[0];
//             }
//
//             const library = {
//                 name: name,
//                 description: description,
//                 coordinates: coordinates,
//                 imageUrl: image
//             };
//             libraries.push(library);
//         });
//
//         fs.writeFile("./Data.json", JSON.stringify(libraries, null, 2), (err) => {
//             if (err) {
//                 console.error('Error writing file:', err);
//             } else {
//                 console.log('File has been written successfully');
//             }
//         });
//     });
// });
//
//
// // Path to the original JSON file
// const inputJsonFilePath = './Data.json';
// // Path for the cleaned JSON file
// const outputJsonFilePath = './cleaned_libraries.json';
//
// // Read the original JSON file
// fs.readFile(inputJsonFilePath, 'utf8', (readErr, data) => {
//     if (readErr) {
//         console.error('Error reading JSON file:', readErr);
//         return;
//     }
//
//     // Parse the JSON data
//     let libraries = JSON.parse(data);
//
//     // Process each library to clean up data
//     const cleanedLibraries = libraries.map(library => {
//         const cleanedLibrary = {...library};
//
//         // Clean up the name and description by trimming and removing unnecessary newlines/spaces
//         cleanedLibrary.name = cleanedLibrary.name.trim();
//         cleanedLibrary.description = cleanedLibrary.description.trim().replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
//
//         // Extract only the URL from the imageUrl field
//         const imageUrlMatch = cleanedLibrary.imageUrl.match(/https?:\/\/[^ ]+/g);
//         cleanedLibrary.imageUrl = imageUrlMatch ? imageUrlMatch[0] : '';
//
//         // Clean up coordinates by removing newlines and spaces, keeping only the numerical values
//         cleanedLibrary.coordinates = cleanedLibrary.coordinates.replace(/[\n\s]/g, '');
//
//         return cleanedLibrary;
//     });
//
//     // Write the cleaned data to a new JSON file
//     fs.writeFile(outputJsonFilePath, JSON.stringify(cleanedLibraries, null, 2), 'utf8', (writeErr) => {
//         if (writeErr) {
//             console.error('Error writing cleaned JSON file:', writeErr);
//             return;
//         }
//         console.log('Cleaned JSON file has been saved.');
//     });
// });
//
//
// // Read the cleaned JSON file
//
// fs.readFile("./cleaned_libraries.json", 'utf8', async (error, data) => {
//     if (error) {
//         console.error('Error reading JSON file:', error);
//         return;
//     }
//
//     const libraries = JSON.parse(data);
//     const librariesCollectionRef = collection(db, 'LibrariesData');
//
//     // Using Promise.all to wait for all documents to be added
//     try {
//         await Promise.all(libraries.map(library => addDoc(librariesCollectionRef, library)));
//         console.log('All documents have been added successfully');
//     } catch (err) {
//         console.error('Error adding documents:', err);
//     }
// });
