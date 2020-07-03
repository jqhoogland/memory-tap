import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./store/configureStore";

import HomeScreen from "./screens/HomeScreen";
import JourneyScreen from "./screens/JourneyScreen";

const Tab = createBottomTabNavigator();

const { store, persistor } = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Journey" component={JourneyScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
