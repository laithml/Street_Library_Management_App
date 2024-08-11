import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth,browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBGWn55gEQDaNM78WI9brE_RXcBpxdmUFw",
    authDomain: "street-libraries-management.firebaseapp.com",
    projectId: "street-libraries-management",
    storageBucket: "street-libraries-management.appspot.com",
    messagingSenderId: "140208951214",
    appId: "1:140208951214:web:3dd1753fdc02923a79c23f",
    measurementId: "G-37R27XQ0NQ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: browserLocalPersistence // Use local storage for persistence
});
export const storage = getStorage(app);
