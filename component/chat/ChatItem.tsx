// components/chat/ChatItem.tsx
import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ChatItemProps {
    imageSource: any;
    name: string;
    subtitle: string;
    onPress: () => void;
    onLongPress?: () => void;
    showCheck?: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({
    imageSource,
    name,
    subtitle,
    onPress,
    onLongPress,
    showCheck,
}) => (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginTop: 5,
            }}
        >
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: Colors.WHITE,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    source={imageSource}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: "white",
                            fontFamily: "outfit-bold",
                            fontSize: 15,
                        }}
                    >
                        {name}
                    </Text>
                    {showCheck && (
                        <AntDesign
                            name="checkcircleo"
                            size={13}
                            color={Colors.PRIMARY}
                            style={{ marginLeft: 5 }}
                        />
                    )}
                </View>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        color: Colors.GRAY,
                        fontFamily: "outfit",
                        fontSize: 14,
                    }}
                >
                    {subtitle}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);
