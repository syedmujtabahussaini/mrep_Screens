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
import Logout from "../components/Logout";
import VisitPlan from "../Screens/VisitPlan";
import VisitPlan_Detail from "../Screens/VisitPlan_Details";

export default function HomeScreen({ route }) {
  return (
    <Tab.Navigator
      shifting={true}
      activeColor="#075eec"
      barStyle={{ backgroundColor: "#fff", height: 65 }}
    >
      <Tab.Screen
        name="Dashboard "
        component={Home}
        initialParams={route.params}
        options={{
          tabBarIcon: () => <IconContainer name="home" />,
        }}
      />
      <Tab.Screen
        name="DayPlan "
        component={VisitPlan}
        initialParams={route.params}
        options={{
          tabBarIcon: () => <IconContainer name="today-sharp" />,
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
        name="Logout"
        component={Logout}
        options={{
          tabBarIcon: () => <IconContainer name="log-out-sharp" />,
        }}
      />
    </Tab.Navigator>
  );
}

const IconContainer = (props) => {
  return <IonicIcons name={props.name} size={22} color={"#075eec"} />;
};
