import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import Styles_screens from "../../constants/Styles";
import { useUser } from "../../Context/UserContext";
import { fetchBooks, fetchCategories, fetchLibraries } from "../../actions/db_actions";
import LoadingAnimation from "../../components/LoadingAnimation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BookItem from "../../components/BookItem";
import BookBasic from "../../components/BookBasic";
import LibrarySelectionModal from "../../components/LibrarySelectionModal";
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState({});
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const pageSize = 10;
    const { user } = useUser();

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            await loadLibraries();
            setLoading(false);
        };

        initialize();
    }, []);

    useEffect(() => {
        if (selectedLibrary !== null) {
            loadBooks(selectedLibrary.id, true);
        }
    }, [selectedLibrary]);

    const loadBooks = async (libraryId = null, reset = false) => {
        try {
            if (reset) {
                setLastVisible(null);
                setBooks([]);
            }
            setLoadingMore(true);
            const { fetchedBooks, lastVisibleDoc } = await fetchBooks(lastVisible, pageSize);
            const filteredBooks = libraryId
                ? fetchedBooks.filter(book => book.location === libraryId)
                : fetchedBooks;
            setBooks(prevBooks => reset ? filteredBooks : [...prevBooks, ...filteredBooks]);
            setLastVisible(lastVisibleDoc);
            setLoadingMore(false);
        } catch (error) {
            console.log("Error loading books:", error);
            setLoadingMore(false);
        }
    };

    const loadCategories = async () => {
        try {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const loadLibraries = async () => {
        try {
            const fetchedLibraries = await fetchLibraries();
            setLibraries(fetchedLibraries);
            const defaultLibrary = fetchedLibraries.find(lib => lib.id === user.defaultLibrary);
            setSelectedLibrary(defaultLibrary || null); // Set the default library or null
            if (!defaultLibrary) {
                loadBooks(null, true); // Load books from all libraries if no default library
            }
        } catch (error) {
            console.error("Failed to fetch libraries:", error);
        }
    };

    const renderCategoryButton = (category) => (
        <TouchableOpacity
            style={[
                Styles_screens.categoryButton,
                activeCategory === category ? Styles_screens.selectedCategory : {},
            ]}
            onPress={() => setActiveCategory(category)}
        >
            <Text style={Styles_screens.genreButtonText}>{category.name}</Text>
        </TouchableOpacity>
    );

    const handleLoadMore = () => {
        if (lastVisible) {
            loadBooks(selectedLibrary ? selectedLibrary.id : null);
        }
    };

    const handleLibrarySelect = (id, name) => {
        setSelectedLibrary({ id, name });  // This will trigger the useEffect to fetch books
    };

    const clearSelectedLibrary = () => {
        setSelectedLibrary(null);
        loadBooks(null, true); // Load all books
    };

    if (loading) {
        return (<LoadingAnimation />);
    }

    return (
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                {/* Header */}
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    paddingHorizontal: SIZES.padding,
                    margin: SIZES.radius
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base }}>
                        {/* Greetings */}
                        <View>
                            <Text style={{ ...FONTS.h3, color: COLORS.textColor }}>{t('welcome')}</Text>
                            <Text style={{ ...FONTS.h2, color: COLORS.textColor }}>{user.name}</Text>
                        </View>

                        {/* Search */}
                        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <FontAwesome name={"search"} size={25} color={COLORS.textColor} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Library Switcher */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 40,
                                paddingHorizontal: 15,
                                borderRadius: 20,
                                backgroundColor: COLORS.textColor,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                            onPress={() => setVisibleLibModel(true)}
                        >
                            <Text style={{ margin: SIZES.base, color: COLORS.white, ...FONTS.body3 }}>
                                {selectedLibrary ? selectedLibrary.name : t('selectLibrary')}
                            </Text>
                            <FontAwesome name={"angle-down"} size={20} color={COLORS.white} />
                        </TouchableOpacity>
                        {selectedLibrary && (
                            <TouchableOpacity onPress={clearSelectedLibrary} style={{ marginLeft: 10 }}>
                                <FontAwesome name={"times"} size={20} color={COLORS.textColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <ScrollView>
                {/* For You Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>{t('forYou')}</Text>
                    {books.length > 0 ? (
                        <FlatList
                            data={books}
                            keyExtractor={(item, index) => `for-you-${item.id}-${index}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => <BookItem navigation={navigation} book={item} />}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={COLORS.primary} />}
                        />
                    ) : (
                        <Text style={{ ...FONTS.body3, color: COLORS.textColor, marginVertical: 10 }}>
                            {t('noBooksAvailable')}
                        </Text>
                    )}
                </View>

                {/* Categories Section */}
                <View style={Styles_screens.section}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item, index) => `category-${item.id}-${index}`}
                        renderItem={({ item }) => renderCategoryButton(item)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    <FlatList
                        data={books}
                        keyExtractor={(item, index) => `book-${item.id}-${index}`}
                        renderItem={({ item }) => <BookBasic navigation={navigation} book={item} />}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={COLORS.primary} />}
                    />
                </View>
            </ScrollView>

            <LibrarySelectionModal
                visible={visibleLibModel}
                onClose={() => setVisibleLibModel(false)}
                libraries={libraries}
                onSelect={(id, name) => handleLibrarySelect(id, name)}
            />
        </SafeAreaView>
    );
}

export default HomeScreen;
