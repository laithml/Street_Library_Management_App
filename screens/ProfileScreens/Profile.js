import React from "react";
import {SafeAreaView, View, Text, ScrollView, Alert} from 'react-native';
import Styles_screens from "../../constants/Styles";
import Card from "../../components/Card";
import {logoutUser} from "../../DB_handler/db_actions";
import {useUser} from "../../Context/UserContext";

const ProfileScreen = ({navigation}) => {

    const {user} = useUser();
    const bookMarks = user.bookmarks.length;

    const handlePress = (screenName) => {
        console.log(`Navigating to ${screenName}`);
        navigation.navigate(screenName);
    };

    const signOut = () => {

        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Sign Out", onPress: async () => {
                        const signOut = await logoutUser();
                        if (signOut) {
                            console.log("Sign out successful");
                            navigation.navigate('SignIn');

                        } else {
                            console.log("Sign out failed");
                        }
                    }
                }
            ]
        );


    }

    return (
        <SafeAreaView style={Styles_screens.container}>
            <ScrollView style={Styles_screens.scrollView}>

                {/* My Library Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>My Library</Text>
                    <Card iconName="book" title="Books" info="Read 4, Taken 2" onPress={() => handlePress('Books')}/>
                    <Card iconName="bookmark" title="Bookmarks" info={`${bookMarks} Bookmarks`} onPress={() => handlePress('BookmarksScreen')}/>
                    <Card iconName="map-marker" title="Libraries" info="Visited 3"
                          onPress={() => handlePress('Libraries')}/>
                </View>

                {/* My Contributions Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>My Contributions</Text>
                    <Card iconName="book" title="Reviews" info="Reviewed 5" onPress={() => handlePress('Reviews')}/>
                    <Card iconName="map-marker" title="Libraries" info="Added 2"
                          onPress={() => handlePress('AddedLibraries')}/>
                    <Card iconName="plus" title="Add Book" onPress={() => handlePress('Add Book')}/>

                </View>
                {/* Settings Section */}
                <View style={Styles_screens.section}>
                    <Text style={Styles_screens.sectionTitle}>Settings</Text>
                    <Card iconName="cog" title="Account" onPress={() => handlePress('Account')}/>
                    <Card iconName="bell" title="Notifications" onPress={() => handlePress('Notifications')}/>
                    <Card iconName="info" title="About" onPress={() => handlePress('About')}/>
                    <Card iconName="sign-out" title="Sign Out" onPress={signOut}/>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};


export default ProfileScreen;
