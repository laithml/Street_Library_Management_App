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
    Alert
} from 'react-native';
import {COLORS, FONTS, SIZES} from "../../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {addBookMark, getBookById, getLocationById, removeBookMark, updateBookStatus, getUserById} from "../../actions/db_actions";
import {useLocation} from "../../Context/LocationContext";
import SelectionModal from "../../components/SelectionModal";
import Styles_screens from "../../constants/Styles";
import {useUser} from "../../Context/UserContext";

const LineDivider = () => {
    return (
        <View style={{width: 1, paddingVertical: 5}}>
            <View style={{flex: 1, borderLeftColor: COLORS.lightGray2, borderLeftWidth: 1}}></View>
        </View>
    )
}

const BookDetails = ({route, navigation}) => {
    const [book, setBook] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [sortedLibraries, setSortedLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isTaken, setIsTaken] = useState(false);
    const [takerDetails, setTakerDetails] = useState(null);
    const userLocation = useLocation();
    const {user} = useUser();

    const [scrollViewWholeHeight, setScrollViewWholeHeight] = useState(1);
    const [scrollViewVisibleHeight, setScrollViewVisibleHeight] = useState(0);

    const indicator = new Animated.Value(0);

    useEffect(() => {
        let {book} = route.params;
        setBook(book);
        if (book.takenBy === undefined) {
            setIsTaken(false);
        } else {
            setIsTaken(book.takenBy !== null);
            if (book.takenBy !== null) {
                fetchTakerDetails(book.takenBy);
            }
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
                "Remove Bookmark",
                "Are you sure you want to remove this book from your bookmarks?",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Remove", onPress: () => handleRemoveBookmark()}
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
        if (!isTaken) {
            Alert.alert(
                "Take Book",
                "Are you sure you want to take this book?",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Take", onPress: async () => {
                            await updateBookStatus(book.id, { takenBy: user.id });
                            setIsTaken(true);
                            setBook({ ...book, takenBy: user.id });
                        }}
                ]
            );
        }
    };

    function renderBookInfoSection() {
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
                        <Text style={{...FONTS.h3, color: COLORS.textColor}}>Book Detail</Text>
                    </View>

                    <TouchableOpacity
                        style={{marginRigth: SIZES.base}}
                        onPress={() => console.log("Click More")}
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
                        <Text style={{...FONTS.body3, color: COLORS.lightRed}}>This book is taken</Text>
                    )}
                    {user.isAdmin && isTaken && takerDetails && (
                        <Text style={{...FONTS.body3, color: COLORS.secondary}}>Taken by: {takerDetails.name}</Text>
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
                        <Text style={{...FONTS.body4, color: COLORS.white}}>Rating</Text>
                    </View>

                    <LineDivider/>

                    {/* Pages */}
                    <View style={{flex: 1, paddingHorizontal: SIZES.radius, alignItems: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.white}}>{book.numPages}</Text>
                        <Text style={{...FONTS.body4, color: COLORS.white}}>Number of Pages</Text>
                    </View>

                    <LineDivider/>

                    {/* Language */}
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{...FONTS.h3, color: COLORS.white}}>{book.language}</Text>
                        <Text style={{...FONTS.body4, color: COLORS.white}}>Language</Text>
                    </View>
                </View>
            </View>
        )
    }

    function renderBookDescription() {
        const indicatorSize = scrollViewWholeHeight > scrollViewVisibleHeight ? scrollViewVisibleHeight * scrollViewVisibleHeight / scrollViewWholeHeight : scrollViewVisibleHeight

        const difference = scrollViewVisibleHeight > indicatorSize ? scrollViewVisibleHeight - indicatorSize : 1

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
                    <Text style={{...FONTS.h2, color: COLORS.textColor, marginBottom: SIZES.padding}}>Description</Text>
                    <Text style={{...FONTS.body2, color: COLORS.lightGray}}>{book.description}</Text>
                </ScrollView>
            </View>
        )
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const handleSelectLibrary = (library) => {
        setSelectedLibrary(library);

        const {latitude, longitude} = library;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url).then(r => console.log(r));

        setModalVisible(false);
    }

    function getDistance(userLocation, libraryLocation) {
        const lat1 = userLocation.latitude;
        const lon1 = userLocation.longitude;
        const lat2 = libraryLocation.latitude;
        const lon2 = libraryLocation.longitude;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    function renderBottomButton() {
        const handleGetDirections = async (bookId) => {
            let libraryDistances = [];

            const book = await getBookById(bookId); // Assuming book.id is available
            for (let i = 0; i < book.location.length; i++) {
                const location = await getLocationById(book.location[i]);
                const distance = getDistance(userLocation.location.coords, location);
                libraryDistances.push({
                    ...location,
                    distance: distance.toFixed(2)
                });
            }

            // Sort by distance
            libraryDistances.sort((a, b) => a.distance - b.distance);

            // Set sorted libraries and show modal
            setSortedLibraries(libraryDistances);
            setModalVisible(true);
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
                {!isTaken && (
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
                        <Text style={{...FONTS.h3, color: COLORS.textColor}}>Take Book</Text>
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
                    <Text style={{...FONTS.h3, color: COLORS.white}}>Get Directions</Text>
                </TouchableOpacity>

                <SelectionModal
                    items={sortedLibraries}
                    visible={isModalVisible}
                    setVisible={setModalVisible}
                    onSelect={handleSelectLibrary}
                    renderItem={(item) => (
                        <View style={Styles_screens.modalItemContainer}>
                            <Text style={Styles_screens.modalItemText}>{item.name}</Text>
                            <Text style={Styles_screens.modalItemText}>({item.distance}) km</Text>
                        </View>
                    )}
                />
            </View>
        )
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
