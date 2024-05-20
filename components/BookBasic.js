import React, {useEffect, useState} from "react";
import {Image, Text, TouchableOpacity, View, Alert} from "react-native";
import {COLORS, FONTS, SIZES} from "../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {addBookMark, removeBookMark, getCategoryById, getLocationById} from "../actions/db_actions";
import {useUser} from "../Context/UserContext";
import Styles_screens from "../constants/Styles";

const BookBasic = ({navigation, book}) => {
    const [locationName, setLocationName] = useState("Loading...");
    const [genre, setGenre] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const {user} = useUser();

    useEffect(() => {
        getLocationById(book.location).then((loc) => {
            setLocationName(loc.name);
        });


        const fetchGenres = async () => {
            const genrePromises = book.genre.map(genreId => getCategoryById(genreId));
            const fetchedGenres = await Promise.all(genrePromises);
            const sortedGenres = fetchedGenres.sort((a, b) => a.name.length - b.name.length);
            setGenre(sortedGenres.slice(0, 3));
        };


        fetchGenres();
        // Check if the book is already bookmarked
        checkBookmark();
    }, [book]);

    const checkBookmark = () => {
        // Assuming `user.bookmarks` is an array of book ids
        setIsBookmarked(user.bookmarks.includes(book.id));
    };

    const toggleBookmark = () => {
        if (isBookmarked) {
            // Confirm removal
            Alert.alert("Remove Bookmark", "Are you sure you want to remove this bookmark?", [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    onPress: () => {
                        removeBookMark(user.id, book.id);
                        setIsBookmarked(false);
                    },
                },
            ]);
        } else {
            addBookMark(user.id, book.id);
            setIsBookmarked(true);
        }
    };

    return (
        <View style={{marginVertical: SIZES.base}}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row'}}
                              onPress={() => navigation.navigate("BookDetails", {book})}>
                <Image source={{uri: book.images[0]}} resizeMode="cover"
                       style={{width: 100, height: 170, borderRadius: 10}}/>
                <View style={{flex: 1, marginLeft: SIZES.radius}}>
                    <Text
                        style={{paddingRight: SIZES.padding, ...FONTS.h2, color: COLORS.lightGray}}>{book.title}</Text>
                    <Text style={{...FONTS.h3, color: COLORS.lightGray}}>{book.author}</Text>
                    <Text style={{
                        ...FONTS.body4,
                        color: COLORS.lightGray,
                        paddingHorizontal: SIZES.radius
                    }}>{locationName}</Text>
                    <View style={Styles_screens.genreContainer}>
                        {genre.map((category, index) => (
                            <View key={index} style={
                                [Styles_screens.genre,{backgroundColor: category?.color}]
                            }>
                                <Text style={{...FONTS.body3, color: COLORS.black}}>{category?.name}</Text>
                            </View>
                        ))}

                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', top: 5, right: 15}} onPress={toggleBookmark}>
                <FontAwesome name={"bookmark"} size={30} color={isBookmarked ? COLORS.textColor : COLORS.lightGray}/>
            </TouchableOpacity>
        </View>
    );
};

export default BookBasic;
