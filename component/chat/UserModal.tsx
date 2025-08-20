import { Colors } from "@/constant/Colors";
import { showToast } from "@/utils/toast";
import React from "react";
import {
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function UserModal({
    showModal,
    setShowModal,
    otherUser,
    lastSeen,
}: any) {
    return (
        <Modal
            presentationStyle="pageSheet"
            animationType="slide"
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Image
                        source={
                            otherUser?.profilePicture
                                ? { uri: otherUser?.profilePicture }
                                : require("../../assets/images/logo.png")
                        }
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginBottom: 15,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: "outfit-bold",
                            color: Colors.WHITE,
                        }}
                    >
                        {otherUser?.fullname || "Unknown"}
                    </Text>
                    <Text style={{ color: Colors.GRAY, marginBottom: 20 }}>
                        {otherUser
                            ? otherUser.online
                                ? "online"
                                : `last seen ${lastSeen || "unknown"}`
                            : "Loading..."}
                    </Text>

                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => {
                            showToast("User blocked");
                            setShowModal(false);
                        }}
                    >
                        <Text style={styles.optionText}>Block User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => {
                            showToast("Reported user");
                            setShowModal(false);
                        }}
                    >
                        <Text style={styles.optionText}>Report User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            { backgroundColor: Colors.GRAY },
                        ]}
                        onPress={() => setShowModal(false)}
                    >
                        <Text style={styles.optionText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    optionButton: {
        width: "100%",
        padding: 15,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY,
        marginBottom: 12,
        alignItems: "center",
    },
    optionText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
});
