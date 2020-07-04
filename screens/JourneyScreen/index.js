import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import OverviewScreen from "./OverviewScreen";
import EditLocationsScreen from "./EditLocationsScreen";
import EditInformationScreen from "./EditInformationScreen";

const Stack = createStackNavigator();

export default function JourneyScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Edit Loci" component={EditLocationsScreen} />
      <Stack.Screen name="Edit Information" component={EditInformationScreen} />
    </Stack.Navigator>
  );
}
