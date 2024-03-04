import React, {useEffect, useState} from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Tabs from "./navigation/tabs";
import {useFonts} from 'expo-font';
import { I18nManager } from 'react-native';
import AddLibraryScreen from "./screens/AddLibraryScreen";
import BookInfoScreen from "./screens/AddBookScreens/BookInfoScreen";
import BookExperienceScreen from "./screens/AddBookScreens/BookExperienceScreen";
import UploadImagesScreen from "./screens/AddBookScreens/UploadImagesScreen";
import LoadingAnimation from "./components/LoadingAnimation";
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync().catch(() => { /* Ignoring failure silently */ });
// Force LTR layout
I18nManager.forceRTL(false);

// If the app is currently in RTL layout, this will reload it to apply the LTR layout
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
            // Simulate an additional async operation here if necessary
            // e.g., loading resources, data fetching, auth checks, etc.

            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

            if (fontsLoaded) {
                setAppIsReady(true);
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, [fontsLoaded]);

    if (!appIsReady) {
        return <LoadingAnimation />;
    }
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Home'}
            >
                {/* Tabs */}
                <Stack.Screen name="Home" component={Tabs}/>
                <Stack.Screen name="AddLibrary" component={AddLibraryScreen}/>
                <Stack.Screen name="BookInfo" component={BookInfoScreen}/>
                <Stack.Screen name="BookExperience" component={BookExperienceScreen}/>
                <Stack.Screen name="UploadImages" component={UploadImagesScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
