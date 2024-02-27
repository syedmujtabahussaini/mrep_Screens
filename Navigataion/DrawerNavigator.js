import React from "react";
import { Text, View } from "react-native";

import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

//
import BottomNavigator from "./BottomNavigator";
import VisitPlan from "../Screens/VisitPlan";
import VisitPlan_Detail from "../Screens/VisitPlan_Details";

function MyDrawer({ route }) {
  return (
    <Drawer.Navigator
      screenOptions={{ drawerStyle: { backgroundColor: "#bfc3c7" } }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={BottomNavigator}
        initialParams={route.params}
      />
      <Drawer.Screen
        name="Visit Plan"
        component={VisitPlan}
        // initialParams={route.params}
      />

      {/* <Drawer.Screen
        name="Visit Plan Detail"
        component={VisitPlan_Detail}
        initialParams={route.params}
      /> */}

      {/* <Drawer.Screen
        name="More"
        component={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>This Is More Page</Text>
            </View>
          );
        }}
      /> */}
      {/* <Drawer.Screen name="Article" component={Article} /> */}
    </Drawer.Navigator>
  );
}
export default MyDrawer;
