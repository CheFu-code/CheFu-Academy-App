// --- Imports ---
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    Image,
    Linking,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

// --- Icons ---
import { Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

// --- Firebase ---
import { getAuth } from "@react-native-firebase/auth";

import ConfirmPasswordModal from "@/component/Profile/ConfirmPasswordModal";
import ErrorModal from "@/component/Shared/ErrorModal";
import { menuItems, url } from "@/data/menuItems";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useRefreshProfile } from "@/hooks/useRefreshProfile";
import { showToast } from "@/utils/toast";
import AppModal from "../../component/Shared/AppModal";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Profile.styles";

export default function Profile() {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const auth = getAuth();
    const CACHE_KEY = "@cached_courses";

    const {
        email,
        fullname,
        member,
        memberUntil,
        planType,
        profilePicture,
        provider,
    } = userDetail || {};

    const { loading, handleLogout, handleDeleteAccount, verifyEmail } =
        useProfileActions(userDetail, setUserDetail, router);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const isFreeUser = !member;
    const { refreshing, refreshData } = useRefreshProfile(email, setUserDetail);
    const [modalVisible, setModalVisible] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: "",
        message: "",
    });
    // Memoize menuItems since it depends only on router
    const renderedMenuItems = useMemo(
        () => menuItems(router, Linking, ToastAndroid, Colors),
        [router]
    );

    // Redirect if no user, else refresh profile once on mount
    useEffect(() => {
        if (!email) {
            router.replace("/auth/signIn");
        } else {
            refreshData();
        }
    }, [email, router, refreshData]);

    const confirmDeleteAccount = useCallback(
        () => setShowPasswordModal(true),
        []
    );

    const subscribe = useCallback(() => {
        if (member === true) {
            showToast("You are already a member.");
        } else {
            router.push("/subscription");
        }
    }, [member, router, showToast]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "90%",
                        marginTop: 10,
                    }}
                >
                    {auth.currentUser?.emailVerified ? (
                        <Text
                            style={[
                                styles.profileEmail,
                                { color: Colors.GREEN, marginTop: 10 },
                            ]}
                        >
                            Email Verified
                        </Text>
                    ) : (
                        <TouchableOpacity
                            disabled={loading}
                            onPress={verifyEmail}
                        >
                            <Text
                                style={[
                                    styles.profileEmail,
                                    {
                                        color: Colors.RED,
                                        textDecorationLine: "underline",
                                        marginTop: 10,
                                    },
                                ]}
                            >
                                Email not verified
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => router.push("/settings")}>
                        <Ionicons
                            style={{
                                marginTop: 3,
                                alignItems: "flex-end",
                                padding: 10,
                            }}
                            name="settings-outline"
                            size={20}
                            color={Colors.GRAY}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Image
                        style={[
                            styles.avatar,
                            {
                                borderColor: member
                                    ? Colors.GREEN
                                    : Colors.PRIMARY,
                            },
                        ]}
                        source={
                            ["github.com", "google.com"].includes(provider)
                                ? { uri: profilePicture }
                                : require("../../assets/images/logo.png")
                        }
                    />
                </TouchableOpacity>

                {userDetail && (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <Text numberOfLines={1} style={styles.profileName}>
                                {fullname}
                            </Text>
                            {member && (
                                <Ionicons
                                    color={Colors.GREEN}
                                    size={20}
                                    name="checkmark-circle"
                                />
                            )}
                        </View>

                        <Text numberOfLines={1} style={styles.profileEmail}>
                            {email}
                        </Text>

                        {planType && memberUntil && (
                            <Text style={styles.expiryText}>
                                Your plan will expire on{" "}
                                {new Date(memberUntil).toLocaleDateString()}
                            </Text>
                        )}
                    </>
                )}
            </View>

            {/* Scroll Menu */}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshData}
                    />
                }
            >
                <View style={styles.menuSection}>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "outfit-bold",
                            fontSize: 18,
                        }}
                    >
                        Subscription
                    </Text>
                    
                    <View
                        style={{
                            marginLeft: 5,
                            marginTop: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            borderWidth: 0.2,
                            borderColor: Colors.GRAY,
                            borderRadius: 10,
                            marginBottom: 25,
                        }}
                    >
                        <View
                            style={{
                                padding: 12,
                                backgroundColor: Colors.GRAY,
                                borderRadius: 10,
                                maxWidth: "45%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons
                                name="star-outline"
                                size={20}
                                color={Colors.YELLOW}
                            />
                        </View>
                        <View>
                            <Text
                                style={{
                                    color: "white",
                                    fontFamily: "outfit-bold",
                                    fontSize: 15,
                                }}
                            >
                                {member ? planType : "Free Plan"}
                            </Text>
                            <Text
                                style={{
                                    color: Colors.GRAY,
                                    fontFamily: "outfit",
                                    fontSize: 14,
                                }}
                            >
                                {member ? "Active Member" : "Free"}
                            </Text>
                        </View>
                    </View>


                    <Text
                        style={{
                            color: "white",
                            fontFamily: "outfit-bold",
                            fontSize: 18,
                        }}
                    >
                        Course
                    </Text>

                    {renderedMenuItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuItem}
                            onPress={item.onPress}
                            disabled={loading}
                        >
                            <Ionicons
                                name={
                                    item.icon as keyof typeof Ionicons.glyphMap
                                }
                                size={26}
                                color={Colors.PRIMARY}
                                style={styles.icon}
                            />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    {isFreeUser && (
                        <TouchableOpacity
                            style={[styles.menuItem, { marginTop: 5 }]}
                            onPress={subscribe}
                            disabled={loading}
                        >
                            <SimpleLineIcons
                                name="paypal"
                                size={20}
                                color={Colors.GREEN}
                                style={styles.icon}
                            />
                            <Text
                                style={[
                                    styles.menuLabel,
                                    { color: Colors.GREEN },
                                ]}
                            >
                                Subscribe
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.menuItem, { marginTop: 5 }]}
                        onPress={() =>
                            Linking.openURL(url).catch((err) => {
                                console.error("URL open failed:", err);
                                showToast("Failed to open Google Play");
                            })
                        }
                    >
                        <Entypo
                            name="google-play"
                            size={26}
                            color={Colors.GREEN}
                            style={styles.icon}
                        />
                        <Text
                            style={[styles.menuLabel, { color: Colors.GREEN }]}
                        >
                            Check for App Updates
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={[styles.menuItem, { marginTop: 5 }]}
                        onPress={confirmDeleteAccount}
                        disabled={loading}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={26}
                            color={Colors.RED}
                            style={styles.icon}
                        />
                        <Text style={[styles.menuLabel, { color: Colors.RED }]}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { marginTop: 5, opacity: loading ? 0.5 : 1 },
                        ]}
                        onPress={handleLogout}
                        disabled={loading}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={26}
                            color={Colors.RED}
                            style={styles.icon}
                        />
                        <Text
                            style={[
                                styles.menuLabel,
                                {
                                    color: Colors.RED,
                                    fontFamily: "outfit-bold",
                                },
                            ]}
                        >
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.versionText}>
                    App Version {Constants.expoConfig?.version ?? "N/A"}
                </Text>
            </ScrollView>

            <ConfirmPasswordModal
                visible={showPasswordModal}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onCancel={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                }}
                onConfirm={() => handleDeleteAccount(password)}
            />

            <AppModal
                onCancel={null}
                visible={modalVisible.visible}
                title={modalVisible.title}
                message={modalVisible.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setModalVisible((prev) => ({ ...prev, visible: false }))
                }
            />

            <ErrorModal
                visible={errorModal.visible}
                title={errorModal.title}
                message={errorModal.message}
                onConfirm={() =>
                    setErrorModal((prev) => ({ ...prev, visible: false }))
                }
            />
        </SafeAreaView>
    );
}
