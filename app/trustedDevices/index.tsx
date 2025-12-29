import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';

type TrustedDevice = {
    brand?: string;
    deviceType?: number;
    modelName?: string;
    osName?: string;
    osVersion?: string;
};

export default function TrustedDevices() {
    const { safeBack } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [loadingDevice, setLoadingDevice] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserDetail = useCallback(async () => {
        if (!userDetail?.email) return;

        try {
            const snapshot = await getDoc(doc(db, 'users', userDetail?.email)); // 👈 wrap with doc()
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUserDetail({ ...userDetail, ...data });
            }
        } catch (err) {
            console.error('Failed to fetch user detail:', err);
            ToastAndroid.show('Failed to refresh data', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }, [setUserDetail, userDetail]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserDetail();
        setRefreshing(false);
    };

    const deleteFromTrustedDevices = (device: TrustedDevice) => {
        Alert.alert(
            'Confirm Removal',
            'Are you sure you want to remove this device from your trusted devices?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (
                                !userDetail?.email ||
                                !userDetail?.trustedDevices
                            ) {
                                ToastAndroid.show(
                                    'Your data not found',
                                    ToastAndroid.SHORT,
                                );
                                return;
                            }
                            setLoadingDevice(device.modelName || 'unknown');
                            const filteredDevices =
                                userDetail.trustedDevices.filter(
                                    (d: TrustedDevice) =>
                                        !(
                                            d.brand === device.brand &&
                                            d.modelName === device.modelName &&
                                            d.osName === device.osName &&
                                            d.osVersion === device.osVersion &&
                                            d.deviceType === device.deviceType
                                        ),
                                );
                            await updateDoc(
                                doc(db, 'users', userDetail?.email),
                                {
                                    trustedDevices: filteredDevices,
                                },
                            );
                            setUserDetail({
                                ...userDetail,
                                trustedDevices: filteredDevices,
                            });
                            Alert.alert(
                                'Success',
                                'Device removed from trusted list',
                            );
                        } catch (error) {
                            console.error(
                                'Error removing trusted device:',
                                error,
                            );
                            Alert.alert('Error', 'Failed to remove device');
                        } finally {
                            setLoadingDevice(null);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => safeBack()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: verticalScale(15),
                }}
            >
                <AntDesign name="left" size={scale(20)} color={textColor} />
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(20),
                        color: textColor,
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
                                color: textColor,
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
                                                color={textColor}
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
