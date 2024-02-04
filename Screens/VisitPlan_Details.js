import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

export default function VisitPlan_Detail({ navigation }) {
  const [data, setData] = useState([
    {
      visitplan_start: "",
      visitplan_end: "",
      visitplan_self: "",
      visitplan_rm: "",
      visitplan_sm: "",
      visitplan_nsm: "",
      visitplan_ceo: "",
      site_name: "",
      doctor_firstname: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://86.48.3.100:1337/api/visit-plans?populate=*"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(
          data.data.map((cv) => {
            const visitplan_start = cv.attributes?.visitplan_start;
            const formattedDate = visitplan_start
              ? new Date(visitplan_start).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : null;

            return {
              id: cv.id,
              visitplan_start: formattedDate,
              visitplan_end: cv.attributes?.visitplan_end,
              visitplan_self: cv.attributes.visitplan_self,
              visitplan_rm: cv.attributes.visitplan_rm,
              visitplan_sm: cv.attributes.visitplan_sm,
              visitplan_nsm: cv.attributes.visitplan_nsm,
              visitplan_ceo: cv.attributes.visitplan_ceo,
              site_name: cv.attributes.site_mstr.data.attributes.site_name,
              doctor_firstname:
                cv.attributes.doctor_mstr.data.attributes.doctor_firstname,
            };
          }) || []
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  console.log(data[0].visitplan_start);
  // console.log("Data===>", data[0].visitplan_start);

  return (
    <SafeAreaView style={{ backgroundColor: "#f2f2f2" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>Available Cars</Text> */}

        {data.map(
          (
            {
              visitplan_start,
              visitplan_end,
              visitplan_self,
              visitplan_rm,
              visitplan_sm,
              visitplan_nsm,
              visitplan_ceo,
              site_name,
              doctor_firstname,
            },
            index
          ) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // handle onPress
                }}
              >
                <View style={styles.card}>
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardPrice}>{site_name}</Text>
                      <Text style={styles.cardTitle}>{doctor_firstname}</Text>
                    </View>

                    <View style={styles.cardStats}>
                      <View style={styles.cardStatsItem}>
                        <Text style={styles.cardStatsItemText}>
                          Self: {visitplan_self ? "YES" : "NO"}
                        </Text>
                        <Text style={styles.cardStatsItemText}>
                          RM: {visitplan_rm ? "YES" : "NO"}
                        </Text>
                        <Text style={styles.cardStatsItemText}>
                          SM: {visitplan_sm ? "YES" : "NO"}
                        </Text>
                        <Text style={styles.cardStatsItemText}>
                          NSM: {visitplan_nsm ? "YES" : "NO"}
                        </Text>
                        <Text style={styles.cardStatsItemText}>
                          CEO: {visitplan_ceo ? "YES" : "NO"}
                        </Text>
                      </View>

                      <View style={styles.cardStatsItem}>
                        <Text style={styles.cardStatsItemText}>
                          {/* {acceleration} sec */}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.cardFooterText}>
                        {visitplan_start}
                      </Text>

                      <Text style={styles.cardFooterText}>
                        <TouchableOpacity onPress={() => {}}>
                          <View
                            style={{
                              ...styles.btn,
                              backgroundColor: "#007aff",
                              borderColor: "#007aff",
                            }}
                          >
                            <Text style={styles.btnText}>Map</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                          <View style={styles.btn}>
                            <Text style={styles.btnText}>Delete</Text>
                          </View>
                        </TouchableOpacity>
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Card */
  card: {
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTop: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardImg: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardBody: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  cardHeader: {
    flexDirection: "col",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#2d2d2d",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
  },
  cardStats: {
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: -12,
  },
  cardStatsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardStatsItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#48496c",
    marginLeft: 4,
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#e9e9e9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  cardFooterText: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: 3,
    fontSize: 14,
    fontWeight: "600",
    color: "#48496c",
  },
  btn: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: "#eb4034",
    borderColor: "#ad0a23",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "600",
    color: "#fff",
  },
});