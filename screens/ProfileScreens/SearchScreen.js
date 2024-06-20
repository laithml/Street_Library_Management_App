import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import Styles_screens from "../../constants/Styles";
import { fetchBooks } from "../../actions/db_actions";
import BookBasic from "../../components/BookBasic";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.trim() === "") return;

        setLoading(true);
        try {
            const { fetchedBooks } = await fetchBooks();
            const results = fetchedBooks.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results: ", error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <SafeAreaView style={{flex : 1}}>
            <View style={{
                height: '10%',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <TextInput
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.primary,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        color: COLORS.textColor,
                        margin: SIZES.margin,
                    }}
                    placeholder="Search for books..."
                    placeholderTextColor={COLORS.gray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
            </View>
            <View style={Styles_screens.section}>
                <Text style={Styles_screens.sectionTitle}>Search Results</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
                ) : searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <BookBasic navigation={navigation} book={item} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <Text style={{ ...FONTS.body3, color: COLORS.textColor, marginVertical: 10 }}>No books found.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;
