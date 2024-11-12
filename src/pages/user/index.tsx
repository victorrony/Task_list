import React from "react";
import { style } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, Alert, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function User() {
   const navigation = useNavigation<NavigationProp<any>>();

   const handleLogout = () => {
      Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
         {
            text: "Cancel",
            style: "cancel",
         },
         {
            text: "OK",
            onPress: () => {
               Alert.alert("Logout", "Você saiu da conta.");
               navigation.reset({ routes: [{ name: "Login" }] });
            },
         },
      ]);
   };

   return (
      <View style={style.container}>
         <Text style={style.name}>Victor Rony.</Text>
         <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
            <Ionicons name="exit" style={{ color: "gray" }} size={40} />
         </TouchableOpacity>
      </View>
   );
}
