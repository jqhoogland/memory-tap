import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from "./screens/HomeScreen";
import JourneyScreen from "./screens/JourneyScreen";


const Tab = createBottomTabNavigator();

export default function App() {
    return (
            <NavigationContainer>
            <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Journey" component={JourneyScreen} />
            </Tab.Navigator>
            </NavigationContainer>
    );
}
