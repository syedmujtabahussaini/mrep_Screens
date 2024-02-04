import React from "react";
import { View, Text } from "react-native";
import IonicIcons from "react-native-vector-icons/Ionicons";
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

// const Tab = createMaterialTopTabNavigator();
const Tab = createMaterialBottomTabNavigator();

// import screens
import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import Settings from "../Screens/Settings";

export default function HomeScreen({ route }) {
  // console.log("BottomNavigator", route.params);
  return (
    <Tab.Navigator
      shifting={true}
      // activeColor="#00aea2"
      // barStyle={{ backgroundColor: "#95a5a6" }}
    >
      <Tab.Screen
        name="Dashboard1"
        component={Home}
        initialParams={route.params}
        options={{
          tabBarIcon: () => <IconContainer name="home" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => <IconContainer name="person" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: () => <IconContainer name="settings" />,
        }}
      />
    </Tab.Navigator>
  );
}

const IconContainer = (props) => {
  return <IonicIcons name={props.name} size={25} color={"#07a9e3"} />;
};
