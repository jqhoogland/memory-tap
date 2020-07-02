import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, Button } from 'react-native';
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

export default function App() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [followsUserLocation, setFollowsUserLocation] = useState(true);
    const [listToLearn, setListToLearn] = useState(LIST);
    const [markers, setMarkers] = useState([]);
    const [currentMarker, setCurrentMarker] = useState(0);
   
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
        await newMarkers.push({name: listToLearn[currentMarker].name, location});

        if (currentMarker < listToLearn.length - 1) {
            setCurrentMarker(currentMarker + 1);
        }
        setMarkers(newMarkers);
    };
    
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
            <View style={styles.container}>
            <View>
            <MapView showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={({coordinate}) => setLocation({coords: {...coordinate}})}
        onPanDrag={() => setFollowsUserLocation(false)}
        onDoublePress={onDoublePress}
        followsUserLocation={followsUserLocation}
        style={styles.mapStyle} >

        {markers.map((marker, i) => (
                <Marker
            key={`key${i}`}
            coordinate={marker.location.coords}
            title={marker.name}
            onDrag={e => dragMarker(e.nativeEvent.coordinate, i)}
            draggable
                />
        ))}
            <Polyline
	coordinates={markers.map(markers => markers.location.coords)
	}

	strokeWidth={6}
	    />
        </MapView>
            
        </View>
            <View style={{flexDirection: "row", padding: 10}}>
            <View style={{flex: 2, alignItems:"center"}}><Text>Previous</Text></View>
            <View style={{flex: 2, alignItems:"center"}}><Text>{listToLearn[currentMarker].name}</Text></View>
            <View style={{flex: 2, alignItems:"center"}}><Text>Skip</Text></View>
        </View>

            <View>
            <Button title="Add locus" onPress={addLocus}/>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
    },
});



























