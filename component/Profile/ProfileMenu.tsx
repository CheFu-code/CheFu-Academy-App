// components/Profile/ProfileMenu.tsx
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { menuItems, url } from "@/data/menuItems";
import { useRefreshProfile } from "@/hooks/useRefreshProfile";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { styles } from "@/styles/Profile.styles";
import { showToast } from "@/utils/toast";
import {
    Entypo,
    Ionicons,
    MaterialCommunityIcons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { router, useRouter } from "expo-router";
import { useContext, useMemo } from "react";
import {
    Linking,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

interface ProfileMenuProps {
    menuItems: any[];
    subscribe: () => void;
    isFreeUser: boolean;
    loading: boolean;
    handleLogout: () => void;
    confirmDeleteAccount: () => void;
    refreshing: boolean;
    avatarURL: string | null;
}

export const ProfileMenu = ({
    subscribe,
    isFreeUser,
    loading,
    handleLogout,
    confirmDeleteAccount,
    avatarURL,
}: ProfileMenuProps) => {
    const { safePush } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { email, member, planType } = userDetail || {};
    const { refreshing, refreshData } = useRefreshProfile(email, setUserDetail);
    const isAdmin = userDetail?.roles?.includes("admin");
    const renderedMenuItems = useMemo(
        () => menuItems(router, Linking, ToastAndroid, Colors),
        [router]
    );
    return (
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

                <TouchableOpacity
                    onPress={subscribe}
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
                </TouchableOpacity>

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
                            name={item.icon as keyof typeof Ionicons.glyphMap}
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
                            style={[styles.menuLabel, { color: Colors.GREEN }]}
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
                    <Text style={[styles.menuLabel, { color: Colors.GREEN }]}>
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
                        {
                            marginTop: 5,
                            opacity: loading ? 0.5 : 1,
                        },
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
                Version {Constants.expoConfig?.version ?? "N/A"}
            </Text>
        </ScrollView>
    );
};
