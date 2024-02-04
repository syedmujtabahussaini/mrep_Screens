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
import FeatherIcon from "react-native-vector-icons/Feather";

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
  const [attendance, setAttendance] = useState({
    attendance_date: "",
    attendance_status: "",
  });
  const mio_id = route.params.mio; //login user id
  const date = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://86.48.3.100:1337/api/user-attendances?populate[user_mstr][id]=6&filters[attendance_date][$gte]=2024-02-04&filters[attendance_date][$lt]=2024-02-05`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        console.log("result", result);
        // setAttendance(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once (similar to componentDidMount)

  const handlerAttendance = async () => {
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
              attendance_logitude: 0,
              attendance_latitude: 0,
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
      Alert.alert("Success", "Data posted successfully");
      setAttendance({ attendance_status: "marked", attendance_date: date });
    } catch (error) {
      // Error handling
      console.error("Error posting data:", error);
      Alert.alert("Error", "Failed to post data. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <FeatherIcon name="menu" size={24} color="#1a2525" />
          </TouchableOpacity> */}
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
              month: "2-digit",
              year: "numeric",
            })}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.topContent}>
          {attendance.attendance_status ? (
            <TouchableOpacity disabled={true} onPress={handlerAttendance}>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>
                  Attendance Marked Time in :
                  {" " +
                    attendance.attendance_date.toLocaleString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                </Text>
                <FeatherIcon name="arrow-right" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlerAttendance}>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>
                  Mark Attendance of
                  {" " +
                    date.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
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
                      // handle onPress
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
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Today's Visit Plans</Text>
            <TouchableOpacity>
              <Text style={styles.contentLink}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentPlaceholder}>
            {/* Replace with your content */}
            <Text>Hello</Text>
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
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#07a9e3",
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
    marginTop: 12,
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
    paddingHorizontal: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#505050",
    marginTop: 8,
    textAlign: "center",
  },
  /** Content */
  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 8,
    height: 420,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#505050",
  },
  contentLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#505050",
  },
  contentPlaceholder: {
    borderStyle: "dashed",
    borderWidth: 4,
    borderColor: "#e5e7eb",
    flex: 1,
    borderRadius: 8,
  },
});