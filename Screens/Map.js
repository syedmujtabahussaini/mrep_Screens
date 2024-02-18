// const { visitplan_actuallatitude, visitplan_actuallongitude } = route.params;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const { visitplan_actuallatitude, visitplan_actuallongitude } = route.params;

  // const fetchRouteCoordinates = async () => {
  //   try {
  //     console.log("location===>", location);
  //     const response = await fetch(
  //       `http://router.project-osrm.org/route/v1/driving/${location.latitude},${location.longitude};${visitplan_actuallatitude},${visitplan_actuallongitude}?steps=true&geometries=geojson`
  //     );
  //     const data = await response.json();
  //     const route = data.routes[0];
  //     const routeCoordinates = route.geometry.coordinates.map((coord) => ({
  //       latitude: coord[1],
  //       longitude: coord[0],
  //     }));
  //     setRouteCoordinates(routeCoordinates);
  //   } catch (error) {
  //     console.error("Error fetching route coordinates:", error.message);
  //   }
  // };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      // Fetch location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // const response = await fetch(
      //   `http://router.project-osrm.org/route/v1/driving/${visitplan_actuallatitude},${visitplan_actuallongitude};${location.coords.latitude},${location.coords.longitude}?steps=true&geometries=geojson`
      // );
      // const data = await response.json();
      // const route = data.routes[0];

      // const routeCoordinates = route.geometry.coordinates.map((coord) => ({
      //   longitude: coord[1],
      //   latitude: coord[0],
      // }));
      // console.log(routeCoordinates[0]);
      // setRouteCoordinates(routeCoordinates);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsTraffic={true}
          loadingEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="User Information"
          />
          <Marker
            coordinate={{
              latitude: visitplan_actuallatitude,
              longitude: visitplan_actuallongitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            title={"Your Location"}
          />
          {/* Polyline connecting the two markers */}

          <Polyline
            coordinates={[
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              {
                latitude: visitplan_actuallatitude,
                longitude: visitplan_actuallongitude,
              },
            ]}
            strokeWidth={5}
            strokeColor="black"
          />
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
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height * 0.4,

    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
