import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Meeting({ route }) {
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const [visitplan_actualself, setvisitplan_actualself] = useState(true);
  const [visitplan_actualrm, setvisitplan_actualrm] = useState(false);

  const [visitplan_actualsm, setvisitplan_actualsm] = useState(false);
  const [visitplan_actualnsm, setvisitplan_actualnsm] = useState(false);
  const [visitplan_actualceo, setvisitplan_actualceo] = useState(false);

  const [drReson, setDrreason] = useState([]);
  const [drReasonId, setdrReasonId] = useState("");
  const [visitplan_actualdocavailable, setVisitplan_actualdocavailable] =
    useState(false);

  //   const [site, setSite] = useState({ site_id: "" });
  // const [siteData, setSitedata] = useState([]);
  // const [doctor, setdoctor] = useState(null);
  // const [doctorData, setDoctordata] = useState([]);

  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDate, setshowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setshowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const navigation = useNavigation();

  const resetState = () => {
    setVisitPlanSelf(true);
    setVisitPlanRm(false);
    setVisitPlanSm(false);
    setVisitPlanNsm(false);
    setVisitPlanCeo(false);
    // setSite({ site_id: 0 });
    // setSitedata([]);
    setDoctordata([]);
    setdoctor(null);
    setDate(new Date());
    setEndDate(new Date());
  };

  const onChange = (e, selectedDate) => {
    setshowStartDate(false);
    setShowStartTime(true);
    setDate(selectedDate);
    setEndDate(selectedDate);
  };

  const onChangeTime = (e, selectedDate) => {
    setShowStartTime(false);
    setDate((prevDate) => {
      // If selectedDate is available, update only the time part
      if (selectedDate) {
        const newDate = new Date(prevDate);
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        return newDate;
      }
      // If selectedDate is falsy, return the current date unchanged
      return prevDate;
    });
  };

  const onChangeEnd = (e, selectedDate) => {
    setshowEndDate(false);
    setShowEndTime(true);
    setEndDate(selectedDate);
  };

  const onChangeTimeEnd = (e, selectedDate) => {
    setShowEndTime(false);
    setEndDate((prevDate) => {
      if (selectedDate) {
        // Create new Date objects for comparison
        const prevDateTime = new Date(prevDate);
        const selectedDateTime = new Date(selectedDate);

        // If selected time is greater than or equal to current time
        if (selectedDateTime >= prevDateTime) {
          // Update only the time part
          const newDate = new Date(prevDate);
          newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
          return newDate;
        } else {
          // If selected time is less than current time, return the current date unchanged
          // You can also set an error state or display an error message here
          Alert.alert(
            "Attention!",
            "Vsiti End Time must be greater then Start Time!"
          );
          return prevDate;
        }
      }
      // If selectedDate is falsy, return the current date unchanged
      return prevDate;
    });
  };

  // useEffect(() => {
  //   fetch("http://86.48.3.100:1337/api/user-mstrs")
  //     .then((res) => res.json())
  //     .then((data) =>
  //       setUserdata(
  //         data.data.map((cv) => {
  //           return {
  //             id: cv.id,
  //             user_firstname: cv.attributes.user_firstname,
  //           };
  //         })
  //       )
  //     )
  //     .catch((error) => console.log(error.message));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://86.48.3.100:1337/api/docreason-mstrs"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setDrreason(
          data.data.map((cv) => {
            return {
              drReasonid: cv.id,
              drReasonDesc: cv.attributes.docreason_desc,
            };
          })
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://86.48.3.100:1337/api/doctor-accesses?populate=*&filters[site_mstrs][id][$eq]=${
  //           site.site_id || route.params.site_id
  //         }`
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setDoctordata(
  //         data.data.map((cv) => {
  //           return {
  //             doctor_id: cv.attributes.doctor_mstr.data.id,
  //             doctor_firstname:
  //               cv.attributes.doctor_mstr.data.attributes.doctor_firstname,
  //           };
  //         })
  //       );
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchData();
  // }, [site.site_id]);

  const toggleSwitchSelf = () =>
    setvisitplan_actualself((previousState) => !previousState);

  const toggleSwitchRm = () =>
    setvisitplan_actualrm((previousState) => !previousState);

  const toggleSwitchSm = () =>
    setvisitplan_actualsm((previousState) => !previousState);

  const toggleSwitchNSm = () =>
    setvisitplan_actualnsm((previousState) => !previousState);

  const toggleSwitchCeo = () =>
    setvisitplan_actualceo((previousState) => !previousState);

  const toggleSwitchDoctor = () =>
    setVisitplan_actualdocavailable((previousState) => !previousState);

  const saveData = async () => {
    setLoading(true);
    if (site.site_id === "" || doctor === "" || doctor === null) {
      Alert.alert("Alert!", "Please Select Site & Doctor");
      setLoading(false);
      return;
    }
    // console.log("update", {
    //   id: route.params.id,
    //   visitplan_start: date,
    //   visitplan_end: endDate,
    //   visitplan_self: visitPlanSelf,
    //   visitplan_rm: visitPlanRm,
    //   visitplan_sm: visitPlanSm,
    //   visitplan_nsm: visitPlanNsm,
    //   visitplan_ceo: visitPlanCeo,
    //   visitplan_actuallatitude: `${
    //     site.site_latitude || route.params.visitplan_actuallatitude
    //   }`,
    //   visitplan_actuallongitude: `${
    //     site.site_longitude || route.params.visitplan_actuallongitude
    //   }`,
    //   site_mstr: `${site.site_id || route.params.site_id}`,
    //   doctor_mstr: `${doctor || route.params.doctor_id}`,
    // });
    try {
      if (route.params.id) {
        const response = await fetch(
          "http://86.48.3.100:1337/api/visit-plans/60",
          {
            method: "PUT",
            body: JSON.stringify({
              data: {
                visitplan_start: date,
                visitplan_end: endDate,
                visitplan_self: visitPlanSelf,
                visitplan_rm: visitPlanRm,
                visitplan_sm: visitPlanSm,
                visitplan_nsm: visitPlanNsm,
                visitplan_ceo: visitPlanCeo,
                visitplan_actuallatitude: `${
                  site.site_latitude || route.params.visitplan_actuallatitude
                }`,
                visitplan_actuallongitude: `${
                  site.site_longitude || route.params.visitplan_actuallongitude
                }`,
                site_mstr: `${site.site_id || route.params.site_id}`,
                doctor_mstr: `${doctor || route.params.doctor_id}`,
              },
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        ToastAndroid.show("Record has been Updated! ", ToastAndroid.SHORT);
        navigation.navigate(
          "VisitPlanEdit",
          (attendance_date = { date: date.toISOString(), mio: mio })
        );
      } else {
        if (site.site_id === "" || doctor === "") {
          Alert.alert("Alert!", "Please Select Site & Doctor");
          return;
        }

        const response = await fetch(
          "http://86.48.3.100:1337/api/visit-plans",
          {
            method: "POST",
            body: JSON.stringify({
              data: {
                visitplan_start: date,
                visitplan_end: endDate,
                visitplan_self: visitPlanSelf,
                visitplan_rm: visitPlanRm,
                visitplan_sm: visitPlanSm,
                visitplan_nsm: visitPlanNsm,
                visitplan_ceo: visitPlanCeo,
                visitplan_actuallatitude: site.site_latitude,
                visitplan_actuallongitude: site.site_longitude,
                user_mstr: mio,
                site_mstr: site.site_id,
                doctor_mstr: doctor,
              },
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        ToastAndroid.show("Record has been Saved! ", ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert("Error:", error.message);

      // Handle error here, e.g., show an error message to the user
    } finally {
      setLoading(false);
      resetState();
    }
  };

  // console.log("route", route.params);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.title}>Creating Visit Plan</Text>
          <Text style={styles.subtitle}>Visit Plan of MIO-F.b.Area</Text>
        </View> */}
        <KeyboardAwareScrollView>
          <View style={styles.form}>
            <View style={styles.input}>
              {/* <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#222",
                  borderBlockColor: "black",
                }}
              >
                {route.params.mioName}
              </Text> */}
              {/* <View>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={drReson}
                  search
                  maxHeight={300}
                  labelField="drReasonDesc"
                  valueField="drReasonid"
                  placeholder={!isFocus ? "Select User....." : "..."}
                  searchPlaceholder="Search..."
                  // value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setUser(item.drReasonid);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
              </View> */}
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Site Name</Text>
              <View>
                <Text style={styles.inputControl}>
                  {route.params.site_name}
                </Text>
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Doctor Name</Text>
              <View>
                <Text style={styles.inputControl}>
                  {route.params.doctor_firstname}
                </Text>

                <View style={styles.inputSwitch}>
                  <Text style={styles.inputLabel}> Doctor is Available</Text>
                  <Switch
                    onValueChange={toggleSwitchDoctor}
                    value={visitplan_actualdocavailable}
                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                    trackColor={{ false: "#767577", true: "#075eec" }}
                    thumbColor={
                      visitplan_actualdocavailable ? "#f0f1f7" : "#f4f3f4"
                    }
                  />
                </View>

                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={drReson}
                  search
                  maxHeight={300}
                  labelField="drReasonDesc"
                  valueField="drReasonid"
                  placeholder={!isFocus ? "Select Reason....." : "..."}
                  searchPlaceholder="Search..."
                  value={setdrReasonId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setdrReasonId(item.drReasonid);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Visit Start Time</Text>

              {showStartDate && (
                <DateTimePicker
                  value={date}
                  mode={"date"}
                  is12Hour={true}
                  onChange={onChange}
                  display="spinner"
                />
              )}

              {showStartTime && (
                <DateTimePicker
                  value={date}
                  mode={"time"}
                  is12Hour={true}
                  onChange={onChangeTime}
                  display="spinner"
                />
              )}

              <Text
                onPress={() => {
                  setShowStartTime(true);
                }}
                style={styles.inputControl}
              >
                {date.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Visit End Time</Text>

              {showEndDate && (
                <DateTimePicker
                  value={endDate}
                  mode={"date"}
                  is12Hour={true}
                  onChange={onChangeEnd}
                  display="default"
                  backgroundColor={"#fff"}
                />
              )}

              {showEndTime && (
                <DateTimePicker
                  value={endDate}
                  mode={"time"}
                  is12Hour={true}
                  onChange={onChangeTimeEnd}
                />
              )}
              <Text
                onPress={() => {
                  setShowEndTime(true);
                }}
                style={styles.inputControl}
              >
                {endDate.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>

            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Visit Self</Text>
              <Switch
                onValueChange={toggleSwitchSelf}
                value={visitplan_actualself}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitplan_actualself ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Does RM Attend Meeting?</Text>
              <Switch
                onValueChange={toggleSwitchRm}
                value={visitplan_actualrm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitplan_actualrm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Does SM Attend Meeting?</Text>
              <Switch
                onValueChange={toggleSwitchSm}
                value={visitplan_actualsm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitplan_actualsm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Does NSM Attend Meeting?</Text>
              <Switch
                onValueChange={toggleSwitchNSm}
                value={visitplan_actualnsm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitplan_actualnsm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Does CEO Attend Meeting?</Text>
              <Switch
                onValueChange={toggleSwitchCeo}
                value={visitplan_actualceo}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitplan_actualceo ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>

            <View style={styles.formAction}>
              {/* <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "VisitPlanEdit",
                    (attendance_date = { date: date.toISOString(), mio: mio })
                  )
                }
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Details</Text>
                </View>
              </TouchableOpacity> */}

              {route.params.id ? (
                <TouchableOpacity onPress={saveData}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Update</Text>

                    {loading && <ActivityIndicator color="white" />}
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={saveData}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Submit</Text>

                    {loading && <ActivityIndicator color="white" />}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "#f0f1f7",
    paddingVertical: 10,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderStyle: "dashed",
    borderWidth: 5,
    borderColor: "#e5e7eb",
    flex: 1,
    borderRadius: 12,
  },
  header: {
    marginVertical: 10,
    paddingHorizontal: 24,
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#929292",
  },
  /** Form */
  form: {
    paddingHorizontal: 24,
  },
  formAction: {
    flexDirection: "col",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  formFooter: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  /** Input */
  input: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",

    marginBottom: 3,
  },
  inputControl: {
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  /** Button */
  btn: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderWidth: 1,
    backgroundColor: "#075eec",
    borderColor: "#007aff",
  },
  btnText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
    width: "100%",
  },

  dropdown: {
    height: 40,
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 35,
    fontSize: 14,
  },
});
