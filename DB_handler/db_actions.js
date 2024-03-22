import {db, auth} from "../Config/Firebase";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail} from "firebase/auth";


const getCategories = async () => {
    const categories = [];
    const querySnapshot = await getDocs(collection(db, "Categories"));
    querySnapshot.forEach((doc) => {
        categories.push(doc.data());
    });
    return categories;
}

const createUser = async (user) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const userId = userCredential.user.uid; // Extracting UID from userCredential

        //remove password from user object
        const {password, ...userWithoutPassword} = user;
        userWithoutPassword.id = userId;
        await addDoc(collection(db, "Users"), userWithoutPassword);

        console.log("User created successfully", userWithoutPassword);
        return { success: true, userId: userId };
    } catch (error) {
        console.error("Error creating user:", error.message);
        return { success: false, error: error.message };
    }
}

const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password );
        console.log("User signed in successfully");
        return true;
    }catch (error) {
        console.error("Error signing in:", error);
        return false;
    }
}
const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth,email);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error);
    }
}


const dbHandler = {
    getCategories,
    createUser,
    loginUser,
    resetPassword
}

export default dbHandler;


