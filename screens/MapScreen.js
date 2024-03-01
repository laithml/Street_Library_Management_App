import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
    Alert, FlatList,
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
import {db} from "../Config/Firebase"
import {getDocs, collection, doc, setDoc} from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Location from 'expo-location';
import LibraryDetail from "../components/LibraryDetail";


const MapScreen = ({navigation}) => {

    const [points, setPoints] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentRegion, setCurrentRegion] = useState(null);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const mapRef = React.useRef(null);

    const dismissLibraryDetail = () => {
        setSelectedLibrary(null);
        setSearchQuery('');
    };

    const animateToRegion = (item) => {
        const adjustedLatitude = item.latitude -(currentRegion.latitudeDelta * 0.3);

        const region = {
            latitude: adjustedLatitude,
            longitude: item.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        mapRef.current?.animateToRegion(region, 350);
    }

    const handleGetDirections = () => {
        if (selectedLibrary) {
            const {latitude, longitude} = selectedLibrary;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url);
        }
    };

    useEffect(() => {


        const fetchCurrentLocation = async () => {
            const checkPermissionsAndRedirectIfNeeded = async () => {
                const {status} = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') {
                    // Permission is not granted
                    Alert.alert(
                        "Location Permission",
                        "We need access to your location to show nearby libraries. Please enable location permissions in settings.",
                        [
                            {
                                text: "Don't Allow",
                                onPress: () => console.log('Permission denied, alert closed'),
                                style: 'cancel',
                            },
                            {
                                text: 'Open Settings',
                                onPress: () => {
                                    // Open app settings
                                    if (Platform.OS === 'ios') {
                                        Linking.openURL('app-settings:');
                                    } else {
                                        Linking.openSettings();
                                    }
                                },
                            },
                        ]
                    );
                }
            };
            await checkPermissionsAndRedirectIfNeeded();

            let location = await Location.getCurrentPositionAsync({});
            const isInIsrael = (latitude, longitude) => {
                return latitude >= 29.5 && latitude <= 33.5 && longitude >= 34.3 && longitude <= 35.9;
            };

            setCurrentRegion({
                latitude: isInIsrael(location.coords.latitude, location.coords.longitude) ? location.coords.latitude : 31.7683,
                longitude: isInIsrael(location.coords.latitude, location.coords.longitude) ? location.coords.longitude : 35.2137,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        };

        fetchCurrentLocation();
    }, []);


    useEffect(() => {
        const fetchPoints = async () => {
            const querySnapshot = await getDocs(collection(db, 'LibrariesData')); // Adjust 'LibrariesData' to your collection name
            let tempPoints = [];
            querySnapshot.forEach((doc) => {
                tempPoints.push(doc.data());
            });
            setPoints(tempPoints);
        }
        fetchPoints();
    }, []);

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
                    <Text style={styles.addButtonText}>
                        Add New Library
                    </Text>
                    <View style={styles.addButtonContainer}>
                        <Text style={{fontSize: SIZES.h2, color: COLORS.black}}>ADD</Text>
                    </View>
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
                    >
                    </Marker>
                ))}
            </MapView>
            {selectedLibrary && (
                <View style={styles.libraryDetailContainer}>
                    <LibraryDetail library={selectedLibrary}   onDismiss={dismissLibraryDetail} onGetDirections={handleGetDirections}/>
                </View>
            )}

        </SafeAreaView>
    )
}


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
        marginBottom: 20
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
        color: COLORS.textColor
    },
    addLibraryButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20
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
        fontFamily: "Roboto-Regular"
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
