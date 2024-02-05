import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigation = useNavigation();

  const handlerLogin = async () => {
    setForm({ email: "", password: "" });
    if (!form.email || !form.password) {
      Alert.alert("Authorization", "User ID and password are required");
      return;
    }

    try {
      const response = await fetch(
        `http://86.48.3.100:1337/api/user-mstrs?filters[$and][0][user_id][$eqi]=${form.email}&filters[$and][1][password][$eqi]=${form.password}`
      );

      if (!response.ok) {
        throw new Error(`Http error! status: ${response.status}`);
      }

      const data = await response.json();

      if (
        data.data[0].attributes.user_id === form.email &&
        data.data[0].attributes.password === form.password
      ) {
        navigation.navigate("DrawerNavigator", {
          mio: data.data[0].id,
          mioName: data.data[0].attributes.user_firstname,
        });
      } else {
        Alert.alert("Authorization", "Invalid Id or Password.");
      }

      // rest of the code
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          alt=""
          resizeMode="contain"
          style={styles.headerImg}
          source={{
            uri: "https://withfra.me/android-chrome-512x512.png",
          }}
        />

        <Text style={styles.title}>
          Sign in to <Text style={{ color: "#075eec" }}>My App</Text>
        </Text>

        <Text style={styles.subtitle}>
          Get access to your portfolio and more
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(email) => setForm({ ...form, email })}
            placeholder="adil@example.com"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.email}
          />
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Password</Text>

          <TextInput
            autoCorrect={false}
            onChangeText={(password) => setForm({ ...form, password })}
            placeholder="********"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            secureTextEntry={true}
            value={form.password}
          />
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handlerLogin}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Sign in</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#e8ecf4",
    justifyContent: "center", // Center vertically
    // alignItems: "center", // Center horizontally
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  /** Header */
  header: {
    marginVertical: height * 0.04,
  },
  headerImg: {
    width: width * 0.2,
    height: width * 0.2,
    alignSelf: "center",
    marginBottom: height * 0.04,
  },
  /** Form */
  form: {
    marginBottom: height * 0.03,
    flex: 1,
  },
  formAction: {
    marginVertical: height * 0.02,
  },
  /** Input */
  input: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: height * 0.01,
  },
  inputControl: {
    height: height * 0.05,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.04,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    backgroundColor: "#075eec",
    borderColor: "#075eec",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
