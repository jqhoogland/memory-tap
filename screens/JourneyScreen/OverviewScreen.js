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

import { selectJourney, updateJourneyName } from "../../store/actions";
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
  navigation,
  route,
}) {
  const [journey, setJourney] = useState(journeyStore);

  useEffect(() => {
    setJourney(journeyStore);
  }, [journeyStore]);

  let isEmpty = journey.loci.filter((locus) => locus.coords).length === 0;
  let initRegion = isEmpty ? {} : getInitRegion(journey.loci);

  const updateJourneyName = (value) => {
    updateJourneyNameStore(value);
    setJourney({ ...journey, name: value });
  };

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

        <Button
          title={isEmpty ? "Add Information" : "Edit Information"}
          onPress={() => navigation.navigate("Edit Information")}
        />

        <Button
          title={isEmpty ? "Add Loci" : "Edit Loci"}
          onPress={() => navigation.navigate("Edit Loci")}
        />
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  journeyStore: getActiveJourney(state.journeys, state.selJourney),
});

const mapDispatchToProps = {
  updateJourneyNameStore: updateJourneyName,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
