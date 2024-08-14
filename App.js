import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Tabs from "./navigation/tabs";
import { I18nManager } from 'react-native';
import AddLibraryScreen from "./screens/MapScreens/AddLibraryScreen";
import BookInfoScreen from "./screens/AddBookScreens/BookInfoScreen";
import BookExperienceScreen from "./screens/AddBookScreens/BookExperienceScreen";
import UploadImagesScreen from "./screens/AddBookScreens/UploadImagesScreen";
import SignUp from "./screens/SignUp&In/SignUp";
import SignIn from "./screens/SignUp&In/SignIn";
import ForgotPassword from "./screens/SignUp&In/ForgotPassword";
import { UserProvider } from "./Context/UserContext";
import BookDetails from "./screens/HomeScreens/BookDetails";
import { LocationProvider } from "./Context/LocationContext";
import BookmarksScreen from "./screens/ProfileScreens/BookmarksScreen";
import ContributedBooksScreen from "./screens/ProfileScreens/ContributedBooksScreen";
import SearchScreen from "./screens/HomeScreens/SearchScreen";
import { I18nextProvider } from 'react-i18next';
import i18n from './Config/i18n';
import InitialScreen from "./screens/AddBookScreens/InitialScreen";
import BookEditComponent from "./components/BookEditComponent";
import BookEditScreen from "./screens/AddBookScreens/BookEditScreen";
import { Provider } from 'react-redux';
import store from './redux/store';
import EditBookAdmin from "./screens/AdminScreens/EditBookAdmin";
import AdminsManagementScreen from "./screens/AdminScreens/AdminsManagementScreen";
import UsersManagementScreen from "./screens/AdminScreens/UsersManagementScreen";


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
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
            <UserProvider>
                <LocationProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
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
                                <Stack.Screen name="ContributedBooksScreen" component={ContributedBooksScreen} />
                                <Stack.Screen name="Search" component={SearchScreen} />
                                <Stack.Screen name="InitialScreen" component={InitialScreen} />
                                <Stack.Screen name="BookEditComponent" component={BookEditComponent} />
                                <Stack.Screen name="BookEdit" component={BookEditScreen} />
                                <Stack.Screen name="BookEditAdmin" component={EditBookAdmin} />
                                <Stack.Screen name="AdminsManagement" component={AdminsManagementScreen} />
                                <Stack.Screen name="UsersManagement" component={UsersManagementScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </GestureHandlerRootView>
                </LocationProvider>
            </UserProvider>
            </Provider>
        </I18nextProvider>
    );
};

export default App;
