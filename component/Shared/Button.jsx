import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";

export default function Button({
  text,
  type = "fill",
  onPress,
  loading,
  disabled,
  icon, 
}) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: type === "fill" ? Colors.PRIMARY : Colors.BG_COLOR,
        padding: 10,
        width: "100%",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        borderWidth: type === "outline" ? 1 : 0,
        borderColor: type === "outline" ? Colors.BG_COLOR : "transparent",
        opacity: isDisabled ? 0.4 : 1,
        flexDirection: "row", 
        gap: 8, // ✅ Add spacing between icon and text (supported in RN 0.71+)
      }}
    >
      {!loading ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: type === "fill" ? "#fff" : Colors.PRIMARY,
            }}
          >
            {text}
          </Text>
        </View>
      ) : (
        <ActivityIndicator
          size={"large"}
          color={type === "fill" ? "#fff" : Colors.PRIMARY}
        />
      )}
    </TouchableOpacity>
  );
}
