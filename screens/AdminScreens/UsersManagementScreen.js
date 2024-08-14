import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import Styles_screens from "../../constants/Styles";
import { fetchLibraries, fetchUsers } from "../../actions/db_actions";
import UserBasic from "../../components/UserBasic";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LibrarySelectionModal from '../../components/LibrarySelectionModal';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

const UsersManagementScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [visibleLibModal, setVisibleLibModal] = useState(false);

    useEffect(() => {
        const loadLibraries = async () => {
            try {
                const fetchedLibraries = await fetchLibraries();
                setLibraries(fetchedLibraries);
            } catch (error) {
                console.error('Failed to fetch libraries:', error);
            }
        };

        loadLibraries();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            if (selectedLibrary) {
                setLoading(true);
                try {
                    const fetchedUsers = await fetchUsers(selectedLibrary.id);
                    setSearchResults(fetchedUsers);
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadUsers();
    }, [selectedLibrary]);

    const debouncedSearch = debounce(async (query) => {
        if (query.trim() === '' || !selectedLibrary) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const fetchedUsers = await fetchUsers(selectedLibrary.id);
            const results = fetchedUsers.filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    }, 600);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery]);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleLibrarySelect = (id, name) => {
        setSelectedLibrary({ id, name });
        setVisibleLibModal(false);
    };

    const clearSelectedLibrary = () => {
        setSelectedLibrary(null);
        setSearchResults([]);
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
            <View style={{
                height: '8%',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Text style={Styles_screens.headerText}>{t('usersManagement')}</Text>
            </View>
            <View style={{ height: 1.5, marginBottom: 30, backgroundColor: 'grey', width: '100%' }} />

            {/* Library Switcher */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.base * 1.5 }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        height: 40,
                        paddingHorizontal: 15,
                        borderRadius: 20,
                        backgroundColor: COLORS.textColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onPress={() => setVisibleLibModal(true)}
                >
                    <Text style={{ margin: SIZES.base, color: COLORS.white, ...FONTS.body3 }}>
                        {selectedLibrary ? selectedLibrary.name : t('selectLibrary')}
                    </Text>
                    <FontAwesome name={"angle-down"} size={20} color={COLORS.white} />
                </TouchableOpacity>
                {selectedLibrary && (
                    <TouchableOpacity onPress={clearSelectedLibrary} style={{ marginLeft: 10 }}>
                        <FontAwesome name={"times"} size={20} color={COLORS.textColor} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ marginVertical: 10, paddingHorizontal: SIZES.base }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary,
                    borderRadius: 20,
                    paddingHorizontal: SIZES.base
                }}>
                    <TextInput
                        style={{
                            flex: 1,
                            paddingHorizontal: 15,
                            color: COLORS.textColor,
                            height: 40,
                        }}
                        placeholder={t('searchForUsers')}
                        placeholderTextColor={COLORS.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        editable={!!selectedLibrary}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch} style={{ paddingHorizontal: 10 }}>
                            <FontAwesome name={'times'} size={20} color={COLORS.textColor} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <View style={Styles_screens.section}>
                <Text style={Styles_screens.sectionTitle}>{t('usersList')}</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
                ) : searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        renderItem={({ item }) => (
                            <UserBasic
                                navigation={navigation}
                                user={item.id}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <Text style={{
                        ...FONTS.body3,
                        color: COLORS.textColor,
                        marginVertical: 10
                    }}>{t('noUsersFound')}</Text>
                )}
            </View>

            <LibrarySelectionModal
                visible={visibleLibModal}
                onClose={() => setVisibleLibModal(false)}
                libraries={libraries}
                onSelect={handleLibrarySelect}
            />
        </SafeAreaView>
    );
};

export default UsersManagementScreen;
