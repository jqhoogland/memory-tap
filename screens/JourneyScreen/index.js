import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import OverviewScreen from "./OverviewScreen";
import EditJourneyScreen from "./EditJourneyScreen";

const Stack = createStackNavigator();

export default function JourneyScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Edit" component={EditJourneyScreen} />
    </Stack.Navigator>
  );
}
