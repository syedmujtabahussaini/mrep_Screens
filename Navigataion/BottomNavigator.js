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

export default function HomeScreen() {
  return (
    <Tab.Navigator
      shifting={true}
      activeColor="#00aea2"
      barStyle={{ backgroundColor: "#95a5a6" }}
    >
      <Tab.Screen
        name="Dashboard1"
        component={Home}
        options={{
          tabBarIcon: () => <IconContainer name="home" />,
          tabBarColor: "#3449eb",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => <IconContainer name="person" />,
          tabBarColor: "purple",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: () => <IconContainer name="settings" />,
          tabBarColor: "red",
        }}
      />
    </Tab.Navigator>
  );
}

const IconContainer = (props) => {
  return <IonicIcons name={props.name} size={30} color={"#3449eb"} />;
};
