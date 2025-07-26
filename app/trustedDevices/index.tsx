import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    doc,
    getDoc,
    getFirestore,
    updateDoc,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

type TrustedDevice = {
    brand?: string;
    deviceType?: number;
    modelName?: string;
    osName?: string;
    osVersion?: string;
};

export default function TrustedDevices() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const db = getFirestore();

    const [loadingDevice, setLoadingDevice] = useState<string | null>(null);

    const [refreshing, setRefreshing] = useState(false);

    const fetchUserDetail = useCallback(async () => {
        if (!userDetail?.email) return;

        try {
            const snapshot = await getDoc(doc(db, "users", userDetail.email)); // 👈 wrap with doc()
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUserDetail({ ...userDetail, ...data });
            }
        } catch (err) {
            console.error("Failed to fetch user detail:", err);
            ToastAndroid.show("Failed to refresh data", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }, [userDetail?.email]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserDetail();
        setRefreshing(false);
    };

    const deleteFromTrustedDevices = (device: TrustedDevice) => {
        Alert.alert(
            "Confirm Removal",
            "Are you sure you want to remove this device from your trusted devices?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (!userDetail?.email || !userDetail?.trustedDevices) {
                                ToastAndroid.show("Your data not found", ToastAndroid.SHORT);
                                return;
                            }
                            setLoadingDevice(device.modelName || "unknown");
                            const filteredDevices = userDetail.trustedDevices.filter(
                                (d: TrustedDevice) =>
                                    !(
                                        d.brand === device.brand &&
                                        d.modelName === device.modelName &&
                                        d.osName === device.osName &&
                                        d.osVersion === device.osVersion &&
                                        d.deviceType === device.deviceType
                                    )
                            );
                            await updateDoc(doc(db, "users", userDetail.email), {
                                trustedDevices: filteredDevices,
                            });
                            setUserDetail({ ...userDetail, trustedDevices: filteredDevices });
                            Alert.alert("Success", "Device removed from trusted list");
                        } catch (error) {
                            console.error("Error removing trusted device:", error);
                            Alert.alert("Error", "Failed to remove device");
                        } finally {
                            setLoadingDevice(null);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 50,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                    gap: 10,
                }}
            >
                <AntDesign name="left" size={24} color={Colors.PRIMARY} />
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 20,
                        color: Colors.PRIMARY,
                    }}
                >
                    Trusted Devices
                </Text>
            </TouchableOpacity>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.PRIMARY}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
            >
                {/* Info Section */}
                <View>
                    {(userDetail?.trustedDevices || []).length > 0 && (
                        <Text
                            style={{
                                fontFamily: "outfit-medium",
                                fontSize: 16,
                                color: Colors.WHITE,
                                marginBottom: 5,
                            }}
                        >
                            These are your trusted devices:
                        </Text>
                    )}
                </View>

                {/* Trusted Devices List */}
                {(userDetail?.trustedDevices || []).length > 0 ? (
                    userDetail.trustedDevices.map(
                        (device: TrustedDevice, index: number) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: Colors.LIGHT_GREEN,
                                    borderRadius: 12,
                                    padding: 15,
                                }}
                            >
                                <Ionicons
                                    name="shield-checkmark"
                                    size={24}
                                    color="green"
                                    style={{ marginRight: 10 }}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 10,
                                        maxWidth: 290,
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: Colors.BLACK,
                                                fontFamily: "outfit-bold",
                                            }}
                                        >
                                            {device.modelName || "Unknown Device"}
                                        </Text>
                                        <Text
                                            numberOfLines={3}
                                            style={{
                                                fontFamily: "outfit",
                                                fontSize: 12,
                                                color: Colors.GRAY,
                                                maxWidth: 210,
                                            }}
                                        >
                                            OS: {device.osName || "Unknown OS"}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: "outfit",
                                                fontSize: 12,
                                                color: Colors.GRAY,
                                                maxWidth: 210,
                                            }}
                                        >
                                            Version: {device.osVersion || "N/A"}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: "outfit-bold",
                                                fontSize: 12,
                                                color: Colors.BLACK,
                                            }}
                                        >
                                            Brand: {device.brand || "Unknown Brand"}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        disabled={loadingDevice === device.modelName}
                                        onPress={() => deleteFromTrustedDevices(device)}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 8,
                                            borderRadius: 12,
                                            backgroundColor: Colors.LIGHT_RED,
                                            opacity: loadingDevice === device.modelName ? 0.6 : 1,
                                        }}
                                    >
                                        {loadingDevice === device.modelName ? (
                                            <ActivityIndicator color={Colors.WHITE} size="small" />
                                        ) : (
                                            <Text
                                                style={{
                                                    fontFamily: "outfit-bold",
                                                    fontSize: 12,
                                                    color: Colors.RED,
                                                }}
                                            >
                                                Remove
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    )
                ) : (
                    <>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                fontSize: 14,
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                fontFamily: "outfit-bold",
                            }}
                        >
                            No trusted devices added yet.
                        </Text>
                        <Text
                            style={{
                                fontFamily: "outfit",
                                fontSize: 14,
                                color: Colors.GRAY,
                                lineHeight: 20,
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            Trusted devices will be added automatically as you continue using the app. You can revisit this page after multiple logins to see them.
                        </Text>
                    </>
                )}

                {/* Description */}
                {(userDetail?.trustedDevices || []).length > 0 && (
                    <View>
                        <Text
                            style={{
                                fontFamily: "outfit",
                                fontSize: 14,
                                color: Colors.GRAY,
                                lineHeight: 20,
                            }}
                        >
                            Any logins not done on trusted devices listed above will be
                            flagged, and a security alert will be sent to your email for
                            verification—but only if you have toggled on the option to send
                            email alerts under the Email Alerts setting. By default, this
                            option is turned on. You can toggle it off if you don’t want to
                            receive email alerts.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
