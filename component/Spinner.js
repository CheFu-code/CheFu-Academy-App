// components/Spinner.js
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

const Spinner = ({ size = 24, color = "teal", borderWidth = 2 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: borderWidth,
          borderColor: color,
          borderTopColor: "transparent",
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Spinner;
