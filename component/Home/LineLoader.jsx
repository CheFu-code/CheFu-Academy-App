import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export default function LineLoader() {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(widthAnim, {
        toValue: 100,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  return (
    <View
      style={{
        height: 3,
        backgroundColor: "#e0e0e0",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Animated.View
        style={{
          height: 3,
          backgroundColor: "#4CAF50",
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}
