import { Colors } from "@/constant/Colors";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        color: Colors.RED,
        fontSize: 24,
        fontFamily: "outfit-bold",
        marginBottom: 8,
    },
    subtitle: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontFamily: "outfit",
    },
    lottie: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
});
