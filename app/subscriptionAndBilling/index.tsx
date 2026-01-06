import { MaterialIcons } from '@expo/vector-icons';

import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import { useTransaction } from '@/hooks/useTransaction';
import { useUserPayments } from '@/hooks/useUserPayments';
import { styles } from '@/styles/SubscriptionAndBilling.styles';
import { capitalize } from '@/utils/string';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function SubscriptionAndBilling() {
    const { userDetail } = useContext(UserDetailContext);
    const { getUserPayments } = useUserPayments();
    const { color, backgroundColor } = useDarkMode();
    const { downloadTransaction, shareTransaction } = useTransaction();
    const [loading2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            const data = await getUserPayments();
            setPaymentHistory(data);
            setLoading(false);
        };
        fetchPayments();
    }, [userDetail?.email, getUserPayments]);

    return (
        <SafeAreaView
            style={[
                styles.container,
                { padding: moderateScale(20), backgroundColor },
            ]}
        >
            {/* Header */}
            <HeaderText title="Subscription & Billing" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: moderateScale(40) }}
            >
                {/* Current Plan Section */}
                <View style={styles.section}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={[styles.sectionTitle, { color }]}
                        >
                            Current Plan
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                disabled={loading || loading2}
                                onPress={() =>
                                    paymentHistory.length > 0
                                        ? shareTransaction(paymentHistory[0])
                                        : Alert.alert('No payment available')
                                }
                            >
                                {loading ? (
                                    <ActivityIndicator color="green" />
                                ) : (
                                    <MaterialIcons
                                        name="share"
                                        size={24}
                                        style={{
                                            color: 'green',
                                            padding: 5,
                                            backgroundColor: Colors.LIGHT_GREEN,
                                            borderRadius: 15,
                                        }}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={loading2 || loading}
                                onPress={() =>
                                    paymentHistory.length > 0
                                        ? downloadTransaction(
                                              paymentHistory[0],
                                              userDetail,
                                          )
                                        : Alert.alert('No receipt available')
                                }
                            >
                                {loading2 ? (
                                    <ActivityIndicator color="green" />
                                ) : (
                                    <MaterialIcons
                                        name="receipt"
                                        size={24}
                                        style={{
                                            color: 'green',
                                            padding: 5,
                                            backgroundColor: Colors.LIGHT_GREEN,
                                            borderRadius: 15,
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.planName}>
                        {`${capitalize(userDetail.planType)} Plan` ||
                            'Unknown Plan'}
                    </Text>
                    <Text style={styles.renewalDate}>
                        Your plan will expire on:{' '}
                        {new Date(
                            userDetail.memberUntil,
                        ).toLocaleDateString() || 'N/A'}
                    </Text>

                    <TouchableOpacity
                        disabled={loading}
                        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
                        onPress={() => {
                            // Replace with real cancellation logic
                            Alert.alert(
                                'Your subscription plan has been canceled',
                            );
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Cancel Subscription
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: Colors.BG_GRAY,
                            fontFamily: 'michroma',
                            fontSize: RFValue(12),
                        }}
                    >
                        Email: {userDetail?.email}
                    </Text>
                    <Text style={styles.sectionTitle}>
                        Total Payments: {paymentHistory.length || ''}
                    </Text>
                </View>

                {/* Payment History Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment History</Text>
                    {paymentHistory.map((payment) => (
                        <View key={payment.id} style={styles.paymentRow}>
                            <Text style={styles.paymentText}>
                                {new Date(
                                    payment.timestamp,
                                ).toLocaleDateString() || ''}
                            </Text>
                            <Text style={styles.paymentText}>
                                {payment.amount?.value}{' '}
                                {payment.amount?.currency_code || ''}
                            </Text>
                            <Text
                                style={{
                                    color:
                                        payment.status === 'Paid' ||
                                        payment.status === 'COMPLETED'
                                            ? 'green'
                                            : 'red',
                                    fontFamily: 'outfit-bold',
                                }}
                            >
                                {payment.status || ''}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
