import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
    Alert,
    FlatList,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {COLORS, SIZES} from "../constants";
import {db} from "../Config/Firebase";
import {getDocs, collection} from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LibraryDetail from "../components/LibraryDetail";
import LoadingAnimation from "../components/LoadingAnimation";
import {useLocation} from "../Context/LocationContext";

const MapScreen = ({navigation}) => {
    const [points, setPoints] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const mapRef = React.useRef(null);
    const [isLoading, setIsLoading] = useState(true);


    const [currentRegion, setCurrentRegion] = useState({
        latitude: 31.7683,  // default to Jerusalem
        longitude: 35.2137,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const {location, errorMsg} = useLocation();

    const dismissLibraryDetail = () => {
        setSelectedLibrary(null);
        setSearchQuery('');
    };

    const animateToRegion = (item) => {
        if (location) {
            const adjustedLatitude = item.latitude - (0.0922 * 0.3);
            const region = {
                latitude: adjustedLatitude,
                longitude: item.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            mapRef.current?.animateToRegion(region, 350);
        }
    };

    const handleGetDirections = () => {
        if (selectedLibrary) {
            const {latitude, longitude} = selectedLibrary;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url);
        }
    };

    useEffect(() => {
        if (location) {
            const isInIsrael = (latitude, longitude) => {
                return latitude >= 29.5 && latitude <= 33.5 && longitude >= 34.3 && longitude <= 35.9;
            };

            if (isInIsrael(location.coords.latitude, location.coords.longitude)) {
                setCurrentRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }
        }
    }, [location]);


    useEffect(() => {
        const fetchPoints = async () => {
            setIsLoading(true); // Start loading
            const querySnapshot = await getDocs(collection(db, 'LibrariesData'));
            let tempPoints = [];
            querySnapshot.forEach((doc) => {
                tempPoints.push(doc.data());
            });
            setPoints(tempPoints);
            setIsLoading(false); // End loading
        };
        fetchPoints();
    }, []);

    if (isLoading) {
        return <LoadingAnimation/>;
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.backgroundColor}}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchSection}>
                        <FontAwesome name="search" size={25} color={COLORS.textColor}/>
                        <TextInput
                            style={styles.searchText}
                            placeholder="Search for library..."
                            placeholderTextColor={COLORS.textColor}
                            onChangeText={text => setSearchQuery(text)}
                            value={searchQuery}
                        />
                    </View>

                    {searchQuery !== '' && (
                        <View style={styles.resultsContainer}>
                            <FlatList
                                data={points.filter(library => library?.name?.toLowerCase().includes(searchQuery.toLowerCase()))}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => {
                                            setSelectedLibrary(item);
                                            setSearchQuery(item.name);
                                            animateToRegion(item)
                                        }}>
                                        <Text style={styles.itemText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.addLibraryButton} onPress={() => navigation.navigate('AddLibrary')}>
                    <View style={styles.searchIcon}>
                        <FontAwesome name="plus" size={25}/>
                    </View>
                    <Text style={styles.addButtonText}>Add New Library</Text>
                </TouchableOpacity>
            </View>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={currentRegion}
            >
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: point.latitude,
                            longitude: point.longitude,
                        }}
                        pinColor={selectedLibrary && point.id === selectedLibrary.id ? "red" : "green"}
                        onPress={() => {
                            setSelectedLibrary(point);
                            setSearchQuery(point.name);
                            animateToRegion(point);
                        }}
                    />
                ))}
            </MapView>
            {selectedLibrary && (
                <View style={styles.libraryDetailContainer}>
                    <LibraryDetail library={selectedLibrary} onDismiss={dismissLibraryDetail}
                                   onGetDirections={handleGetDirections}/>
                </View>
            )}
        </SafeAreaView>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        marginTop: 10,
        width: '100%',
        height: '100%',
    },
    headerContainer: {
        height: 200,
        margin: 10,
        marginBottom: 20,
    },
    searchSection: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
    },
    searchIcon: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchText: {
        flex: 1,
        paddingLeft: 10,
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.h2,
        color: COLORS.textColor,
    },
    addLibraryButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    addButtonContainer: {
        position: "absolute",
        right: 10,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.black,
    },
    addButtonText: {
        fontSize: SIZES.h2,
        color: COLORS.black,
        paddingLeft: 10,
        fontFamily: "Roboto-Regular",
    },
    libraryDetailContainer: {
        position: 'absolute',
        bottom: 20,
        right: 5,
        left: 5,
        padding: 10,
    },
    searchContainer: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: 10,
    },
    resultsContainer: {
        maxHeight: 80,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    itemText: {
        color: COLORS.textColor,
    },
});
