import {db, auth} from "../Config/Firebase";
import {
    collection,
    query,
    getDocs,
    limit,
    startAfter,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    addDoc,
    arrayUnion,
    arrayRemove, Timestamp,where
} from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail, signOut} from "firebase/auth";
import {uploadImagesAndGetURLs} from "../Utils/ImagePickerUtils";




const booksCollectionRef = collection(db, "BooksData");
const CategoriesCollectionRef = collection(db, "Categories");
const LibrariesCollectionRef = collection(db, "LibrariesData");


export const addLibrary = async (title, description, location, images,userId) => {
    try {
        // Upload images and get URLs
        const imageUrls = await uploadImagesAndGetURLs(images, 'libraries');

        // Add the library document to Firestore
        const docRef = await addDoc(collection(db, "LibrariesData"), {
            name: title,
            description,
            latitude: location.latitude,
            longitude: location.longitude,
            imgSrcs: imageUrls,
            books: [],
            addedBy: userId,
            addedAt: Timestamp.now(),
            admins: [userId],
            users: [userId]
        });

        // Update the document with its own ID
        await updateDoc(doc(db, "LibrariesData", docRef.id), {
            id: docRef.id
        });

        console.log("Document written with ID: ", docRef.id);
        return docRef.id;

    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error(error.message);
    }
};



export const getUserById = async (id) => {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }

}

export const updateUserBooks = async (userId, bookId) => {
    const userRef = doc(db, "Users", userId);

    // Ensure the booksAdded array exists in the user's document
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        if (!userDoc.data().booksAdded) {
            // If booksAdded array doesn't exist, create it
            await updateDoc(userRef, {
                booksAdded: arrayUnion(bookId)
            });
        } else {
            // If booksAdded array exists, add the bookId to it
            await updateDoc(userRef, {
                booksAdded: arrayUnion(bookId)
            });
        }
    } else {
        // If user document doesn't exist, throw an error or handle as needed
        throw new Error(`User with ID ${userId} does not exist`);
    }
};


export const fetchLibraryById = async (id) => {
    const docRef = doc(db, "LibrariesData", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }

}

export const updateBookDetails = async (bookId, updatedBookData) => {
    const bookRef = doc(db, "BooksData", bookId);

    try {
        // Fetch the existing book document
        const bookSnapshot = await getDoc(bookRef);

        if (!bookSnapshot.exists()) {
            throw new Error(`Book with ID ${bookId} does not exist`);
        }

        const existingBookData = bookSnapshot.data();

        // Merge non-editable fields with the updated data
        const mergedBookData = {
            ...updatedBookData,
            addedBy: existingBookData.addedBy,
            addedAt: existingBookData.addedAt,
            id: existingBookData.id,
            location: existingBookData.location,
            selectedCategory: existingBookData.selectedCategory,
            selectedCondition: existingBookData.selectedCondition,
            takenBy: existingBookData.takenBy,
            isTaken: existingBookData.isTaken      ,
            rating: existingBookData.rating
        };

        // Overwrite the entire book document with the merged data
        await setDoc(bookRef, mergedBookData, { merge: false });

        console.log(`Book ${bookId} updated successfully with merged data.`);
        return true;
    } catch (error) {
        console.error("Error updating book details:", error);
        throw new Error(error.message);
    }
};


export const fetchLibraries = async () => {
    try {
        const q = query(LibrariesCollectionRef);
        const querySnapshot = await getDocs(q);
        const libraries = [];
        querySnapshot.forEach((doc) => {
            libraries.push({ id: doc.id, ...doc.data() });
        });
        return libraries;
    } catch (error) {
        console.error("Failed to fetch libraries:", error);
        return []; // Return an empty array on error
    }
};

export const releaseBook = async (bookId) => {
    const bookRef = doc(db, "BooksData", bookId);

    try {
        // Update only the `isTaken` field to `false`
        await updateDoc(bookRef, {
            isTaken: false
        });

        console.log(`Book ${bookId} released successfully.`);
    } catch (error) {
        console.error("Error releasing book:", error);
        throw new Error(error.message);
    }
}

export const updateUserDefaultLibrary = async (userId, newLibraryId) => {
    const userRef = doc(db, "Users", userId);

    try {
        // Fetch the user's current data
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const currentLibraryId = userData.defaultLibrary;

        if (currentLibraryId) {
            // Remove the user from the current library's users array
            const currentLibraryRef = doc(db, "LibrariesData", currentLibraryId);
            await updateDoc(currentLibraryRef, {
                users: arrayRemove(userId)
            });
        }

        // Add the user to the new library's users array
        const newLibraryRef = doc(db, "LibrariesData", newLibraryId);
        await updateDoc(newLibraryRef, {
            users: arrayUnion(userId)
        });

        // Update the user's default library
        await updateDoc(userRef, {
            defaultLibrary: newLibraryId
        });

        console.log(`User ${userId} default library updated from ${currentLibraryId} to ${newLibraryId}`);
    } catch (error) {
        console.error("Error updating default library: ", error);
        throw new Error(error.message);
    }
};

