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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function VisitPlan({ route }) {
  const [isFocus, setIsFocus] = useState(false);
  const [visitPlanSelf, setVisitPlanSelf] = useState(false);
  const [visitPlanRm, setVisitPlanRm] = useState(false);
  const [visitPlanSm, setVisitPlanSm] = useState(false);
  const [visitPlanNsm, setVisitPlanNsm] = useState(false);
  const [visitPlanCeo, setVisitPlanCeo] = useState(false);

  const [user, setUser] = useState(null); // user name
  const [userData, setUserdata] = useState([]);
  const [site, setSite] = useState({ site_id: "" });
  const [siteData, setSitedata] = useState([]);
  const [doctor, setdoctor] = useState(null);
  const [doctorData, setDoctordata] = useState([]);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setshowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setshowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const navigation = useNavigation();
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
          Alert.alert("Selected time must be greater than Visit Start time!.");
          return prevDate;
        }
      }
      // If selectedDate is falsy, return the current date unchanged
      return prevDate;
    });
  };

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
          "http://86.48.3.100:1337/api/userarea-accesses?populate[user_mstr]=*&populate[area_mstrs][populate][site_mstrs][populate]=*&filters[user_mstr][id][$eq]=" +
            route.params.mio
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
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://86.48.3.100:1337/api/doctor-accesses?populate=*&filters[site_mstrs][id][$eq]=" +
            site.site_id
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDoctordata(
          data.data.map((cv) => {
            return {
              doctor_id: cv.attributes.doctor_mstr.data.id,
              doctor_firstname:
                cv.attributes.doctor_mstr.data.attributes.doctor_firstname,
            };
          })
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [site]);

  const toggleSwitchSelf = () =>
    setVisitPlanSelf((previousState) => !previousState);

  const toggleSwitchRm = () =>
    setVisitPlanRm((previousState) => !previousState);

  const toggleSwitchSm = () =>
    setVisitPlanSm((previousState) => !previousState);

  const toggleSwitchNSm = () =>
    setVisitPlanNsm((previousState) => !previousState);

  const toggleSwitchCeo = () =>
    setVisitPlanCeo((previousState) => !previousState);

  const saveData = async () => {
    const response = await fetch("http://86.48.3.100:1337/api/visit-plans", {
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
          visitplan_approved: null,
          visitplan_approvedby: null,
          visitplan_approveddate: null,
          visitplan_actualuserid: null,
          visitplan_actualstart: null,
          visitplan_actualend: null,
          visitplan_actualdocavailable: null,
          visitplan_actuallatitude: site.site_latitude,
          visitplan_actuallongitude: site.site_longitude,
          visitplan_actualself: null,
          visitplan_actualrm: null,
          visitplan_actualsm: null,
          visitplan_actualnsm: null,
          visitplan_actualceo: null,
          visitplan_actualstatus: null,
          user_mstr: user,
          site_mstr: site.site_id,
          doctor_mstr: doctor,
          docreason_mstr: null,
        },
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    ToastAndroid.show("Saved Record ", ToastAndroid.SHORT);
    console.log(JSON.stringify(data));
  };
  console.log("detail to master", route.params);
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
              {/*  <View>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={userData}
                  search
                  maxHeight={300}
                  labelField="user_firstname"
                  valueField="id"
                  placeholder={!isFocus ? "Select User....." : "..."}
                  searchPlaceholder="Search..."
                  // value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setUser(item.id);
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
              <Text style={styles.inputLabel}>Sites Name</Text>
              <View>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={siteData}
                  search
                  maxHeight={300}
                  labelField="site_name"
                  valueField="site_id"
                  placeholder={!isFocus ? "Select Site....." : "..."}
                  searchPlaceholder="Search..."
                  value={route.params.site_id}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSite({
                      site_id: item.site_id,
                      site_longitude: item.site_longitude,
                      site_latitude: item.site_latitude,
                    });
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
              <Text style={styles.inputLabel}>Doctor Name</Text>
              <View>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={doctorData}
                  search
                  maxHeight={300}
                  labelField="doctor_firstname"
                  valueField="doctor_id"
                  placeholder={!isFocus ? "Select Doctor....." : "..."}
                  searchPlaceholder="Search..."
                  // value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setdoctor(item.doctor_id);
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
              <Text style={styles.inputLabel}>Visit Start Date & Time</Text>

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
                  setshowStartDate(true);
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
              <Text style={styles.inputLabel}>Visit End Date & Time</Text>

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
                  setshowEndDate(true);
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
              <Text style={styles.inputLabel}> Visit Plan Self</Text>
              <Switch
                onValueChange={toggleSwitchSelf}
                value={visitPlanSelf}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitPlanSelf ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Visit plan with RM</Text>
              <Switch
                onValueChange={toggleSwitchRm}
                value={visitPlanRm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitPlanRm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Visit plan with SM</Text>
              <Switch
                onValueChange={toggleSwitchSm}
                value={visitPlanSm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitPlanSm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Visit plan with NSM</Text>
              <Switch
                onValueChange={toggleSwitchNSm}
                value={visitPlanNsm}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitPlanNsm ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>
            <View style={styles.inputSwitch}>
              <Text style={styles.inputLabel}> Visit plan with CEO</Text>
              <Switch
                onValueChange={toggleSwitchCeo}
                value={visitPlanCeo}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                trackColor={{ false: "#767577", true: "#075eec" }}
                thumbColor={visitPlanCeo ? "#f0f1f7" : "#f4f3f4"}
              />
            </View>

            {/* <View style={styles.formAction}> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("VisitPlanDetail")}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Details</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveData}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Submit Visit Plan</Text>
              </View>
            </TouchableOpacity>

            {/* </View> */}
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
    fontSize: 15,
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
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  inputSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "black",
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
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },

  dropdown: {
    height: 40,
    backgroundColor: "#fff",
    borderColor: "007aff",
    borderWidth: 1,
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
