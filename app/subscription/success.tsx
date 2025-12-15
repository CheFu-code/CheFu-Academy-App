import Loading from '@/component/subscription/loading';
import NoReceipt from '@/component/subscription/NoReceipt';
import SuccessScreenUI from '@/component/subscription/SuccessScreenUI';
import { UserDetailContextType } from '@/types/context/UserDetailContext ';
import { Receipt } from '@/types/receipt';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';

type PayPalCaptureResponse = {
    details?: Receipt;
    member?: boolean;
    subscribedAt?: string;
    memberUntil?: string;
    paypalError?: {
        details?: { issue: string }[];
    };
};

export default function SuccessScreen() {
    const params = useLocalSearchParams();
    const orderID = params.token;
    const captureCalled = useRef(false);
    const { safePush, safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } =
        useContext<UserDetailContextType>(UserDetailContext);
    const [loader] = useState(false);
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(10);
    const email = userDetail?.email || '';
    const planType = params.planType || userDetail?.planType || 'basic';

    useEffect(() => {
        if (captureCalled.current || !orderID || !planType || !email) {
            setLoading(false);
            return;
        }

        captureCalled.current = true;

        const captureOrder = async () => {
            try {
                const BASE_URL = 'https://chefu-academy-tmzx.onrender.com';
                const res = await fetch(
                    `${BASE_URL}/api/paypal/capture-order`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderID, email, planType }),
                    },
                );
                let data: PayPalCaptureResponse = {};

                try {
                    data = await res.json();
                } catch (jsonErr) {
                    ToastAndroid.show(
                        'Invalid server response',
                        ToastAndroid.SHORT,
                    );
                    console.error('JSON parsing error:', jsonErr);
                    setLoading(false);
                    return;
                }
                if (res.ok && data.details) {
                    setReceipt(data.details);
                    ToastAndroid.show('Payment captured', ToastAndroid.SHORT);

                    const { member, subscribedAt, memberUntil } = data;

                    setUserDetail((prev) => {
                        const now = firestore.Timestamp.now();

                        // Ensure planType is a string, never an array
                        const normalizedPlanType = Array.isArray(planType)
                            ? planType[0]
                            : planType || 'basic';

                        if (!prev) {
                            return {
                                id: '',
                                uid: '',
                                email,
                                fullname: 'User',
                                profilePicture: '',
                                bio: '',
                                country: '',
                                createdAt: now,
                                updatedAt: now,
                                fcmToken: '',
                                isVerified: false,
                                language: 'en',
                                lastLogin: now,
                                lastSeen: now,
                                member: member ?? true,
                                onboardingComplete: false,
                                provider: 'local',
                                roles: ['user'],
                                subscriptionStatus: 'inactive',
                                emailPreferences: {
                                    activity: true,
                                    general: true,
                                    marketing: false,
                                    security: true,
                                },
                                deviceInfo: {
                                    deviceBrand: '',
                                    deviceModel: '',
                                    deviceName: '',
                                    isRTL: false,
                                    isTablet: false,
                                    manufacturer: '',
                                    orientation: '',
                                    os: '',
                                    osVersion: 0,
                                    screenHeight: 0,
                                    screenWidth: 0,
                                    totalMemory: 0,
                                },
                                planType: normalizedPlanType,
                                subscribedAt: subscribedAt ?? '',
                                memberUntil: memberUntil ?? '',
                            };
                        }

                        return {
                            ...prev,
                            member: member ?? prev.member,
                            planType: normalizedPlanType,
                            subscribedAt: subscribedAt || prev.subscribedAt,
                            memberUntil: memberUntil || prev.memberUntil,
                            updatedAt: now,
                        };
                    });
                } else if (
                    data.paypalError?.details?.some(
                        (detail) => detail.issue === 'ORDER_ALREADY_CAPTURED',
                    )
                ) {
                    ToastAndroid.showWithGravity(
                        'Order already captured, proceeding...',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                    setReceipt({
                        id: orderID as string,
                        status: 'COMPLETED',
                        payer: {
                            name: {
                                given_name: userDetail?.fullname || 'User',
                                surname: '',
                            },
                        },
                        purchase_units: [
                            {
                                payments: {
                                    captures: [
                                        {
                                            amount: {
                                                value: 'N/A',
                                                currency_code: 'N/A',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    });
                    setUserDetail((prev) => {
                        const now = firestore.Timestamp.now();
                        const normalizedPlanType = Array.isArray(planType)
                            ? planType[0]
                            : planType || 'basic';

                        if (!prev) {
                            return {
                                id: '',
                                uid: '',
                                email: userDetail?.email || '',
                                fullname: userDetail?.fullname || 'User',
                                profilePicture: '',
                                bio: '',
                                country: '',
                                createdAt: now,
                                updatedAt: now,
                                fcmToken: '',
                                isVerified: false,
                                language: 'en',
                                lastLogin: now,
                                lastSeen: now,
                                member: true,
                                onboardingComplete: false,
                                provider: 'local',
                                roles: ['user'],
                                subscriptionStatus: 'inactive',
                                emailPreferences: {
                                    activity: true,
                                    general: true,
                                    marketing: false,
                                    security: true,
                                },
                                deviceInfo: {
                                    deviceBrand: '',
                                    deviceModel: '',
                                    deviceName: '',
                                    isRTL: false,
                                    isTablet: false,
                                    manufacturer: '',
                                    orientation: '',
                                    os: '',
                                    osVersion: 0,
                                    screenHeight: 0,
                                    screenWidth: 0,
                                    totalMemory: 0,
                                },
                                planType: normalizedPlanType,
                                subscribedAt: '',
                                memberUntil: '',
                            };
                        }

                        return {
                            ...prev,
                            member: true,
                            planType: normalizedPlanType,
                            updatedAt: now,
                        };
                    });
                } else {
                    ToastAndroid.show('Capture failed', ToastAndroid.SHORT);
                }
            } catch (error) {
                ToastAndroid.show('Network error', ToastAndroid.SHORT);
                console.error('Error capturing order:', error);
            } finally {
                setLoading(false);
            }
        };

        captureOrder();
    }, [
        orderID,
        email,
        planType,
        setUserDetail,
        userDetail?.fullname,
        userDetail?.email,
    ]);

    useEffect(() => {
        if (receipt) {
            if (countdown === 0) {
                safeReplace('/subscriptionAndBilling');
            }
            const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, receipt, safeReplace]);

    if (loading) {
        return <Loading />;
    }

    if (!receipt) {
        return <NoReceipt safePush={safePush} loader={loader} />;
    }

    return <SuccessScreenUI receipt={receipt} countdown={countdown} />;
}
