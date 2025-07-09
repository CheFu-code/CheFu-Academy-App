import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  // console.log("User Details:", userDetail);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: Colors.BG_COLOR,
        // flex: 1,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 24,
            color: "#fff",
            marginTop: 10,
          }}
        >
          Hello, {userDetail?.fullname}
        </Text>
        <Text
          style={{
            fontFamily: "outfit-regular",
            fontSize: 16,
            color: "#666",
            marginTop: 5,
          }}
        >
          Start Learning
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={32} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}
