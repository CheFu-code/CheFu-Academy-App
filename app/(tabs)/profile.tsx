// --- Imports ---
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";

// --- Icons ---
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

// --- Firebase ---
import { getAuth } from "@react-native-firebase/auth";

import ConfirmPasswordModal from "@/component/Profile/ConfirmPasswordModal";
import ErrorModal from "@/component/Shared/ErrorModal";
import { menuItems, url } from "@/data/menuItems";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useRefreshProfile } from "@/hooks/useRefreshProfile";
import { capitalize } from "@/utils/string";
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
            {/* Header Section */}
            <View style={styles.header}>
                {auth.currentUser?.emailVerified && (
                    <Text
                        style={[styles.profileEmail, { color: Colors.GREEN }]}
                    >
                        Email Verified
                    </Text>
                )}
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

                {/* User Info */}
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

                        {!auth.currentUser?.emailVerified && (
                            <TouchableOpacity onPress={verifyEmail}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.profileEmail,
                                        {
                                            color: Colors.LIGHT_RED,
                                            textDecorationLine: "underline",
                                        },
                                    ]}
                                >
                                    email not verified
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Plan Button */}
                        <TouchableOpacity
                            onPress={subscribe}
                            disabled={loading}
                            style={styles.planStatus}
                            accessibilityLabel="Subscribe to a plan"
                            accessibilityHint="Opens subscription page"
                        >
                            {loading ? (
                                <ActivityIndicator
                                    color={Colors.GREEN}
                                    size="small"
                                />
                            ) : (
                                <Text
                                    style={{
                                        color: isFreeUser
                                            ? Colors.RED
                                            : Colors.GREEN,
                                        textDecorationLine: isFreeUser
                                            ? "underline"
                                            : "none",
                                        fontFamily: "outfit-bold",
                                    }}
                                >
                                    {planType
                                        ? `${capitalize(planType)} Plan`
                                        : "Free Plan"}
                                </Text>
                            )}
                        </TouchableOpacity>

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
