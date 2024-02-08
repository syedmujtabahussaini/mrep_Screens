import { useNavigation } from "@react-navigation/native";

export default function Logout() {
  const navigation = useNavigation();
  return navigation.navigate("Login");
}
