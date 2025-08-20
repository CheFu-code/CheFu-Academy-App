// components/SectionHeader.tsx
import { Colors } from "@/constant/Colors";
import React from "react";
import { Text } from "react-native";

export const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text
        style={{
            fontSize: 16,
            fontFamily: "outfit-bold",
            color: Colors.WHITE,
            marginBottom: 10,
        }}
    >
        {title}
    </Text>
);
