import React from "react";
import { SafeAreaView, View, Text, ScrollView, Alert } from 'react-native';
import Styles_screens from "../../constants/Styles";
import Card from "../../components/Card";
import { logoutUser } from "../../actions/db_actions";
import { useUser } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ProfileScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { user } = useUser();
    const bookMarks = user.bookmarks.length;
    const addedBooks = user.booksAdded?.length || 0;

    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };

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
                <View style={Styles_screens.section}>
                    {/*<Card iconName="cog" title={t('account')} onPress={() => handlePress('Account')} />*/}
                    {/*<Card iconName="bell" title={t('notifications')} onPress={() => handlePress('Notifications')} />*/}
                    {/*<Card iconName="info" title={t('about')} onPress={() => handlePress('About')} />*/}
                    <Card iconName="sign-out" title={t('signOut')} onPress={signOut} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
