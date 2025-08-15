import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/OfflineScreen.style";

export default function OfflineScreen() {
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../assets/animations/no internet.json")}
                autoPlay
                loop
                style={styles.lottie}
            />
            <Text style={styles.title}>You're Offline</Text>
            <Text style={styles.subtitle}>Check your internet connection</Text>
        </View>
    );
}