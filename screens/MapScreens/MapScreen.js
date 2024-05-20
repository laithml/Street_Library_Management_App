import React, {useState, useEffect, useRef} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList, Linking
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LibraryDetail from "../../components/LibraryDetail";
import {COLORS, SIZES} from "../../constants";
import Styles_screens from "../../constants/Styles";
import {useLocation} from "../../Context/LocationContext";
import {fetchLibraries} from "../../actions/db_actions";

const MapScreen = ({navigation}) => {
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef(null);
    const {location, errorMsg} = useLocation();
    const [currentRegion, setCurrentRegion] = useState();
    const [filteredLibraries, setFilteredLibraries] = useState([]);
    const [visible, setVisible] = useState(false);

    const handleGetDirections = () => {
        if (selectedLibrary) {
            console.log('Getting directions...');
            console.log(selectedLibrary);
            const {latitude, longitude} = selectedLibrary;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url);
        }
    };

    const onSearchChange = (query) => {
        setSearchQuery(query);
        setVisible(true)
    };

    const selectLibrary = (library) => {
        setSelectedLibrary(library);
    };

    useEffect(() => {
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filteredData = libraries.filter(library =>
                library.name && typeof library.name === 'string' && library.name.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredLibraries(filteredData);
        } else {
            setFilteredLibraries(libraries);
        }
    }, [libraries, searchQuery]);


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


    const animateToRegion = (item) => {
        if (location) {
            const adjustedLatitude = item.latitude - (0.0922 * 0.1);
            const region = {
                latitude: adjustedLatitude,
                longitude: item.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            mapRef.current?.animateToRegion(region, 350);
        }
    };

    const dismissLibraryDetail = () => {
        setSelectedLibrary(null);
        setSearchQuery('');
    };

    useEffect(() => {
        if (libraries.length === 0) {  // Only fetch if libraries are not already loaded
            const getLibraries = async () => {
                const fetchedLibraries = await fetchLibraries();
                setLibraries(fetchedLibraries);
            };
            getLibraries();
        }
    }, [libraries.length]);


    return (
        <SafeAreaView style={Styles_screens.defContainer}>
            <View style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: COLORS.primary,
            }}>
                <TextInput
                    style={Styles_screens.searchInput}
                    placeholder="Search for libraries..."
                    onChangeText={onSearchChange}
                    value={searchQuery}
                />
                <View
                    style={[Styles_screens.submitButton, {width: 40, height: 40}]}
                    onPress={() => console.log('Searching')}>
                    <FontAwesome name="search" size={20} color={COLORS.white}/>
                </View>
                {searchQuery && filteredLibraries.length > 0 && visible && (
                    <View style={Styles_screens.dropdown}>
                        <FlatList
                            data={filteredLibraries}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => {
                                    selectLibrary(item);
                                    setSearchQuery(item.name);
                                    animateToRegion(item);
                                    setVisible(false)
                                }}>
                                    <Text style={Styles_screens.dropdownItem}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

            </View>

            <MapView
                ref={mapRef}
                style={Styles_screens.map}
                initialRegion={currentRegion}>
                {filteredLibraries.length > 0 ? filteredLibraries.map(library => (
                    <Marker
                        key={library.id}
                        coordinate={{
                            latitude: library.latitude,
                            longitude: library.longitude
                        }}
                        onPress={() => {
                            setSelectedLibrary(library);
                            animateToRegion(library);
                        }}
                    />
                )) : null}
            </MapView>


            {selectedLibrary && (
                <View style={Styles_screens.floatingCard}>
                    <LibraryDetail
                        library={selectedLibrary}
                        onGetDirections={() => handleGetDirections()}
                        onDismiss={() => dismissLibraryDetail()}
                    />
                </View>
            )}

            {/*{(isAdmin) &&*/}
            <TouchableOpacity
                style={[Styles_screens.submitButton, {width: '100%', marginTop: SIZES.margin}]}
                onPress={() => navigation.navigate('AddLibrary')}>
                <Text style={Styles_screens.submitButtonText}>Add New Library</Text>
            </TouchableOpacity>
            {/*}*/}
        </SafeAreaView>
    );
};

export default MapScreen;
