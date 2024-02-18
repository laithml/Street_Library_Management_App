import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Tabs from "./navigation/tabs";
import {useFonts} from 'expo-font';
import { I18nManager } from 'react-native';
import AddLibraryScreen from "./screens/AddLibraryScreen";

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
    const [loaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),
    })

    if (!loaded) {
        return null;
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

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
