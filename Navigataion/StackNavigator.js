import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens import
import DrawerNavigator from "../Navigataion/DrawerNavigator";
import SplashScreen from "../Screens/SplashScreen";
import LoginScreen from "../Screens/Login";
import SignupScreen from "../Screens/Signup";
import VisitPlan from "../Screens/VisitPlan";
import VisitPlan_Detail from "../Screens/VisitPlan_Details";
import VisitPlan_Edit from "../Screens/VisitPlan_Edit";
import Meeting from "../Screens/Meeting";
import Doctors from "../Screens/Doctors";

import { BottomNavigation } from "react-native-paper";
import Map from "../Screens/Map";
import Hospitals from "../Screens/Hospitals";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 4000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*  */}
        {showSplashScreen ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : null}

        {/*  */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Signup" component={SignupScreen} />
        {/*  */}
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VisitPlan"
          component={VisitPlan}
          options={{ headerShown: true, title: "Creating Day Plan" }}
        />

        <Stack.Screen
          name="VisitPlanDetail"
          component={VisitPlan_Detail}
          options={{ headerShown: true, title: "Day Plan Details" }}
        />

        <Stack.Screen
          name="VisitPlanEdit"
          component={VisitPlan_Edit}
          options={{ headerShown: true, title: "Visit Plan Details" }}
        />

        <Stack.Screen
          name="Meeting"
          component={Meeting}
          options={{ headerShown: true, title: "Meeting Details" }}
        />

        <Stack.Screen
          name="Map"
          component={Map}
          options={{ headerShown: true, title: "Direction from Map" }}
        />
        <Stack.Screen
          name="Doctors"
          component={Doctors}
          options={{
            headerShown: true,
            title: "Available Doctors In Your Area.",
          }}
        />

        <Stack.Screen
          name="Hospitals"
          component={Hospitals}
          options={{
            headerShown: true,
            title: "Available Hospitals In Your Area.",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
