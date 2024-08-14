import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, Alert } from 'react-native';
import Styles_screens from "../../constants/Styles";
import Card from "../../components/Card";
import { fetchLibraries, getLocationById, logoutUser, updateUserDefaultLibrary } from "../../actions/db_actions";
import { useUser } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher";
import LibrarySelectionModal from "../../components/LibrarySelectionModal";

const ProfileScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { user, setUser } = useUser(); // Use setUser to update user state in context
    const bookMarks = user.bookmarks.length;
    const addedBooks = user.booksAdded?.length || 0;
    const [libraries, setLibraries] = useState([]);
    const [isLibraryModalVisible, setLibraryModalVisible] = useState(false);
    const [libraryName, setLibraryName] = useState('');

    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };

    useEffect(() => {
        const loadLibraries = async () => {
            try {
                const fetchedLibraries = await fetchLibraries();
                setLibraries(fetchedLibraries);
            } catch (error) {
                console.error("Error fetching libraries: ", error);
            }
        };

        getLocationById(user.defaultLibrary).then((loc) => {
            setLibraryName(loc.name);
        });

        loadLibraries();
    }, []);

    const signOut = () => {
        Alert.alert(
            t('signOut'),
            t('signOutConfirmation'),
            [
                {
                    text: t('cancel'),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: t('signOut'), onPress: async () => {
                        const signOut = await logoutUser();
                        if (signOut) {
                            navigation.navigate('SignIn');
                        }
                    }
                }
            ]
        );
    };

    const handleLibrarySelect = async (libraryId, libraryName) => {
        try {
            await updateUserDefaultLibrary(user.id, libraryId);
            setUser({ ...user, defaultLibrary: libraryId });
            setLibraryName(libraryName);
            Alert.alert(t('success'), t('defaultLibraryUpdated'));
        } catch (error) {
            console.error("Error updating default library: ", error);
            Alert.alert(t('error'), t('failedToUpdateLibrary'));
        }
    };

    return (
        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>{t('myLibrary')}</Text>
                <LanguageSwitcher />
            </View>
            <ScrollView style={Styles_screens.scrollView}>
                <View style={Styles_screens.section}>
                    <Card iconName="bookmark" title={t('bookmarks')} info={`${bookMarks} ${t('bookmarks')}`} onPress={() => handlePress('BookmarksScreen')} />
                    <Card iconName="book" title={t('books')} info={`${addedBooks} ${t('books')}`} onPress={() => handlePress('ContributedBooksScreen')} />
                    <Card iconName="plus" title={t('addBook')} onPress={() => handlePress('Add Book')} />
                </View>
                {user.isAdmin && (
                    <View style={Styles_screens.section}>
                        <Card iconName="cog" title={t('booksManagement')} onPress={() => handlePress('Search')} />
                        <Card iconName="user-secret" title={t('adminsManagement')} onPress={() => handlePress('AdminsManagement')} />
                        <Card iconName="users" title={t('usersManagement')} onPress={() => handlePress('UsersManagement')} />
                    </View>
                )}
                <View style={Styles_screens.section}>
                    <Card iconName="edit" title={t('changeDefaultLibrary')} info={libraryName} onPress={() => setLibraryModalVisible(true)} />
                    <Card iconName="sign-out" title={t('signOut')} onPress={signOut} />
                </View>


            </ScrollView>
            <LibrarySelectionModal
                visible={isLibraryModalVisible}
                onClose={() => setLibraryModalVisible(false)}
                libraries={libraries}
                onSelect={handleLibrarySelect}
            />
        </SafeAreaView>
    );
};

export default ProfileScreen;
