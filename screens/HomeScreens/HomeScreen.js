import React, {useEffect, useState} from "react";
import {SafeAreaView, View, Text, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import {COLORS, FONTS, SIZES,} from '../../constants';
import Styles_screens from "../../constants/Styles";
import {fetchBooks, fetchCategories} from "../../DB_handler/db_actions";
import LoadingAnimation from "../../components/LoadingAnimation";
import BookItem from "../../components/BookItem";
import BookBasic from "../../components/BookBasic";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useUser} from "../../Context/UserContext";

const HomeScreen = ({navigation}) => {
    const [books, setBooks] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState({});
    const pageSize = 10;
    const {user} = useUser();
    console.log(user);

    useEffect(() => {
        setLoading(true);
        loadBooks();
        loadCategories();
        setLoading(false);
    }, []);

    const loadBooks = async () => {
        try {
            const {fetchedBooks, lastVisibleDoc} = await fetchBooks(lastVisible, pageSize);
            setBooks(prevBooks => [...prevBooks, ...fetchedBooks]);
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
    }


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

    }

    const handleLoadMore = () => {
        if (lastVisible) {
            loadBooks();
        }
    };

    if (loading) {
        return (<LoadingAnimation/>);
    }


    return (
        <SafeAreaView style={Styles_screens.container}>
            <View style={{height: '10%', flexDirection: 'row', alignItems: 'spcae-between'}}>
                {/* Header */}
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: SIZES.padding,
                    alignItems: 'center',
                    margin: SIZES.radius
                }}>
                    {/* Greetings */}
                    <View>
                        <View style={{marginRight: SIZES.padding}}>
                            <Text style={{...FONTS.h3, color: COLORS.textColor}}>Welcome</Text>
                            <Text style={{...FONTS.h2, color: COLORS.textColor}}>{user.name}</Text>
                        </View>
                    </View>

                    {/* Points */}
                    <TouchableOpacity
                        style={{
                            height: 40,
                            paddingRight: 20,
                            borderRadius: 20,
                            marginLeft: 80,
                            backgroundColor: COLORS.primary
                        }}
                        onPress={() => {
                            console.log("Search")
                        }}
                    >
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 30,
                                height: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 35,
                                backgroundColor: COLORS.primary
                            }}>
                                <FontAwesome name={"search"} size={20} color={COLORS.textColor}/>
                            </View>
                            <Text
                                style={{marginLeft: SIZES.base, color: COLORS.textColor, ...FONTS.body3}}>Search</Text>


                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {/* For You Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>For You</Text>
                    <FlatList
                        data={books}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => <BookItem navigation={navigation} book={item}/>}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                    />
                </View>


                {/* Categories Section */}
                <View style={Styles_screens.section}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => renderCategoryButton(item)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    <FlatList
                        data={books}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => <BookBasic navigation={navigation} book={item}/>}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}


export default HomeScreen;
