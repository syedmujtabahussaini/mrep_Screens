import React, { useEffect, useState } from "react";
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

const CONTACTS = [
  {
    name: "Larson Ashbee",
    phone: "+1 (972) 566-2684",
  },
  {
    name: "Rosie Arterton",
    phone: "+1 (845) 456-2237",
  },
  {
    name: "Lorraine Abbott",
    phone: "+1 (959) 422-3635",
  },
  {
    name: "Knapp Berry",
    phone: "+1 (951) 472-2967",
  },
  {
    name: "Bell Burgess",
    phone: "+1 (887) 478-2693",
  },
  {
    name: "Shelby Ballard",
    phone: "+1 (824) 467-3579",
  },
  {
    name: "Bernard Baker",
    phone: "+1 (862) 581-3022",
  },
  {
    name: "Elma Chapman",
    phone: "+1 (913) 497-2020",
  },
];

export default function Hospitals({ route }) {
  console.log(route.params);

  const [loading, setLoading] = useState(false);
  const [siteData, setSitedata] = useState([]);

  const sections = React.useMemo(() => {
    const sectionsMap = CONTACTS.reduce((acc, item) => {
      const [lastName] = item.name.split(" ").reverse();

      return Object.assign(acc, {
        [lastName[0]]: [...(acc[lastName[0]] || []), item],
      });
    }, {});

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://86.48.3.100:1337/api/userarea-accesses?populate[user_mstr]=*&populate[area_mstrs][populate][site_mstrs][populate]=*&filters[user_mstr][id][$eq]=" +
            route.params.mio_id
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSitedata(
          data.data.flatMap((cv) =>
            cv.attributes.area_mstrs.data.flatMap(
              (area) =>
                area.attributes.site_mstrs?.data?.map((site) => ({
                  site_id: site.id,
                  site_name: site.attributes.site_name,
                  site_latitude: site.attributes.site_latitude,
                  site_longitude: site.attributes.site_longitude, // Replace with the actual property
                })) || []
            )
          )
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [loading]);

  return (
    <SafeAreaView style={{ backgroundColor: "#f2f2f2" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hospitals</Text>
        </View>

        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>{letter}</Text> */}
          <View style={styles.sectionItems}>
            {siteData.map(({ site_name }, index) => {
              return (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                    }}
                  >
                    <View style={styles.card}>
                      <View style={[styles.cardImg, styles.cardAvatar]}>
                        <Text style={styles.cardAvatarText}>
                          {site_name[0]}
                        </Text>
                      </View>

                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{site_name}</Text>

                        {/* <Text style={styles.cardPhone}>{phone}</Text> */}
                      </View>

                      <View style={styles.cardAction}>
                        <FeatherIcon
                          color="#9ca3af"
                          name="chevron-right"
                          size={22}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    backgroundColor: "#f0f1f7",
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Section */
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  sectionItems: {
    marginTop: 8,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: "#d6d6d6",
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9ca1ac",
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  cardBody: {
    marginRight: "auto",
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#616d79",
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
  },
});
