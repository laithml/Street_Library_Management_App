import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import Styles_screens from "../../constants/Styles";
import { fetchBooks, fetchLibraries } from "../../actions/db_actions";
import BookBasic from "../../components/BookBasic";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LibrarySelectionModal from '../../components/LibrarySelectionModal';
import { debounce } from 'lodash';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [visibleLibModel, setVisibleLibModel] = useState(false);

    useEffect(() => {
        const loadLibraries = async () => {
            try {
                const fetchedLibraries = await fetchLibraries();
                setLibraries(fetchedLibraries);
            } catch (error) {
                console.error('Failed to fetch libraries:', error);
            }
        };

        loadLibraries();
    }, []);

    const debouncedSearch = debounce(async (query) => {
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const { fetchedBooks } = await fetchBooks();
            const results = fetchedBooks.filter(book =>
                book.title.toLowerCase().includes(query.toLowerCase()) &&
                (!selectedLibrary || book.location === selectedLibrary.id)
            );
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    }, 600);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, selectedLibrary]);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const clearSelectedLibrary = () => {
        setSelectedLibrary(null);
        debouncedSearch(searchQuery);
    };

    const handleLibrarySelect = (id, name) => {
        setSelectedLibrary({ id, name });
        setVisibleLibModel(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
            <View style={{ marginVertical: 10, paddingHorizontal: SIZES.base }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 20 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            paddingHorizontal: 15,
                            color: COLORS.textColor,
                            height: 40,
                        }}
                        placeholder="Search for books..."
                        placeholderTextColor={COLORS.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch} style={{ paddingHorizontal: 10 }}>
                            <FontAwesome name={'times'} size={20} color={COLORS.textColor} />
                        </TouchableOpacity>
                    ) : null}
                </View>
                {/* Library Switcher */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            height: 40,
                            paddingHorizontal: 15,
                            borderRadius: 20,
                            backgroundColor: COLORS.textColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        onPress={() => setVisibleLibModel(true)}
                    >
                        <Text style={{ margin: SIZES.base, color: COLORS.white, ...FONTS.body3 }}>
                            {selectedLibrary ? selectedLibrary.name : 'Select Library'}
                        </Text>
                        <FontAwesome name={'angle-down'} size={20} color={COLORS.white} />
                    </TouchableOpacity>
                    {selectedLibrary && (
                        <TouchableOpacity onPress={clearSelectedLibrary} style={{ marginLeft: 10 }}>
                            <FontAwesome name={'times'} size={20} color={COLORS.textColor} />
                        </TouchableOpacity>
                    )}
                </View>
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

            <LibrarySelectionModal
                visible={visibleLibModel}
                onClose={() => setVisibleLibModel(false)}
                libraries={libraries}
                onSelect={handleLibrarySelect}
            />
        </SafeAreaView>
    );
};

export default SearchScreen;
