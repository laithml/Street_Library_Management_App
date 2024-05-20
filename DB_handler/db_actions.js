import {db, auth} from "../Config/Firebase";
import {collection, query, getDocs, limit, startAfter, getDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail, signOut} from "firebase/auth";




const booksCollectionRef = collection(db, "BooksData");
const usersCollectionRef = collection(db, "Users");
const CategoriesCollectionRef = collection(db, "Categories");
const LibrariesCollectionRef = collection(db, "LibrariesData");


export const getCategoryById = async (id) => {
    const docRef = doc(db, "Categories", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}

export const addBookMark = async (userId, bookId) => {
    console.log("Adding bookmark for user:", userId, "book:", bookId);
    const userDocRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const user = userDoc.data();
        // Ensure that the bookmarks field exists, initialize if necessary
        if (!user.bookmarks) {
            user.bookmarks = [];
        }
        if (!user.bookmarks.includes(bookId)) {
            user.bookmarks.push(bookId);
            await setDoc(userDocRef, user);
            return true;
        }
        return false;
    }
    return false;
}

export const removeBookMark = async (userId, bookId) => {
    console.log("Removing bookmark for user:", userId, "book:", bookId);
    const userDocRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const user = userDoc.data();
        if (user.bookmarks && user.bookmarks.includes(bookId)) {
            user.bookmarks = user.bookmarks.filter((id) => id !== bookId);
            await setDoc(userDocRef, user);
            return true;
        }
        return false;
    }
    return false;

}



export const getBookById = async (id) => {
    const docRef = doc(db, "BooksData", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}



export const getLocationById = async (id) => {
    const docRef = doc(db, "LibrariesData", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }

}

export const fetchCategories = async () => {
    try {
        const querySnapshot = await getDocs(CategoriesCollectionRef);
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push(doc.data());
        });
        return categories;
    } catch (error) {
        console.log("Error fetching categories:", error);
        throw new Error(error);
    }
}


export const fetchBooks = async (lastVisible, pageSize) => {
    try {
        let q;
        if (lastVisible) {
            q = query(booksCollectionRef, startAfter(lastVisible), limit(pageSize));
        } else {
            q = query(booksCollectionRef, limit(pageSize));
        }

        const querySnapshot = await getDocs(q);
        const fetchedBooks = [];
        let lastVisibleDoc = null;

        querySnapshot.forEach((doc) => {
            fetchedBooks.push({ ...doc.data(), id: doc.id });
            lastVisibleDoc = doc;
        });

        return { fetchedBooks, lastVisibleDoc };
    } catch (error) {
        console.log("Error fetching books with pagination:", error);
        throw new Error(error);
    }
};

export const getCategories = async () => {
    const categories = [];
    const querySnapshot = await getDocs(collection(db, "Categories"));
    querySnapshot.forEach((doc) => {
        categories.push(doc.data());
    });
    return categories;
}

export const createUser = async (user) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const userId = userCredential.user.uid; // Extracting UID from userCredential

        //remove password from user object
        const {password, ...userWithoutPassword} = user;
        userWithoutPassword.id = userId;

        // Using setDoc to create or overwrite the document with userId as the document ID
        let userDocRef = doc(db, "Users", userId);
        await setDoc(userDocRef, userWithoutPassword);
        console.log("User created successfully", userId);
        return { success: true, userId: userId };
    } catch (error) {
        console.error("Error creating user:", error.message);
        return { success: false, error: error.message };
    }
};
export const loginUser = async (email, password) => {
    try {
        const userID=await signInWithEmailAndPassword(auth, email, password );

        console.log(userID.user.uid);
        //fetch user data
        const userDoc = await getDoc(doc(db, "Users", userID.user.uid));
        const userData = userDoc.data();
        console.log("User signed in successfully");
        return { success: true, userData };
    }catch (error) {
        console.error("Error signing in:", error);
        return {success: false, error: error.message};
    }
}
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth,email);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error);
    }
}


export const logoutUser = async () => {
    try {
        const status=await signOut(auth);
        console.log(status);
        console.log("User signed out successfully");
        return true;

    } catch (error) {
        console.error("Error signing out:", error);
        return false;
    }

}




