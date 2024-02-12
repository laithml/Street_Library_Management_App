const firebase = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');




const firebaseConfig = {
    apiKey: "AIzaSyDEtVITxyZNYVPry0DcDFJC7f7WcxU0sUk",
    authDomain: "street-libraries-management.firebaseapp.com",
    projectId: "street-libraries-management",
    storageBucket: "street-libraries-management.appspot.com",
    messagingSenderId: "140208951214",
    appId: "1:140208951214:web:3dd1753fdc02923a79c23f",
    measurementId: "G-37R27XQ0NQ"
};

 const app = firebase.initializeApp(firebaseConfig);

exports.db = getFirestore(app);
exports.auth = getAuth(app);




