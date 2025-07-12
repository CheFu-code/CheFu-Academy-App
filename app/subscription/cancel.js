import { Text, View } from "react-native";
import { Colors } from "../../constant/Colors";

export default function CancelScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
      }}
    >
      <Text>Subscription Canceled</Text>
    </View>
  );
}
