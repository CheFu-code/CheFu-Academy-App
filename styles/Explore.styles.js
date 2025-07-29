import { Platform, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
  },
  headerWrapper: {
    padding: 10,
    marginTop: 30,
    backgroundColor: Colors.BG_COLOR,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 26,
    color: Colors.PRIMARY,
  },
  scrollContent: {
    padding: 20,
    backgroundColor: Colors.BG_COLOR,
  },
  categoryWrapper: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    marginBottom: 16,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GREEN,
  },
});
