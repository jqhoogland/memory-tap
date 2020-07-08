import React, { useState, useEffect, useRef } from "react";

import { connect } from "react-redux";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";

import { setLoci } from "../../store/actions";
import { getActiveJourney } from "../../utils";

const getLatLng = (coords) => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
});

const LIST = [
  { name: "Hadean Eon" },
  { name: "Archaen Eon" },
  { name: "Proterozoic Eon" },
  { name: "Phanterozoic Eon" },
];

const initMarkers = (list) =>
  list.map(({ name }) => ({ name, location: null }));

function Item({ id, title, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={[styles.item]}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

function EditLocationsScreen({ lociStore, setLociStore }) {
  const [loci, setLoci] = useState(lociStore);

  useEffect(() => {
    setLoci([...lociStore]);
  }, [lociStore]);

  let isEmpty = loci.length === 0;

  const updateLoci = (loci) => {
    setLoci(loci);
    setLociStore(loci);
  };

  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [followsUserLocation, setFollowsUserLocation] = useState(true);
  const [currentMarker, setCurrentMarker] = useState(loci[0].name);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      // if (location.coords === undefined) {
      //     setRegion({...getLatLng(newLocation.coords), ...region });
      // }

      let newLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(newLocation);
    })();
  }, []);

  const onDoublePress = (e) => {
    e.preventDefault();
    const { coordinate, position } = e.nativeEvent;
    let delta_x = Math.abs(coordinate.latitude - userLocation.coords.latitude);
    let delta_y = Math.abs(
      coordinate.longitude - userLocation.coords.longitude
    );

    if (delta_x < 0.00001 && delta_y < 0.00001) {
      setFollowsUserLocation(true);
    }
  };

  const moveTo = async (i) => {
    setShowListModal(false);
    if (i >= loci.length) {
      setCurrentMarker(`Locus ${i + 1}`);
    } else {
      setCurrentMarker(loci[i].name);
    }

    setCurrentMarkerIndex(i);
  };
  const nextLocus = async () => moveTo(currentMarkerIndex + 1);
  const backLocus = async () => moveTo(currentMarkerIndex - 1);

  const updateLocusName = async (value) => {
    if (currentMarkerIndex < loci.length) {
      let newLoci = [...loci];
      newLoci[currentMarkerIndex].name = value;
      updateLoci(newLoci);
    }

    setCurrentMarker(value);
  };

  const addLocusFromCoords = (location) => {
    let newLoci = [...loci];

    if (currentMarkerIndex === loci.length) {
      // TODO: FIX to coords
      newLoci.push({
        name: null,
        id: newLoci.length,
        coords: null,
      });
    }

    newLoci[currentMarkerIndex].name = currentMarker
      ? currentMarker
      : `Locus ${loci.length + 1}`;
    newLoci[currentMarkerIndex].coords = location;

    updateLoci(newLoci);
    moveTo(currentMarkerIndex + 1);
  };

  const addLocus = async () => {
    let userLocation = await Location.getCurrentPositionAsync();
    addLocusFromCoords(userLocation.coords);
  };

  const longPressAddLocus = (e) => {
    const newLength = addLocusFromCoords({ ...e.nativeEvent.coordinate });
  };

  const insert = async (i) => {
    let userLocation = await Location.getCurrentPositionAsync();
    let newLoci = await [...loci];
    const name = `Locus ${i + 1}`;
    newLoci.splice(i, 0, { name, coords: userLocation.coords });
    await updateLoci(newLoci);

    setCurrentMarker(name);
    setCurrentMarkerIndex(i);
  };
  const insertBefore = async () => insert(currentMarkerIndex);
  const insertAfter = async () => insert(currentMarkerIndex + 1);

  const deleteLocus = () => {
    let newLoci = [...loci];
    newLoci.splice(currentMarkerIndex, 1);
    updateLoci(newLoci);

    if (currentMarkerIndex >= newLoci.length) {
      setCurrentMarkerIndex(newLoci.length);
      setCurrentMarker(`Locus ${currentMarkerIndex}`);
    } else {
      setCurrentMarker(newLoci[currentMarkerIndex].name);
    }
  };
  const deleteLocusAlert = async () => {
    Alert.alert(
      "Delete Locus",
      `Are you sure you want to delete locus '${currentMarker}'`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: deleteLocus },
      ]
    );
  };

  const dragMarker = (coordinate, i) => {
    let newLoci = [...loci];
    newLoci[i].coords = {
      ...newLoci[i].coords,
      ...coordinate,
    };
    updateLoci(newLoci);
  };

  const showList = () => setShowListModal(true);

  let text = "Waiting..";
  let latlng = { latitude: 0, longitude: 0 };
  if (errorMsg) {
    text = errorMsg;
  } else if (userLocation) {
    latlng = getLatLng(userLocation.coords);
  }
  let isBeforeEndOfList = currentMarkerIndex < loci.length;
  let isLocated = isBeforeEndOfList && loci[currentMarkerIndex].coords !== null;

  return (
    <ScrollView style={styles.container}>
      <Modal animationType={"slide"} transparent={true} visible={showListModal}>
        <View style={styles.modal}>
          <FlatList
            data={loci}
            renderItem={({ item, index }) => (
              <Item
                id={index}
                title={item.name}
                onPress={() => moveTo(index)}
              />
            )}
            onPress={() => {}}
          />

          <Button
            title="Close"
            onPress={() => {
              setShowListModal(false);
            }}
          />
        </View>
      </Modal>
      <View style={textInputFocus ? { flex: 0 } : {}}>
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          onUserLocationChange={({ coordinate }) =>
            setUserLocation({ coords: { ...coordinate } })
          }
          onPanDrag={() => setFollowsUserLocation(false)}
          onDoublePress={onDoublePress}
          followsUserLocation={followsUserLocation}
          onLongPress={longPressAddLocus}
          style={{
            width: Dimensions.get("window").width,
            height: textInputFocus ? 0 : Dimensions.get("window").height / 2,
          }}
        >
          {loci.map((marker, i) =>
            marker.coords ? (
              <Marker
                pinColor={i === currentMarkerIndex ? "red" : "#ff9999"}
                key={`key${i}`}
                coordinate={marker.coords}
                title={marker.name}
                onDrag={(e) => dragMarker(e.nativeEvent.coordinate, i)}
                onPress={() => moveTo(i)}
                draggable
              />
            ) : (
              <></>
            )
          )}
          <Polyline
            coordinates={loci
              .filter((locus) => locus.coords)
              .map((locus) => locus.coords)}
            strokeWidth={6}
          />
        </MapView>
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          marginTop: textInputFocus ? 50 : 0,
        }}
      >
        <View style={{ flex: 2, alignItems: "center" }}>
          {currentMarkerIndex > 0 ? (
            <Button title="Previous" onPress={backLocus} />
          ) : (
            <></>
          )}
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Button title="List" onPress={showList} />
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          {currentMarkerIndex < loci.length ? (
            <Button title={isLocated ? "Next" : "Skip"} onPress={nextLocus} />
          ) : (
            <></>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 5,
          justifyContent: "space-around",
        }}
      >
        {currentMarkerIndex >= loci.length ? (
          <Text style={{ fontSize: 16, alignItems: "center" }}>
            You finished your list
          </Text>
        ) : (
          <></>
        )}
      </View>
      <View style={{ marginTop: 5 }}>
        <Button
          title={
            currentMarkerIndex < loci.length
              ? isLocated
                ? "Update locus"
                : "Add locus"
              : "Add new locus"
          }
          onPress={addLocus}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-around",
        }}
      >
        <TextInput
          onFocus={() => setTextInputFocus(true)}
          onEndEditing={() => setTextInputFocus(false)}
          onChangeText={updateLocusName}
          style={{ fontSize: 24, alignItems: "center" }}
          value={currentMarker}
        />
      </View>

      {isLocated ? (
        <View style={{ flexDirection: "row", paddingTop: 5 }}>
          <View style={{ flex: 3 }}>
            <Button title="Insert Before" onPress={insertBefore} />
          </View>
          <View style={{ flex: 3 }}>
            <Button title="Insert After" onPress={insertAfter} />
          </View>
        </View>
      ) : (
        <></>
      )}
      {isBeforeEndOfList ? (
        <Button
          style={{ marginTop: 10 }}
          title="Delete"
          onPress={deleteLocusAlert}
        />
      ) : (
        <></>
      )}
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  lociStore: getActiveJourney(state.journeys, state.selJourney).loci,
});

const mapDispatchToProps = { setLociStore: setLoci };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditLocationsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
  modal: {
    alignItems: "center",
    backgroundColor: "white",
    opacity: 0.9,
    padding: 10,
    paddingTop: 80,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 1,
  },
});
