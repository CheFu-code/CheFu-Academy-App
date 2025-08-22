import { Colors } from "@/constant/Colors";
import React from "react";
import { Text, View } from "react-native";

export default function LoggedOutMessage() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: Colors.WHITE, fontFamily: "outfit" }}>
                You are logged out
            </Text>
        </View>
    );
}
