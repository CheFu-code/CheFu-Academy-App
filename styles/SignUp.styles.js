import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    borderWidth: 1,
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
    color: Colors.WHITE,
    borderColor: Colors.PRIMARY,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GREEN,
    marginTop: 15,
  },
  modalSubtext: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
  },

  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  showPassword: {
    fontSize: 14,
    paddingTop: 6,
    backgroundColor: Colors.BG_GRAY,
    padding: 8,
    borderRadius: 10,
    fontFamily: "outfit",
    textAlign: "center",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    textAlign: "center",
    color: Colors.WHITE,
  },
});
