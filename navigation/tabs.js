import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreens/HomeScreen";
import { COLORS } from "../constants";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapScreen from "../screens/MapScreen";
import BookInfoScreen from "../screens/AddBookScreens/BookInfoScreen";
import Profile from "../screens/ProfileScreens/Profile";

const Tab = createBottomTabNavigator();



const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: "10%",
                    backgroundColor: COLORS.backgroundColor
                },
                tabBarIcon: ({focused}) => {
                    const tintColor = focused ? COLORS.black : COLORS.textColor;
                    let iconName;

                    switch (route.name) {
                        case "Home":
                            iconName = "home";
                            break;
                        case "Add":
                            iconName = "plus";
                            break;
                        case "Map":
                            iconName = "map";
                            break;
                        case "Profile":
                            iconName = "user";
                            break;
                    }

                    return <FontAwesome name={iconName} size={25} color={tintColor}/>;
                },
                tabBarLabelStyle: {color: COLORS.black, fontSize: 12, fontFamily: "Roboto-Regular"},
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />
            <Tab.Screen
                name="Add"
                component={BookInfoScreen}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
}

export default Tabs;
