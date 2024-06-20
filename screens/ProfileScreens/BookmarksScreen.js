import React from 'react';
import { useUser } from "../../Context/UserContext";
import GenericBooksScreen from "../../components/GenericBooksScreen";

const BookmarksScreen = ({ navigation }) => {
    const { user } = useUser();

    return (
        <GenericBooksScreen
            navigation={navigation}
            bookIds={user.bookmarks ? user.bookmarks : []}
            title="Bookmarks"
        />
    );
};

export default BookmarksScreen;
