import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, SafeAreaView} from 'react-native';
import { useUser } from "../../Context/UserContext";
import { getBookById } from "../../actions/db_actions";
import BookBasic from "../../components/BookBasic";
import Styles_screens from "../../constants/Styles";
import LoadingAnimation from "../../components/LoadingAnimation";

const BookmarksScreen = ({ navigation }) => {
    const { user } = useUser();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (user && user.bookmarks) {
                setLoading(true);
                const bookmarkedBooks = [];
                for (const bookId of user.bookmarks) {
                    const bookData = await getBookById(bookId);
                    if (bookData) {
                        bookmarkedBooks.push(bookData);
                    }
                }
                setBookmarks(bookmarkedBooks);
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [user.bookmarks]);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={Styles_screens.header}>Your Bookmarks</Text>
            <View style={Styles_screens.section}>
                {bookmarks.length > 0 ? (
                    <FlatList
                        data={bookmarks}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <BookBasic book={item} navigation={navigation} />
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                ) : (
                    <Text style={Styles_screens.headerText}>You have no bookmarked books.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default BookmarksScreen;
