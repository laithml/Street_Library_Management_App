import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES, } from '../../constants';
import Styles_screens from "../../constants/Styles";
import { fetchBooks, fetchCategories, fetchLibraries } from "../../actions/db_actions";
import LoadingAnimation from "../../components/LoadingAnimation";
import BookItem from "../../components/BookItem";
import BookBasic from "../../components/BookBasic";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useUser } from "../../Context/UserContext";
import LibrarySelectionModal from "../../components/LibrarySelectionModal";

const HomeScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState({});
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const pageSize = 10;
    const { user } = useUser();

    useEffect(() => {
        setLoading(true);
        loadBooks(user.defaultLibrary, true);
        loadCategories();
        loadLibraries();
        setLoading(false);
    }, [user.defaultLibrary]);

    const loadBooks = async (libraryId, reset = false) => {
        try {
            if (reset) {
                setLastVisible(null);
                setBooks([]);
            }
            const { fetchedBooks, lastVisibleDoc } = await fetchBooks(lastVisible, pageSize);
            const filteredBooks = fetchedBooks.filter(book => book.location === libraryId);
            setBooks(prevBooks => reset ? filteredBooks : [...prevBooks, ...filteredBooks]);
            setLastVisible(lastVisibleDoc);
            setLoading(false);
        } catch (error) {
            console.log(error);
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
            setSelectedLibrary(defaultLibrary);
        } catch (error) {
            console.error("Failed to fetch libraries:", error);
        }
    };

    const renderCategoryButton = (category) => {
        return (
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
    };

    const handleLoadMore = () => {
        if (lastVisible) {
            loadBooks(selectedLibrary.id);
        }
    };

    const handleLibrarySelect = (id, name) => {
        setSelectedLibrary({ id, name });
        loadBooks(id, true);
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
                            <Text style={{ ...FONTS.h3, color: COLORS.textColor }}>Welcome</Text>
                            <Text style={{ ...FONTS.h2, color: COLORS.textColor }}>{user.name}</Text>
                        </View>

                        {/* Search */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Search')}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <FontAwesome name={"search"} size={25} color={COLORS.textColor} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Library Switcher */}
                    <TouchableOpacity
                        style={{
                            height: 40,
                            paddingHorizontal: 15,
                            borderRadius: 20,
                            backgroundColor: COLORS.textColor,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onPress={() => setVisibleLibModel(true)}
                    >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={{ margin: SIZES.base, color: COLORS.white, ...FONTS.body3 }}>
                                {selectedLibrary ? selectedLibrary.name : 'Select Library'}
                            </Text>
                            <FontAwesome name={"angle-down"} size={20} color={COLORS.white} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {/* For You Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>For You</Text>
                    {books.length > 0 ? (
                        <FlatList
                            data={books}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => <BookItem navigation={navigation} book={item} />}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.1}
                        />
                    ) : (
                        <Text style={{ ...FONTS.body3, color: COLORS.textColor, marginVertical: 10 }}>
                            No books available in this library.
                        </Text>
                    )}
                </View>

                {/* Categories Section */}
                <View style={Styles_screens.section}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => renderCategoryButton(item)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    <FlatList
                        data={books}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <BookBasic navigation={navigation} book={item} />}
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
