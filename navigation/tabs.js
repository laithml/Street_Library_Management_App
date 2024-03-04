import React from "react";
import {
    Image
} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { COLORS } from "../constants";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapScreen from "../screens/MapScreen";
import BookInfoScreen from "../screens/AddBookScreens/BookInfoScreen";

const Tab = createBottomTabNavigator();



const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    height: "10%",
                    backgroundColor: COLORS.backgroundColor2
                },
                tabBarIcon: ({focused}) => {
                    const tintColor = focused ? COLORS.black : COLORS.textColor;
                    let iconName;

                    switch (route.name) {
                        case "OverView":
                            iconName = "home";
                            break;
                        case "Add":
                            iconName = "plus";
                            break;
                        case "Map":
                            iconName = "map";
                            break;
                        case "Setting":
                            iconName = "gear";
                            break;
                    }

                    return <FontAwesome name={iconName} size={25} color={tintColor}/>;
                },
                tabBarLabelStyle: {color: COLORS.black, fontSize: 12, fontFamily: "Roboto-Regular"},
            })}
        >
            <Tab.Screen
                name="OverView"
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
                name="Setting"
                component={HomeScreen}
            />
        </Tab.Navigator>
    );
}

export default Tabs;
