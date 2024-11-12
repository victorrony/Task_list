import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   container: {
      width: "100%",
   },
   header: {
      width: "100%",
      height: 40,
      paddingHorizontal: 40,
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "space-between",
      alignItems: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   content: {
      width: "100%",
      paddingHorizontal: 20,
   },
   label: {
      fontWeight: "bold",
      color: "#000",
   },
   containerFlag: {
      width: "100%",
      padding: 10,
      marginTop: 40,
   },
   flag: {
      fontSize: 14,
      fontWeight: "bold",
   },
});