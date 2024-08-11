import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    Linking,
    Alert,
    Modal
} from 'react-native';
import {COLORS, FONTS, SIZES} from "../../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {addBookMark, getBookById, getLocationById, removeBookMark, updateBookStatus, getUserById} from "../../actions/db_actions";
import Styles_screens from "../../constants/Styles";
import {useUser} from "../../Context/UserContext";
import {useTranslation} from "react-i18next";

const LineDivider = () => {
    return (
        <View style={{width: 1, paddingVertical: 5}}>
            <View style={{flex: 1, borderLeftColor: COLORS.lightGray2, borderLeftWidth: 1}}></View>
        </View>
    )
}

const BookDetails = ({route, navigation}) => {
    const {t} = useTranslation();
    const [book, setBook] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [takerDetails, setTakerDetails] = useState(null);
    const {user} = useUser();
    const [modalVisible, setModalVisible] = useState(false);

    const [scrollViewWholeHeight, setScrollViewWholeHeight] = useState(1);
    const [scrollViewVisibleHeight, setScrollViewVisibleHeight] = useState(0);

    const indicator = new Animated.Value(0);

    useEffect(() => {
        let {book} = route.params;
        setBook(book);

        if (book.isTaken && book.takenBy && book.takenBy.length > 0) {
            fetchTakerDetails(book.takenBy[book.takenBy.length - 1]);
        }

        checkBookmarkStatus(book.id);
    }, [route.params, user.bookmarks]);

    const checkBookmarkStatus = (bookId) => {
        setIsBookmarked(user.bookmarks.includes(bookId));
    };

    const fetchTakerDetails = async (takerId) => {
        try {
            const taker = await getUserById(takerId);
            setTakerDetails(taker);
            console.log("Taker details:", taker);
        } catch (error) {
            console.error("Failed to fetch taker details:", error);
        }
    };

    const toggleBookmark = async () => {
        if (isBookmarked) {
            Alert.alert(
                t("removeBookmark"),
                t("removeBookmarkPrompt"),
                [
                    {text: t("cancel"), style: "cancel"},
                    {text: t("remove"), onPress: () => handleRemoveBookmark()}
                ]
            );
        } else {
            await addBookMark(user.id, book.id);
            setIsBookmarked(true);
        }
    };

    const handleRemoveBookmark = async () => {
        await removeBookMark(user.id, book.id);
        setIsBookmarked(false);
    };

    const handleTakeBook = async () => {
        if (!book.isTaken) {
            Alert.alert(
                t("takeBook"),
                t("takeBookPrompt"),
                [
                    {text: t("cancel"), style: "cancel"},
                    {text: t("take"), onPress: async () => {
                            try {
                                await updateBookStatus(book.id, {
                                    isTaken: true,
                                    takenBy: [...(book.takenBy || []), user.id]
                                });

                                const updatedTakenBy = [...(book.takenBy || []), user.id];
                                setBook({...book, takenBy: updatedTakenBy, isTaken: true});

                                const taker = await getUserById(user.id);
                                setTakerDetails(taker);
                            } catch (error) {
                                console.error("Error updating book status:", error);
                            }
                        }}
                ]
            );
        }
    };

    const handleReleaseBook = async () => {
        if (!book.isTaken) {
            Alert.alert(t("bookNotTaken"), t("bookNotTakenPrompt"));

            return;
        }
        Alert.alert(
            t("releaseBook"),
            t("releaseBookPrompt"),
            [
                {text: t("cancel"), style: "cancel"},
                {
                    text: t("release"), onPress: async () => {
                        try {
                            await updateBookStatus(book.id, {
                                isTaken: false,
                                takenBy: []
                            });
                            setBook({...book, isTaken: false, takenBy: []});
                        } catch (error) {
                            console.error("Error releasing book:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleEditBook = () => {
        navigation.navigate("EditBookScreen", {book});
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    function renderBookInfoSection() {
        const isTaken = book.isTaken;

        return (
            <View style={{flex: 1}}>
                <ImageBackground
                    source={{uri: book.images[0]}}
                    resizeMode="cover"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}
                />

                {/* Color Overlay */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: COLORS.black,
                        opacity: 0.6
                    }}
                />

                {/* Navigation header */}
                <View
                    style={{flexDirection: 'row', paddingHorizontal: SIZES.radius, height: 80, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                        style={{marginLeft: SIZES.base}}
                        onPress={() => navigation.navigate("Home")}
                    >
                        <FontAwesome name={"chevron-left"} size={20} color={COLORS.textColor}/>
                    </TouchableOpacity>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.textColor}}>{t("bookDetail")}</Text>
                    </View>

                    <TouchableOpacity
                        style={{marginRight: SIZES.base}}
                        onPress={openModal}
                    >
                        <FontAwesome name={"ellipsis-v"} size={20} color={COLORS.textColor}/>
                    </TouchableOpacity>
                </View>

                {/* Book Cover */}
                <View style={{flex: 5, paddingTop: SIZES.padding2, alignItems: 'center'}}>
                    <Image
                        source={{uri: book.images[0]}}
                        resizeMode="contain"
                        style={{
                            flex: 1,
                            width: 150,
                            height: "auto"
                        }}
                    />
                </View>

                {/* Book Name and Author */}
                <View style={{flex: 1.8, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{...FONTS.h2, color: COLORS.textColor}}>{book.title}</Text>
                    <Text style={{...FONTS.body3, color: COLORS.textColor}}>{book.author}</Text>
                    {isTaken && (
                        <Text style={{...FONTS.body3, color: COLORS.lightRed}}>{t("bookTaken")}</Text>
                    )}
                    {user.isAdmin && isTaken && takerDetails && (
                        <Text style={{...FONTS.body3, color: COLORS.secondary}}>{t("takenBy")}: {takerDetails.name}</Text>
                    )}
                </View>

                {/* Book Info */}
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 20,
                        margin: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: "rgba(0,0,0,0.3)"
                    }}
                >
                    {/* Rating */}
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.white}}>{book.rating}</Text>
                        <Text style={{...FONTS.body4, color: COLORS.white}}>{t("rating")}</Text>
                    </View>

                    <LineDivider/>

                    {/* Pages */}
                    <View style={{flex: 1, paddingHorizontal: SIZES.radius, alignItems: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.white}}>{book.numPages}</Text>
                        <Text style={{...FONTS.body4, color: COLORS.white}}>{t("numPages")}</Text>
                    </View>

                    <LineDivider/>

                    {/* Language */}
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.white}}>{book.language}</Text>
                        <Text style={{...FONTS.body4, color: COLORS.white}}>{t("language")}</Text>
                    </View>
                </View>
            </View>
        );
    }

    function renderBookDescription() {
        const indicatorSize = scrollViewWholeHeight > scrollViewVisibleHeight ? scrollViewVisibleHeight * scrollViewVisibleHeight / scrollViewWholeHeight : scrollViewVisibleHeight;

        const difference = scrollViewVisibleHeight > indicatorSize ? scrollViewVisibleHeight - indicatorSize : 1;

        return (
            <View style={{flex: 1, flexDirection: 'row', padding: SIZES.padding}}>
                {/* Custom Scrollbar */}
                <View style={{width: 4, height: "100%", backgroundColor: COLORS.gray1}}>
                    <Animated.View
                        style={{
                            width: 4,
                            height: indicatorSize,
                            backgroundColor: COLORS.lightGray4,
                            transform: [{
                                translateY: Animated.multiply(indicator, scrollViewVisibleHeight / scrollViewWholeHeight).interpolate({
                                    inputRange: [0, difference],
                                    outputRange: [0, difference],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }}
                    />
                </View>

                {/* Description */}
                <ScrollView
                    contentContainerStyle={{paddingLeft: SIZES.padding2}}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onContentSizeChange={(width, height) => {
                        setScrollViewWholeHeight(height)
                    }}
                    onLayout={({nativeEvent: {layout: {x, y, width, height}}}) => {
                        setScrollViewVisibleHeight(height)
                    }}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: indicator}}}],
                        {useNativeDriver: false}
                    )}
                >
                    <Text style={{...FONTS.h2, color: COLORS.textColor, marginBottom: SIZES.padding}}>{t("description")}</Text>
                    <Text style={{...FONTS.body2, color: COLORS.lightGray}}>{book.description}</Text>
                </ScrollView>
            </View>
        )
    }

    function renderBottomButton() {
        const handleGetDirections = async (bookId) => {
            const book = await getBookById(bookId);
            const bookLocation = await getLocationById(book.location);
            const map_link = "https://www.google.com/maps/dir/?api=1&destination=" + bookLocation.latitude + "," + bookLocation.longitude;
            Linking.openURL(map_link).then(r => console.log(r));
        };

        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                {/* Bookmark */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        backgroundColor: COLORS.lightGray3,
                        marginLeft: SIZES.padding,
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={toggleBookmark}>
                    <FontAwesome name={"bookmark"} size={25}
                                 color={isBookmarked ? COLORS.textColor : COLORS.lightGray}/>
                </TouchableOpacity>

                {/* Take Book */}
                {!book.isTaken && (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.primary,
                            marginHorizontal: SIZES.base,
                            marginVertical: SIZES.base,
                            borderRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={handleTakeBook}
                    >
                        <Text style={{...FONTS.h3, color: COLORS.textColor}}>{t("takeBook")}</Text>
                    </TouchableOpacity>
                )}

                {/* Get Directions */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.secondary,
                        marginHorizontal: SIZES.base,
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => handleGetDirections(book.id)}
                >
                    <Text style={{...FONTS.h3, color: COLORS.white}}>{t("getDirections")}</Text>
                </TouchableOpacity>

                {/* Admin Actions Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={closeModal}
                    >
                        <View
                            style={{
                                width: 250,
                                padding: 20,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <Text style={{...FONTS.h3, marginBottom: 20}}>{t("adminActions")}</Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.secondary,
                                    padding: 10,
                                    borderRadius: SIZES.radius,
                                    marginBottom: 10
                                }}
                                onPress={() => {
                                    closeModal();
                                    handleReleaseBook();
                                }}
                            >
                                <Text style={{...FONTS.body3, color: COLORS.white, textAlign: 'center'}}>{t("releaseBook")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.secondary,
                                    padding: 10,
                                    borderRadius: SIZES.radius
                                }}
                                onPress={() => {
                                    closeModal();
                                    handleEditBook();
                                }}
                            >
                                <Text style={{...FONTS.body3, color: COLORS.white, textAlign: 'center'}}>{t("editBook")}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }

    if (book) {
        return (
            <View style={{flex: 1, backgroundColor: COLORS.backgroundColor}}>
                {/* Book Cover Section */}
                <View style={{flex: 4}}>
                    {renderBookInfoSection()}
                </View>

                {/* Description */}
                <View style={{flex: 2}}>
                    {renderBookDescription()}
                </View>

                {/* Buttons */}
                <View style={{height: 70, marginBottom: 30}}>
                    {renderBottomButton()}
                </View>
            </View>
        )
    } else {
        return (<></>)
    }

}

export default BookDetails;
