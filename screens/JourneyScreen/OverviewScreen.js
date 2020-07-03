import React, { useState, useEffect, useRef } from "react";
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

const MARKERS = require("./demo.json");
console.log("markers", MARKERS);

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

export default function EditJourneyScreen() {
  const [title, setTitle] = useState("Journey Title");
  const [markers, setMarkers] = useState(MARKERS);

  let initRegion = getInitRegion(markers);

  return (
    <ScrollView style={styles.container}>
      <View>
        <MapView
          initialRegion={initRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
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
        <Input label="Journey title" value={title} onChangeText={setTitle} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
