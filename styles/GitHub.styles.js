import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BG_COLOR,
  },
  message: {
    marginTop: 20,
    fontSize: 20,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "outfit",
  },
});
