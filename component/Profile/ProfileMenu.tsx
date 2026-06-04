// components/Profile/ProfileMenu.tsx
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { menuItems, url } from '@/data/menuItems';
import useDarkMode from '@/hooks/useDarkMode';
import { useRefreshProfile } from '@/hooks/useRefreshProfile';
import { chefuAccountManageUrl } from '@/services/ssoAuth';
import { styles } from '@/styles/Profile.styles';
import { showToast } from '@/utils/toast';
import { Entypo, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
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
    subscribe: () => void;
    isFreeUser: boolean;
    loading: boolean;
    handleLogout: () => void;
}

export const ProfileMenu = ({
    subscribe,
    isFreeUser,
    loading,
    handleLogout,
}: ProfileMenuProps) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { email, member, planType } = userDetail || {};
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
                    Subscription
                </Text>

                <TouchableOpacity
                    onPress={subscribe}
                    style={{
                        marginLeft: scale(5),
                        marginTop: verticalScale(5),
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(10),
                        borderWidth: 0.6,
                        borderColor: Colors.GRAY,
                        borderRadius: scale(10),
                        marginBottom: verticalScale(25),
                        backgroundColor: Colors.BG_GRAY,
                    }}
                >
                    <View
                        style={{
                            padding: scale(12),
                            backgroundColor: Colors.GRAY,
                            borderRadius: scale(10),
                            maxWidth: '45%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.8,
                        }}
                    >
                        <Ionicons
                            name="star-outline"
                            size={scale(18)}
                            color={Colors.YELLOW}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: 'outfit-bold',
                                fontSize: RFValue(13),
                            }}
                        >
                            {planType ? planType : 'Free Plan'}
                        </Text>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: 'outfit',
                                fontSize: RFValue(12),
                            }}
                        >
                            {member ? 'Active Member' : 'Free'}
                        </Text>
                    </View>
                </TouchableOpacity>

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

                {isFreeUser && (
                    <TouchableOpacity
                        style={[
                            styles.menuItem,
                            { marginTop: verticalScale(5) },
                        ]}
                        onPress={subscribe}
                        disabled={loading}
                    >
                        <SimpleLineIcons
                            name="paypal"
                            size={scale(19)}
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
