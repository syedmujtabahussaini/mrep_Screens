// const { visitplan_actuallatitude, visitplan_actuallongitude } = route.params;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const { visitplan_actuallatitude, visitplan_actuallongitude } = route.params;
  useEffect(() => {
    (async () => {
      // Check if permission is granted
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      // Fetch location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    // Fetch route coordinates when component mounts
    fetchRouteCoordinates();
  }, []);

  const fetchRouteCoordinates = async () => {
    console.log(location);
    try {
      const response = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${location.latitude},${location.longitude};${visitplan_actuallatitude},${visitplan_actuallongitude}?steps=true&geometries=geojson`
      );
      const data = await response.json();

      console.log("data===>", data);
      // const route = data.routes[0];
      // const routeCoordinates = route.geometry.coordinates.map((coord) => ({
      //   latitude: coord[1],
      //   longitude: coord[0],
      // }) )
      setRouteCoordinates(routeCoordinates);
    } catch (error) {
      console.error("Error fetching route coordinates:", error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          showsUserLocation={true}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          />

          <Marker
            coordinate={{
              latitude: visitplan_actuallatitude,
              longitude: visitplan_actuallongitude,
            }}
            title="Your Location"
            description="You are here"
          />

          {/* Polyline connecting the two markers */}
          {/* {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF0000"
              strokeWidth={2}
            />
          )} */}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
