import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import {getBookById} from "../actions/db_actions";
import LoadingAnimation from "./LoadingAnimation";
import Styles_screens from "../constants/Styles";
import BookBasic from "./BookBasic";


const GenericBooksScreen = ({ navigation, bookIds, title }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            if (bookIds && bookIds.length > 0) {
                setLoading(true);
                const fetchedBooks = [];
                for (const bookId of bookIds) {
                    const bookData = await getBookById(bookId);
                    if (bookData) {
                        fetchedBooks.push(bookData);
                    }
                }
                setBooks(fetchedBooks);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [bookIds]);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={Styles_screens.header}>{title}</Text>
            <View style={Styles_screens.section}>
                {books.length > 0 ? (
                    <FlatList
                        data={books}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <BookBasic book={item} navigation={navigation} />
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                ) : (
                    <Text style={Styles_screens.headerText}>No {title.toLowerCase()} books yet.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default GenericBooksScreen;
