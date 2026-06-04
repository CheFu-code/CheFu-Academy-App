// components/Profile/ProfileMenu.tsx
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { menuItems, url } from '@/data/menuItems';
import useDarkMode from '@/hooks/useDarkMode';
import { useRefreshProfile } from '@/hooks/useRefreshProfile';
import { chefuAccountManageUrl } from '@/services/ssoAuth';
import { styles } from '@/styles/Profile.styles';
import { showToast } from '@/utils/toast';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useContext, useMemo } from 'react';
import {
    Linking,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

interface ProfileMenuProps {
    loading: boolean;
    handleLogout: () => void;
}

export const ProfileMenu = ({
    loading,
    handleLogout,
}: ProfileMenuProps) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { email } = userDetail || {};
    const { color } = useDarkMode();
    const { refreshing, refreshData } = useRefreshProfile(email, setUserDetail);
    const renderedMenuItems = useMemo(
        () => menuItems(router, Linking, ToastAndroid, Colors),
        [],
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
                        color,
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(17),
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
                            size={scale(24)}
                            color={Colors.PRIMARY}
                            style={styles.icon}
                        />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                <TouchableOpacity
                    style={[styles.menuItem, { marginTop: verticalScale(5) }]}
                    onPress={() =>
                        Linking.openURL(url).catch((err) => {
                            console.error('URL open failed:', err);
                            showToast('Failed to open Google Play');
                        })
                    }
                >
                    <Entypo
                        name="google-play"
                        size={scale(24)}
                        color={Colors.GREEN}
                        style={styles.icon}
                    />
                    <Text style={[styles.menuLabel, { color: Colors.GREEN }]}>
                        Check for App Updates
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={[styles.menuItem, { marginTop: verticalScale(5) }]}
                    onPress={() => Linking.openURL(chefuAccountManageUrl())}
                    disabled={loading}
                >
                    <Ionicons
                        name="person-circle-outline"
                        size={scale(24)}
                        color={Colors.PRIMARY}
                        style={styles.icon}
                    />
                    <Text style={styles.menuLabel}>
                        Manage CheFu Account
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.menuItem,
                        {
                            marginTop: verticalScale(5),
                            opacity: loading ? 0.5 : 1,
                        },
                    ]}
                    onPress={handleLogout}
                    disabled={loading}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={scale(25)}
                        color={Colors.RED}
                        style={styles.icon}
                    />
                    <Text
                        style={[
                            styles.menuLabel,
                            {
                                color: Colors.RED,
                                fontFamily: 'outfit-bold',
                            },
                        ]}
                    >
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>
                Version {Constants.expoConfig?.version ?? 'N/A'}
            </Text>
        </ScrollView>
    );
};
