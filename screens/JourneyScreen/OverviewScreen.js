import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Input } from "react-native-elements";

import { newJourney } from "../../store/actions";

const MARKERS = require("./demo.json");

const getInitRegion = (markers) => {
  const markersLocated = markers.filter(
    (marker) => marker.location && marker.location.coords
  );
  const latOrdering = markersLocated.sort(
    (a, b) => a.location.coords.latitude < b.location.coords.latitude
  );
  const lngOrdering = markersLocated.sort(
    (a, b) => a.location.coords.longitude < b.location.coords.longitude
  );

  const minLatitude = latOrdering[0].location.coords.latitude;
  const maxLatitude =
    latOrdering[latOrdering.length - 1].location.coords.latitude;
  const minLongitude = lngOrdering[0].location.coords.longitude;
  const maxLongitude =
    lngOrdering[lngOrdering.length - 1].location.coords.longitude;

  const padding = 0.4;
  const latitudeDelta = Math.abs(minLatitude - maxLatitude) * (1 + padding);
  const longitudeDelta = Math.abs(minLongitude - maxLongitude) * (1 + padding);

  const latitudeCenter = (minLatitude + maxLatitude) / 2;
  const longitudeCenter = (minLongitude + maxLongitude) / 2;

  return {
    latitude: latitudeCenter,
    longitude: longitudeCenter,
    latitudeDelta,
    longitudeDelta,
  };
};

function OverviewScreen({ journeys, setJourneyTitle, navigation, route }) {
  const [title, setTitle] = useState("Journey Title");
  const [markers, setMarkers] = useState([]); //MARKERS);

  const { journeyId } = route.params
    ? route.params
    : { journeyId: journeys.length - 1 };

  let journey = journeys.find((journey) => journey.id === journeyId);
  let isEmpty = markers.length === 0;
  let initRegion = isEmpty ? {} : getInitRegion(markers);

  return (
    <ScrollView style={styles.container}>
      <View>
        <MapView
          initRegion={initRegion}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height / 3,
          }}
        >
          {markers.map((marker, i) =>
            marker.location ? (
              <Marker key={`key${i}`} coordinate={marker.location.coords} />
            ) : (
              <></>
            )
          )}
          <Polyline
            coordinates={markers
              .filter((markers) => markers.location)
              .map((markers) => markers.location.coords)}
            strokeWidth={6}
          />
        </MapView>
      </View>
      <View style={{ padding: 20 }}>
        <Input
          label="Journey title"
          value={journey.name}
          onChangeText={setTitle}
        />

        <Button
          title={isEmpty ? "Add Information" : "Edit Information"}
          onPress={() => navigation.navigate("Edit Information")}
        />

        <Button
          title={isEmpty ? "Add Locations" : "Edit Locations"}
          onPress={() => navigation.navigate("Edit Locations")}
        />
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  journeys: state.journeys,
});

const mapDispatchToProps = {
  newJourney,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
