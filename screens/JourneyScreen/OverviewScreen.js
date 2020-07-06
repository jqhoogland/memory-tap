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

import {
  selectJourney,
  updateJourneyName,
  deleteJourney,
} from "../../store/actions";
import { getActiveJourney } from "../../utils";

const MARKERS = require("./demo.json");

const getInitRegion = (markers) => {
  const markersLocated = markers.filter((marker) => marker.coords);
  const latOrdering = markersLocated.sort(
    (a, b) => a.coords.latitude < b.coords.latitude
  );
  const lngOrdering = markersLocated.sort(
    (a, b) => a.coords.longitude < b.coords.longitude
  );

  const minLatitude = latOrdering[0].coords.latitude;
  const maxLatitude = latOrdering[latOrdering.length - 1].coords.latitude;
  const minLongitude = lngOrdering[0].coords.longitude;
  const maxLongitude = lngOrdering[lngOrdering.length - 1].coords.longitude;

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

function OverviewScreen({
  journeyStore,
  updateJourneyNameStore,
  deleteJourney,
  navigation,
  route,
}) {
  const [journey, setJourney] = useState(journeyStore);

  useEffect(() => {
    console.log("Updating journey", journeyStore);
    setJourney(journeyStore);
  }, [journeyStore]);

  let numNamedLoci = journey.loci
    ? journey.loci.filter((locus) => locus.name).length
    : 0;

  let isEmpty = !(
    journey.loci &&
    journey.loci.filter((locus) => locus.coords && locus.coords.latitude)
      .length > 0
  );
  let initRegion = isEmpty ? {} : getInitRegion(journey.loci);

  const updateJourneyName = (value) => {
    updateJourneyNameStore(value);
    setJourney({ ...journey, name: value });
  };
  const deleteJourneyAlert = () => {
    Alert.alert(
      "Delete Journey",
      `Are you sure you want to delete journey '${journey.name}'`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteJourney();
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {journey && journey.loci ? (
        <>
          <View>
            <MapView
              region={initRegion}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height / 3,
              }}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {journey.loci.map((marker, i) =>
                marker.coords ? (
                  <Marker key={`key${i}`} coordinate={marker.coords} />
                ) : (
                  <></>
                )
              )}
              <Polyline
                coordinates={journey.loci
                  .filter((marker) => marker.coords)
                  .map((marker) => marker.coords)}
                strokeWidth={6}
              />
            </MapView>
          </View>
          <View style={{ padding: 20 }}>
            <Input
              label="Journey title"
              value={journey.name}
              onChangeText={updateJourneyName}
            />

            <Text>Journey contains {numNamedLoci} loci.</Text>
            <Text style={{ fontSize: 10 }}>ID: {journey.id}</Text>

            <Button
              title={isEmpty ? "Add Information" : "Edit Information"}
              onPress={() => navigation.navigate("Edit Information")}
            />

            <Button
              title={isEmpty ? "Add Loci" : "Edit Loci"}
              onPress={() => navigation.navigate("Edit Loci")}
            />

            <Button title="Delete Journey" onPress={deleteJourneyAlert} />
          </View>
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  journeyStore: getActiveJourney(state.journeys, state.selJourney),
});

const mapDispatchToProps = {
  updateJourneyNameStore: updateJourneyName,
  deleteJourney,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
