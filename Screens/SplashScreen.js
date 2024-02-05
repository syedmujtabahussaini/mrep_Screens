import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";

const { height, width } = Dimensions.get("window");

export default function Example() {
  const [heroImageHeight, setHeroImageHeight] = useState(height * 0.5);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
      } catch (error) {
        handleError(error.message);
      }
    };

    const handleError = (errorMessage) => {
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    };

    requestLocationPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={{ uri: "https://withfra.me/shared/Landing.3.png" }}
          style={[styles.heroImage, { height: heroImageHeight }]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>
            Plan your day{"\n"}with{" "}
            <View style={styles.appName}>
              <Text style={styles.appNameText}>MyApp</Text>
            </View>
          </Text>
          <Text style={styles.text}>
            Aliqua ullamco incididunt elit labore consequat ipsum sunt
            exercitation aliqua duis nulla et qui fugiat
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Let's go</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: "#281b52",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    color: "#9992a7",
    textAlign: "center",
  },
  /** Hero */
  hero: {
    backgroundColor: "#d8dffe",
    margin: 12,
    borderRadius: 16,
    padding: 16,
  },
  heroImage: {
    width: "100%",
  },
  /** Content */
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  contentHeader: {
    paddingHorizontal: 24,
  },
  appName: {
    backgroundColor: "#fff2dd",
    transform: [
      {
        rotate: "-5deg",
      },
    ],
    paddingHorizontal: 6,
  },
  appNameText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#281b52",
  },
  /** Button */
  button: {
    backgroundColor: "#56409e",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
});
