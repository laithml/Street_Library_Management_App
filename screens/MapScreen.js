import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {COLORS, SIZES} from "../constants";
import {db} from "../Config/Firebase"
import {getDocs, collection, doc, setDoc} from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Location from 'expo-location';
import {useNavigation} from "@react-navigation/native";


const MapScreen = ({navigation}) => {

    const [points, setPoints] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        const fetchCurrentLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

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
                <View style={styles.searchSection}>
                    <FontAwesome name="search" size={25} color={COLORS.textColor}/>
                    <TextInput
                        style={styles.searchText}
                        placeholder="Search"
                        placeholderTextColor={COLORS.textColor}
                        onChangeText={text => setSearchQuery(text)}
                        value={searchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.addLibraryButton} onPress={()=> navigation.navigate('AddLibrary')} >
                    <View style={styles.searchIcon}>
                        <FontAwesome name="plus" size={25}/>
                    </View>
                    <Text style={styles.addButtonText} >
                        Add New Library
                    </Text>
                    <View style={styles.addButtonContainer}>
                        <Text style={{fontSize: SIZES.h2, color: COLORS.black}}>ADD</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE}
                     initialRegion={currentRegion}
            >
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: point.latitude,
                            longitude: point.longitude,
                        }}
                        title={point.name}
                        description={point.description}
                    >
                        {/*/!* Optional: If you want to customize the marker's appearance *!/*/}
                        {/*<View style={styles.customMarker}>*/}
                        {/*    <Image source={{ uri: point.imageUrl }} style={styles.markerImage} />*/}
                        {/*</View>*/}
                    </Marker>
                ))}

            </MapView>
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
        height: 100,
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
});
