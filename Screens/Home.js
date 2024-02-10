import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import FeatherIcon from "react-native-vector-icons/Feather";
import VisitPlan_Detail from "./VisitPlan_Details";
import { useNavigation } from "@react-navigation/native";
const categories = [
  [
    {
      icon: "🩺",
      name: "Doctors",
    },
    {
      icon: "🛌🏻",
      name: "Hospitals",
    },
    {
      icon: "🍃",
      name: "Leave",
    },
    {
      icon: "📆",
      name: "Day Plan",
    },
  ],
  // [
  // {
  //   icon: "💵",
  //   name: "Invite",
  // },
  // {
  //   icon: "🏦",
  //   name: "Finance",
  // },
  // {
  //   icon: "💳",
  //   name: "Wallet",
  // },
  // {
  //   icon: "🌳",
  //   name: "Trees",
  // },
  // ],
];

export default function Home({ route }) {
  const navigation = useNavigation();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [attendance, setAttendance] = useState({
    attendance_date: "",
    attendance_status: "",
  });
  const mio_id = route.params.mio; //login user id
  const date = new Date();

  const currentDate = new Date();
  const nextDay = new Date(currentDate);

  nextDay.setDate(currentDate.getDate() + 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const current_Date = formatDate(currentDate);
  const formattedNextDay = formatDate(nextDay);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });
    } catch (error) {
      handleError("Error getting current location");
    }
  };

  const handleError = (errorMessage) => {
    Alert.alert("Error", errorMessage, [{ text: "OK" }]);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []); // Empty dependency array ensures the useEffect runs once, similar to componentDidMount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://86.48.3.100:1337/api/user-attendances?populate[user_mstr]=*&filters[attendance_date][$gte]=${current_Date}&filters[attendance_date][$lt]=${formattedNextDay}&filters[user_mstr][id][$eq]=${mio_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        setAttendance({
          attendance_date: result.data[0]?.attributes?.attendance_date || "",
          attendance_status:
            result.data[0]?.attributes?.attendance_status || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once (similar to componentDidMount)

  const date1 = new Date(attendance.attendance_date);

  const formattedDate = date1.toLocaleDateString([], {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // console.log("Change time ", formattedDate);

  const handlerAttendance = async () => {
    await getCurrentLocation(); // Triggering the update manually
    try {
      const response = await fetch(
        "http://86.48.3.100:1337/api/user-attendances",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // You can add other headers if needed
          },
          body: JSON.stringify({
            data: {
              attendance_date: date,
              attendance_logitude: location.longitude,
              attendance_latitude: location.latitude,
              user_mstr: mio_id,
              attendance_status: "marked",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post data");
      }

      // Data posted successfully
      Alert.alert("Success", "Attendance has been marked!");
      setAttendance({ attendance_status: "marked", attendance_date: date });
    } catch (error) {
      // Error handling
      console.error("Error posting data:", error);
      Alert.alert("Error", "Failed to post data. Please try again.");
    }
  };

  const handlerLinks = (item) => {
    if ((item = "Day Plan")) {
      navigation.navigate("VisitPlan");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16 }}>{route.params.mioName}</Text>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <Image
              style={styles.headerImage}
              source={{
                uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Today :
          {" " +
            date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
        </Text>
      </View>

      <View style={styles.topContent}>
        {attendance.attendance_status ? (
          <TouchableOpacity disabled={true} onPress={handlerAttendance}>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Attendance Marked! TIME IN
                {" " +
                  formattedDate.slice(
                    formattedDate.indexOf(",") + 2,
                    formattedDate.length
                  )}
              </Text>
              <FeatherIcon name="arrow-right" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlerAttendance}>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Mark Attendance for the
                {" " +
                  date.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
              </Text>
              <FeatherIcon name="arrow-right" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.categories}>
          {categories.map((row, index) => (
            <View style={styles.categoriesRow} key={index}>
              {row.map((item) => (
                <TouchableOpacity
                  style={styles.category}
                  key={item.name}
                  onPress={() => {
                    handlerLinks(item.name);
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Text style={{ fontSize: 36 }}>{item.icon}</Text>
                  </View>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Today's Visit Plans</Text>
            <TouchableOpacity>
              <Text style={styles.contentLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentPlaceholder}>
            {/* Replace with your content */}
            <VisitPlan_Detail attendance_date={date} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f1f7",
    flex: 1,
  },
  /** Top */
  top: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    // backgroundColor: "lightblue",
  },
  topContent: {
    paddingHorizontal: 24,
  },
  /** Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  /** Banner */
  banner: {
    marginTop: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#075eec",
    padding: 16,
    borderRadius: 16,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
    marginRight: "auto",
  },
  /** Categories */
  categories: {
    marginTop: 3,
  },
  categoriesRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: -4,
  },
  /** Category */
  category: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  categoryIcon: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#505050",
    marginTop: 8,
    textAlign: "center",
  },
  /** Content */
  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 8,
    // height: 520,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#505050",
  },
  contentLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#505050",
  },
  contentPlaceholder: {
    // borderStyle: "dashed",
    // borderWidth: 5,
    // borderColor: "#e5e7eb",
    flex: 1,
    borderRadius: 8,
  },
});
