import HeaderText from '@/component/common/Header';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useFetchUser } from '@/hooks/fetchUserDetail';
import useDarkMode from '@/hooks/useDarkMode';
import { TrustedDevice } from '@/types/trustedDevice';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';

export default function TrustedDevices() {
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const { fetchUserDetail, deleteFromTrustedDevices } = useFetchUser();
    const [refreshing, setRefreshing] = useState(false);
    const [loadingDevice] = useState<string | null>(null);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserDetail();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            {/* Header */}
            <HeaderText title="Trusted Devices" />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.PRIMARY}
                    />
                }
                contentContainerStyle={{
                    paddingHorizontal: verticalScale(15),
                    gap: scale(20),
                }}
            >
                {/* Info Section */}
                <View>
                    {userDetail?.trustedDevices?.length > 0 && (
                        <Text
                            style={{
                                fontFamily: 'outfit',
                                fontSize: RFValue(14),
                                color,
                                marginTop: verticalScale(15),
                            }}
                        >
                            {userDetail.trustedDevices.length > 1
                                ? 'These are your trusted devices:'
                                : 'This is your trusted device:'}
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
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: Colors.LIGHT_GREEN,
                                    borderRadius: scale(12),
                                    padding: scale(15),
                                }}
                            >
                                <Ionicons
                                    name="shield-checkmark"
                                    size={scale(22)}
                                    color="green"
                                    style={{ marginRight: scale(10) }}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: scale(10),
                                        maxWidth: scale(290),
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: RFValue(15),
                                                color: Colors.BLACK,
                                                fontFamily: 'outfit-bold',
                                                marginBottom: verticalScale(5),
                                            }}
                                        >
                                            {device.modelName ||
                                                'Unknown Device'}
                                        </Text>

                                        <Text
                                            numberOfLines={3}
                                            style={{
                                                fontFamily: 'outfit',
                                                fontSize: RFValue(12),
                                                color: Colors.GRAY,
                                                maxWidth: scale(190),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'outfit-bold',
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                Operating System:
                                            </Text>{' '}
                                            {device.osName || 'Unknown OS'}
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'outfit',
                                                fontSize: RFValue(12),
                                                color: Colors.GRAY,
                                                maxWidth: scale(200),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'outfit-bold',
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                Version:{' '}
                                            </Text>
                                            {device.osVersion || 'N/A'}
                                        </Text>

                                        <Text
                                            style={{
                                                fontFamily: 'outfit',
                                                fontSize: RFValue(12),
                                                color: Colors.BLACK,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'outfit-bold',
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                Brand:
                                            </Text>{' '}
                                            {device.brand || 'Unknown Brand'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        disabled={
                                            loadingDevice === device.modelName
                                        }
                                        onPress={() =>
                                            deleteFromTrustedDevices(device)
                                        }
                                        style={{
                                            paddingHorizontal: scale(10),
                                            paddingVertical: verticalScale(8),
                                            borderRadius: scale(12),
                                            backgroundColor: Colors.LIGHT_RED,
                                            opacity:
                                                loadingDevice ===
                                                device.modelName
                                                    ? 0.6
                                                    : 1,
                                        }}
                                    >
                                        {loadingDevice === device.modelName ? (
                                            <ActivityIndicator
                                                color={color}
                                                size="small"
                                            />
                                        ) : (
                                            <Text
                                                style={{
                                                    fontFamily: 'outfit-bold',
                                                    fontSize: RFValue(12),
                                                    color: Colors.RED,
                                                }}
                                            >
                                                Remove
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ),
                    )
                ) : (
                    <>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                fontSize: RFValue(14),
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                fontFamily: 'outfit-bold',
                            }}
                        >
                            No trusted devices added yet.
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'outfit',
                                fontSize: RFValue(13),
                                color: Colors.GRAY,
                                lineHeight: scale(20),
                                textAlign: 'center',
                                marginTop: verticalScale(20),
                            }}
                        >
                            Trusted devices will be added automatically as you
                            continue using the app. You can revisit this screen
                            after multiple logins to see them.
                        </Text>
                    </>
                )}

                {/* Description */}
                {(userDetail?.trustedDevices || []).length > 0 && (
                    <View>
                        <Text
                            style={{
                                fontFamily: 'outfit',
                                fontSize: RFValue(12),
                                color: Colors.GRAY,
                                lineHeight: scale(20),
                            }}
                        >
                            Any logins not done on trusted devices listed above
                            will be flagged, and a security alert will be sent
                            to your email for verification—but only if you have
                            toggled on the option to send email alerts under the
                            Email Alerts setting. By default, this option is
                            turned on. You can toggle it off if you don’t want
                            to receive email alerts.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
