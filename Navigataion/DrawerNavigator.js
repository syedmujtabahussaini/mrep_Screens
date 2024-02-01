import React from "react";
import { Text, View } from "react-native";

import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

//
import BottomNavigator from "./BottomNavigator";

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ drawerStyle: { backgroundColor: "#bfc3c7" } }}
    >
      <Drawer.Screen name="Dashboard" component={BottomNavigator} />
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
