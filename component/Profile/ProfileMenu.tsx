import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { menuItems } from '@/data/menuItems';
import useDarkMode from '@/hooks/useDarkMode';
import { useRefreshProfile } from '@/hooks/useRefreshProfile';
import { chefuAccountManageUrl } from '@/services/ssoAuth';
import { Ionicons } from '@expo/vector-icons';
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

interface ProfileMenuProps {
    loading: boolean;
    handleLogout: () => void;
}

export const ProfileMenu = ({ loading, handleLogout }: ProfileMenuProps) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { email } = userDetail || {};
    const { color, backgroundColor } = useDarkMode();
    const { refreshing, refreshData } = useRefreshProfile(email, setUserDetail);
    
    const renderedMenuItems = useMemo(
        () => menuItems(router, Linking, ToastAndroid, Colors),
        [],
    );

    return (
        <ScrollView
            className="flex-1 px-4 mt-2"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshData}
                    colors={[Colors.PRIMARY]}
                    tintColor={Colors.PRIMARY}
                />
            }
        >
            <View className="bg-gray-800/40 rounded-3xl p-4 shadow-sm border border-gray-800">
                {renderedMenuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`flex-row items-center py-4 ${
                            index !== renderedMenuItems.length - 1 ? 'border-b border-gray-800/50' : ''
                        }`}
                        onPress={item.action}
                    >
                        <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center mr-4">
                            <Ionicons
                                name={item.icon as any}
                                size={20}
                                color={Colors.PRIMARY}
                            />
                        </View>
                        <Text className="flex-1 font-outfit text-base" style={{ color }}>
                            {item.label}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.GRAY} />
                    </TouchableOpacity>
                ))}
            </View>

            <View className="bg-gray-800/40 rounded-3xl p-4 mt-6 mb-8 shadow-sm border border-gray-800">
                <TouchableOpacity
                    className="flex-row items-center py-4 border-b border-gray-800/50"
                    onPress={() => Linking.openURL('market://details?id=com.chefu.academy')}
                >
                    <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center mr-4">
                        <Ionicons name="cloud-download-outline" size={20} color={Colors.GREEN} />
                    </View>
                    <Text className="flex-1 font-outfit text-base text-green-500">
                        Check for App Updates
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center py-4 border-b border-gray-800/50"
                    onPress={() => Linking.openURL(chefuAccountManageUrl())}
                    disabled={loading}
                >
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                        <Ionicons name="person-circle-outline" size={20} color={Colors.PRIMARY} />
                    </View>
                    <Text className="flex-1 font-outfit text-base" style={{ color }}>
                        Manage CheFu Account
                    </Text>
                    <Ionicons name="open-outline" size={16} color={Colors.GRAY} />
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-row items-center py-4 ${loading ? 'opacity-50' : 'opacity-100'}`}
                    onPress={handleLogout}
                    disabled={loading}
                >
                    <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-4">
                        <Ionicons name="log-out-outline" size={20} color={Colors.RED} />
                    </View>
                    <Text className="flex-1 font-outfitBold text-base text-red-500">
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>

            <Text className="text-center font-outfit text-xs text-gray-500 mb-10">
                Version {Constants.expoConfig?.version ?? '1.0.0'}
            </Text>
        </ScrollView>
    );
};