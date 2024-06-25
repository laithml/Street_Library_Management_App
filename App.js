import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Tabs from "./navigation/tabs";
import { useFonts } from 'expo-font';
import { I18nManager, View, Button } from 'react-native';
import AddLibraryScreen from "./screens/MapScreens/AddLibraryScreen";
import BookInfoScreen from "./screens/AddBookScreens/BookInfoScreen";
import BookExperienceScreen from "./screens/AddBookScreens/BookExperienceScreen";
import UploadImagesScreen from "./screens/AddBookScreens/UploadImagesScreen";
import LoadingAnimation from "./components/LoadingAnimation";
import * as SplashScreen from 'expo-splash-screen';
import SignUp from "./screens/SignUp&In/SignUp";
import SignIn from "./screens/SignUp&In/SignIn";
import ForgotPassword from "./screens/SignUp&In/ForgotPassword";
import { UserProvider } from "./Context/UserContext";
import BookDetails from "./screens/HomeScreens/BookDetails";
import { LocationProvider } from "./Context/LocationContext";
import BookmarksScreen from "./screens/ProfileScreens/BookmarksScreen";
import ContributedBooksScreen from "./screens/ProfileScreens/ContributedBooksScreen";
import SearchScreen from "./screens/HomeScreens/SearchScreen";
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './Config/i18n';

SplashScreen.preventAutoHideAsync().catch(() => { /* Ignoring failure silently */ });
I18nManager.forceRTL(false);

if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.swapLeftAndRightInRTL(false);
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent"
    }
}

const Stack = createStackNavigator();


const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    let [fontsLoaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await SplashScreen.hideAsync();
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        if (fontsLoaded) {
            prepare();
        }
    }, [fontsLoaded]);

    if (!appIsReady) {
        return <LoadingAnimation />;
    }

    return (
        <I18nextProvider i18n={i18n}>
            <UserProvider>
                <LocationProvider>
                    <NavigationContainer theme={theme}>
                        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'SignIn'}>
                            <Stack.Screen name="Tab" component={Tabs} />
                            <Stack.Screen name="AddLibrary" component={AddLibraryScreen} />
                            <Stack.Screen name="BookInfo" component={BookInfoScreen} />
                            <Stack.Screen name="BookExperience" component={BookExperienceScreen} />
                            <Stack.Screen name="UploadImages" component={UploadImagesScreen} />
                            <Stack.Screen name="SignUp" component={SignUp} />
                            <Stack.Screen name="SignIn" component={SignIn} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                            <Stack.Screen name="BookDetails" component={BookDetails} />
                            <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} />
                            <Stack.Screen name={"ContributedBooksScreen"} component={ContributedBooksScreen} />
                            <Stack.Screen name={"Search"} component={SearchScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </LocationProvider>
            </UserProvider>
        </I18nextProvider>
    );
};

export default App;
