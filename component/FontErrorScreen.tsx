import React from "react";
import { Text, View } from "react-native";

const FontErrorScreen = () => (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1B263B",
            paddingHorizontal: 24,
        }}
    >
        <Text
            style={{
                color: "#E57373",
                fontSize: 16,
                fontFamily: "System",
                textAlign: "center",
            }}
        >
            Failed to load fonts. Please restart the app.
        </Text>
    </View>
);

export default FontErrorScreen;