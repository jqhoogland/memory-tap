import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, StyleSheet, Dimensions, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline} from 'react-native-maps';

const getLatLng = (coords) => ({
    latitude: coords.latitude,
    longitude: coords.longitude
});

const LIST = [
    {name: "Hadean Eon"},
    {name: "Archaen Eon"},
    {name: "Proterozoic Eon"},
    {name: "Phanterozoic Eon"}
];

const initMarkers = (list) => list.map(({name}) => ({name, location: null}));

export default function App() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [followsUserLocation, setFollowsUserLocation] = useState(true);
    const [listToLearn, setListToLearn] = useState(LIST);
    const [markers, setMarkers] = useState(initMarkers(LIST));
    const [currentMarker, setCurrentMarker] = useState(LIST[0].name);
    const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
    const [textInputFocus, setTextInputFocus] = useState(false);
   
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }

            // if (location.coords === undefined) {
            //     setRegion({...getLatLng(newLocation.coords), ...region });
            // }

            let newLocation = await Location.getCurrentPositionAsync({});
            setLocation(newLocation);
        })();
    }, []);

    const onDoublePress = (e) => {
        e.preventDefault();
        const {coordinate, position} = e.nativeEvent;
        let delta_x = Math.abs(coordinate.latitude - location.coords.latitude);
        let delta_y = Math.abs(coordinate.longitude - location.coords.longitude);
        
        if (delta_x < 0.00001 && delta_y < 0.00001) {
            setFollowsUserLocation(true);
        }
    };

    const addLocus = async () => {
        let location = await Location.getCurrentPositionAsync();
        let newMarkers = await [...markers];

        newMarkers[currentMarkerIndex].name = currentMarker;
        newMarkers[currentMarkerIndex].location = location;
        
        setMarkers(newMarkers);

        if (currentMarkerIndex >= listToLearn.length - 1) {
            setCurrentMarker(`Locus ${currentMarkerIndex + 2}`);
        } else {
            setCurrentMarker(listToLearn[currentMarkerIndex+1].name);
        }

        setCurrentMarkerIndex(currentMarkerIndex + 1);
    };

    const skipLocus = async() => {
        if (currentMarkerIndex >= listToLearn.length - 1) {
            setCurrentMarker(`Locus ${currentMarkerIndex + 2}`);
        } else {
            setCurrentMarker(markers[currentMarkerIndex+1].name);
        }

        setCurrentMarkerIndex(currentMarkerIndex + 1);
    };

    const backLocus = async() => {
        if (currentMarkerIndex >= listToLearn.length) {
            setCurrentMarker(`Locus ${currentMarkerIndex}`);
        } else {
            setCurrentMarker(markers[currentMarkerIndex-1].name);
        }

        setCurrentMarkerIndex(currentMarkerIndex - 1);
    }
    
    let text = 'Waiting..';
    let latlng = {latitude: 0, longitude: 0};
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        latlng = getLatLng(location.coords);
    }

    const dragMarker = (coordinate, i) => {
        let newMarkers = [...markers];
        newMarkers[i].location.coords = {...newMarkers[i].location.coords, ...coordinate};
        setMarkers(newMarkers);
    };

    return (
            <ScrollView style={styles.container}>
            <View style={textInputFocus ? {flex: 0} : {}}>
            <MapView showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={({coordinate}) => setLocation({coords: {...coordinate}})}
        onPanDrag={() => setFollowsUserLocation(false)}
        onDoublePress={onDoublePress}
        followsUserLocation={followsUserLocation}
        style={{
            width: Dimensions.get('window').width,
            height: textInputFocus ? 0 : Dimensions.get('window').height/2,
        }} >

        {markers.map((marker, i) => (marker.location ? 
                                     (<Marker
            key={`key${i}`}
            coordinate={marker.location.coords}
            title={marker.name}
            onDrag={e => dragMarker(e.nativeEvent.coordinate, i)}
            draggable
                                      />
                                     ) : (
                                     <></>)
                                     
        ))}
            <Polyline
	coordinates={markers.filter(markers => markers.location).map(markers => markers.location.coords)
	}

	strokeWidth={6}
	    />
        </MapView>
        </View>
            
            <View style={{flexDirection: "row", padding: 10, marginTop: textInputFocus ? 50: 0 }}>
            <View style={{flex: 2, alignItems:"center"}}>{currentMarkerIndex > 0 ? (<Button title="Previous" onPress={backLocus}/>
                                                                                   ): (<></>)}
                                                          </View>
            <View style={{flex: 2, alignItems:"center"}}><Button title="List"/></View>
            <View style={{flex: 2, alignItems:"center"}}><Button title="Skip" onPress={skipLocus}/></View>
        </View>

<View style={{ flexDirection:"row", padding: 10, justifyContent: "space-around", marginTop: 30, marginBottom: 10}}>
{(currentMarkerIndex >= listToLearn.length) ? 
<Text style={{fontSize: 16, alignItems: "center"}}>You finished your list
</Text> : <></>
}
</View>
            <View style={{marginTop: 30}}>
            <Button title={currentMarkerIndex < listToLearn.length ? markers[currentMarkerIndex].location === null ? "Add locus" : "Update locus" : "Add new locus"} onPress={addLocus}/>
        </View>


<View style={{ flexDirection:"row", padding: 10, justifyContent: "space-around", marginTop: 50}}>
<TextInput 
onFocus={() => setTextInputFocus(true)}
onEndEditing={() => setTextInputFocus(false)}
onChangeText={setCurrentMarker}
style={{fontSize: 24, alignItems: "center"}} 
value={currentMarker}
/>
</View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
});



























