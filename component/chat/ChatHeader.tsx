import { Colors } from "@/constant/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ChatHeader({ otherUser, lastSeen, setShowModal }: any) {
    const router = useRouter();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: Colors.BLACK,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 30,
                    padding: 10,
                    flex: 1,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginRight: 12 }}
                >
                    <AntDesign name="left" size={24} color={Colors.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Image
                        source={
                            otherUser?.profilePicture
                                ? { uri: otherUser?.profilePicture }
                                : require("../../assets/images/logo.png")
                        }
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 18,
                            marginRight: 8,
                            borderWidth: 0.6,
                            borderColor: Colors.GRAY,
                        }}
                    />
                </TouchableOpacity>
                <View style={{ maxWidth: "60%" }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: Colors.WHITE,
                            fontFamily: "outfit-bold",
                            fontSize: 18,
                        }}
                    >
                        {otherUser?.fullname || "Chat"}
                    </Text>
                    <Text style={{ color: Colors.GRAY, fontSize: 12 }}>
                        {otherUser
                            ? otherUser.online
                                ? "online"
                                : `last seen ${lastSeen || "unknown"}`
                            : "Loading..."}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => setShowModal(true)}>
                <MaterialIcons
                    name="account-circle"
                    size={30}
                    color={Colors.WHITE}
                    style={{ marginRight: 10, marginTop: 30 }}
                />
            </TouchableOpacity>
        </View>
    );
}
