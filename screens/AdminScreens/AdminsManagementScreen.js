import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants';
import Styles_screens from "../../constants/Styles";
import {fetchAdmins, addAdmin, removeAdmin, fetchLibraries, fetchUsers} from "../../actions/db_actions";
import AdminBasic from "../../components/AdminBasic";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import UserSelectionModal from '../../components/UserSelectionModal';
import LibrarySelectionModal from '../../components/LibrarySelectionModal';
import {debounce} from 'lodash';
import {useTranslation} from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher";

const AdminsManagementScreen = ({navigation}) => {
    const {t} = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [visibleUserModal, setVisibleUserModal] = useState(false);
    const [visibleLibModal, setVisibleLibModal] = useState(false);
    const [users, setUsers] = useState([]);

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
        //fetch the users

        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Failed to fetch users:', error);

            }
        };

        loadUsers();
    }, []);


    useEffect(() => {
        const loadAdmins = async () => {
            if (selectedLibrary) {
                setLoading(true);
                try {
                    const fetchedAdmins = await fetchAdmins(selectedLibrary.id);
                    setSearchResults(fetchedAdmins);
                } catch (error) {
                    console.error('Failed to fetch admins:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadAdmins();
    }, [selectedLibrary]);

    const debouncedSearch = debounce(async (query) => {
        if (query.trim() === '' || !selectedLibrary) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const fetchedAdmins = await fetchAdmins(selectedLibrary.id);
            const results = fetchedAdmins.filter(admin =>
                admin.name.toLowerCase().includes(query.toLowerCase())
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
        setSelectedLibrary({id, name});
        setVisibleLibModal(false);
    };

    const handleUserSelect = async (userId, userName) => {
        try {
            await addAdmin(selectedLibrary.id, userId);
            const updatedAdmins = await fetchAdmins(selectedLibrary.id);
            setSearchResults(updatedAdmins);
            setVisibleUserModal(false);
        } catch (error) {
            console.error('Failed to add admin:', error);
        }
    };

    const handleRemoveAdmin = async (adminId) => {
        try {
            await removeAdmin(selectedLibrary.id, adminId);
            const updatedAdmins = await fetchAdmins(selectedLibrary.id);
            setSearchResults(updatedAdmins);
        } catch (error) {
            console.error('Failed to remove admin:', error);
        }
    };

    const clearSelectedLibrary = () => {
        setSelectedLibrary(null);
        setSearchResults([]);
    }

    return (
        <SafeAreaView style={{flex: 1, paddingHorizontal: SIZES.padding}}>
            <View style={{
                height: '8%',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Text style={Styles_screens.headerText}>{t('adminsManagement')}</Text>
            </View>
            <View style={{ height: 1.5, marginBottom: 30, backgroundColor: 'grey', width: '100%' }} />


            {/* Library Switcher */}
            <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal: SIZES.base*1.5 }}>
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

            <View style={{marginVertical: 10, paddingHorizontal: SIZES.base}}>
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
                        placeholder={t('searchForAdmins')}
                        placeholderTextColor={COLORS.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        editable={!!selectedLibrary}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch} style={{paddingHorizontal: 10}}>
                            <FontAwesome name={'times'} size={20} color={COLORS.textColor}/>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <View style={Styles_screens.section}>
                <TouchableOpacity
                    style={[Styles_screens.submitButton,{width: "100%", marginBottom: 20}]}
                    onPress={() => setVisibleUserModal(true)}
                    disabled={!selectedLibrary}
                >
                    <Text style={Styles_screens.submitButtonText}>{t('addAdmin')}</Text>
                </TouchableOpacity>

                <Text style={Styles_screens.sectionTitle}>{t('adminsList')}</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{marginVertical: 20}}/>
                ) : searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        renderItem={({item}) => (
                            <AdminBasic
                                navigation={navigation}
                                admin={item}
                                onRemove={() => handleRemoveAdmin(item)}
                            />
                        )}
                        contentContainerStyle={{paddingBottom: 20}}
                    />
                ) : (
                    <Text style={{
                        ...FONTS.body3,
                        color: COLORS.textColor,
                        marginVertical: 10
                    }}>{t('noAdminsFound')}</Text>
                )}
            </View>

            <UserSelectionModal
                visible={visibleUserModal}
                onClose={() => setVisibleUserModal(false)}
                users={users}
                onSelect={handleUserSelect}
            />

            <LibrarySelectionModal
                visible={visibleLibModal}
                onClose={() => setVisibleLibModal(false)}
                libraries={libraries}
                onSelect={handleLibrarySelect}
            />
        </SafeAreaView>
    );
};

export default AdminsManagementScreen;
