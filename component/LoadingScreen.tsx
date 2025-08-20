import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../constant/Colors";

const LoadingScreen = () => (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.BG_COLOR,
            paddingHorizontal: 18,
        }}
    >
        <LottieView
            source={require("../assets/animations/Face scanning.json")}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
        />
        <Text
            style={{
                marginTop: 20,
                fontSize: 16,
                color: Colors.GREEN,
                fontFamily: "outfit-bold",
                textAlign: "center",
            }}
        >
            Please wait while we unlock CheFu Academy for you...
        </Text>
        <Text
            style={{
                marginTop: 8,
                fontSize: 14,
                color: Colors.WHITE,
                fontFamily: "outfit-bold",
                textAlign: "center",
            }}
        >
            We help you learn with confidence and privacy.
        </Text>
    </View>
);

export default LoadingScreen;