export const updateBookStatus = async (bookId, userId) => {
    const bookRef = doc(db, "BooksData", bookId);

    try {
        await updateDoc(bookRef, {
            takenBy: arrayUnion(userId),
            isTaken: true
        });

        console.log(`Book ${bookId} updated successfully with user ${userId} as taken.`);
    } catch (error) {
        console.error("Error updating book status:", error);
        throw new Error(error.message);
    }
};

export const addBook = async (bookData) => {
    try {
        const bookRef = await addDoc(collection(db, "BooksData"), bookData);
        await updateDoc(doc(db, "BooksData", bookRef.id), {
            id: bookRef.id
        });

        const libraryRef = doc(db, "LibrariesData", bookData.location);
        const librarySnap = await getDoc(libraryRef);
        if (librarySnap.exists()) {
            const currentBooks = librarySnap.data().books || [];
            await updateDoc(libraryRef, {
                books: [...currentBooks, bookRef.id]
            });
            console.log("Library updated with new book ID");
        } else {
            console.log("No such library document!");
        }

        return bookRef.id;
    } catch (error) {
        console.error("Error adding book: ", error);
        throw new Error(error);
    }
};

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
    try {
        await updateDoc(userDocRef, {
            bookmarks: arrayUnion(bookId)
        });
        return true;
    } catch (error) {
        console.error("Error adding bookmark: ", error);
        return false;
    }
};


export const removeBookMark = async (userId, bookId) => {
    console.log("Removing bookmark for user:", userId, "book:", bookId);
    const userDocRef = doc(db, "Users", userId);
    try {
        await updateDoc(userDocRef, {
            bookmarks: arrayRemove(bookId)
        });
        return true;
    } catch (error) {
        console.error("Error removing bookmark: ", error);
        return false;
    }
};



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
        console.log("Document data:", docSnap.data());
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


export const fetchBooks = async (libraryId, lastVisible = null, pageSize = 10) => {
    try {
        let q;

        if (lastVisible) {
            // Add filtering by libraryId
            q = query(
                collection(db, "BooksData"),
                where("location", "==", libraryId),
                startAfter(lastVisible),
                limit(pageSize)
            );
        } else {
            // Add filtering by libraryId
            q = query(
                collection(db, "BooksData"),
                where("location", "==", libraryId),
                limit(pageSize)
            );
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
        console.error("Error fetching books with pagination:", error);
        throw new Error(error.message);
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


export const fetchAdmins = async (libraryId) => {
    const libraryRef = doc(db, "LibrariesData", libraryId);

    try {
        const libraryDoc = await getDoc(libraryRef);
        if (libraryDoc.exists()) {
            const admins = libraryDoc.data().admins || [];
            return admins;
        } else {
            console.error("No such library!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching admins: ", error);
        throw new Error(error.message);
    }
};


export const addAdmin = async (libraryId, userId) => {
    const libraryRef = doc(db, "LibrariesData", libraryId);
    const userRef = doc(db, "Users", userId);

    try {
        await updateDoc(libraryRef, {
            admins: arrayUnion(userId)
        });

        await updateDoc(userRef, {
            libraries: arrayUnion(libraryId),
            isAdmin: true
        });

        console.log(`User ${userId} added as admin to library ${libraryId}`);
    } catch (error) {
        console.error("Error adding admin: ", error);
        throw new Error(error.message);
    }
};

export const removeAdmin = async (libraryId, userId) => {
    const libraryRef = doc(db, "LibrariesData", libraryId);
    const userRef = doc(db, "Users", userId);

    try {
        await updateDoc(libraryRef, {
            admins: arrayRemove(userId)
        });

        //if it's last library of user, remove isAdmin
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        if (userData.libraries.length === 1) {
            await updateDoc(userRef, {
                isAdmin: false
            });
        }

        await updateDoc(userRef, {
            libraries: arrayRemove(libraryId)
        })


        console.log(`User ${userId} removed as admin from library ${libraryId}`);
    } catch (error) {
        console.error("Error removing admin: ", error);
        throw new Error(error.message);
    }
};



export const fetchUsers = async () => {
    const usersRef = collection(db, "Users");

    try {
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        return users;
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw new Error(error.message);
    }
};

export const userFromId = async (id) => {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}


