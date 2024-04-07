import {Image, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {COLORS, FONTS, SIZES} from "../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {getCategoryById, getLocationById} from "../DB_handler/db_actions";

const BookBasic = ({navigation, book}) => {
    const [locationName, setLocationName] = useState("Loading...");
    const [genre, setGenre] = useState([])

    useEffect(() => {
        getLocationById(book.location).then((loc) => {
            setLocationName(loc.name);
        });

        const fetchGenres = async () => {
            const genrePromises = book.genre.map((genreId) => {
                return getCategoryById(genreId).then((cat) => cat.name);
            });

            const genres = await Promise.all(genrePromises);
            setGenre(genres);
        };

        fetchGenres();
    }, [book.location, book.genre]);

    return (
        <View style={{marginVertical: SIZES.base}}>
            <TouchableOpacity
                style={{flex: 1, flexDirection: 'row'}}
                onPress={() => navigation.navigate("BookDetails", {
                    book: book
                })}
            >
                {/* Book Cover */}
                <Image
                    source={{uri: book.images[0]}}
                    resizeMode="cover"
                    style={{width: 100, height: 170, borderRadius: 10}}
                />

                <View style={{flex: 1, marginLeft: SIZES.radius}}>
                    {/* Book name and author */}
                    <View>
                        <Text style={{
                            paddingRight: SIZES.padding, ...FONTS.h2,
                            color: COLORS.lightGray
                        }}>{book.title}</Text>
                        <Text style={{...FONTS.h3, color: COLORS.lightGray}}>{book.author}</Text>
                    </View>

                    {/* Book Info */}
                    <View style={{flexDirection: 'row', marginTop: SIZES.radius}}>
                        <FontAwesome name={"map-pin"} size={20} color={COLORS.lightGray}/>
                        <Text style={{
                            ...FONTS.body4,
                            color: COLORS.lightGray,
                            paddingHorizontal: SIZES.radius
                        }}>{locationName}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: SIZES.radius}}>
                        <FontAwesome name={"book"} size={20} color={COLORS.lightGray}/>
                        <Text style={{
                            ...FONTS.body4,
                            color: COLORS.lightGray,
                            paddingHorizontal: SIZES.radius
                        }}>{book.numPages}</Text>
                        <FontAwesome name={"star"} size={20} color={COLORS.lightGray}/>
                        <Text style={{
                            ...FONTS.body4,
                            color: COLORS.lightGray,
                            paddingHorizontal: SIZES.radius
                        }}>{book.rating}</Text>

                    </View>


                    {/* Genre */}
                    <View style={{flexDirection: 'row', marginTop: SIZES.base}}>
                        {
                            genre.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 5,
                                            marginRight: SIZES.radius,
                                            height: 40,
                                            borderRadius: 10,
                                            backgroundColor: COLORS.darkGreen
                                        }}
                                    >
                                        <Text style={{...FONTS.body3, color: COLORS.lightGreen}}>{item}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </TouchableOpacity>

            {/* Bookmark Button */}
            <TouchableOpacity
                style={{position: 'absolute', top: 5, right: 15}}
                onPress={() => console.log("Bookmark")}
            >
                <FontAwesome name={"bookmark"} size={30} color={COLORS.lightGray}/>
            </TouchableOpacity>
        </View>
    );
};


export default BookBasic;
