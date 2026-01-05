import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/Subscription.styles';
import * as Sentry from '@sentry/react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    Text,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constant/Colors';
import { PLANS } from '../../constant/plans';

interface PayPalLink {
    href: string;
    rel: string;
    method: string;
}

interface PayPalCreateOrderResponse {
    links?: PayPalLink[];
}

export default function SubscriptionWall() {
    const { backgroundColor } = useDarkMode();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('pro');

    const BASE_URL = 'https://chefu-academy-tmzx.onrender.com'; // production
    // const BASE_URL = "http://192.168.10.151:5000"; // development

    const handleSubscribe = async () => {
        try {
            setLoading(true);

            const returnUrl = `chefu-academy://subscription/success?planType=${selectedPlan}`;

            const res = await fetch(`${BASE_URL}/api/paypal/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount:
                        selectedPlan === 'premium'
                            ? '30.00'
                            : selectedPlan === 'pro'
                            ? '15.00'
                            : '6.00',
                    planType: selectedPlan,
                    return_url: returnUrl,
                }),
            });

            const data: PayPalCreateOrderResponse = await res.json();

            if (data?.links) {
                const approvalUrl = data.links?.find(
                    (link) => link.rel === 'approve',
                )?.href;
                if (approvalUrl) {
                    Linking.openURL(approvalUrl);
                } else {
                    ToastAndroid.show(
                        'Unable to initiate PayPal',
                        ToastAndroid.SHORT,
                    );
                }
            } else {
                console.log('PayPal create-order error:', data);
                Sentry.captureException(
                    new Error(
                        `PayPal create-order error: ${JSON.stringify(data)}`,
                    ),
                );

                ToastAndroid.show('Payment init failed', ToastAndroid.SHORT);
            }
        } catch (err: any) {
            console.error('Subscription error:', err);

            if (err?.message?.includes('Network request failed')) {
                Alert.alert(
                    'Network error.',
                    'Please check your internet connection.',
                );
            } else {
                ToastAndroid.show(
                    'Subscription failed. Please try again later.',
                    ToastAndroid.SHORT,
                );
            }

            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="Choose Your Plan" />

            <FlatList
                data={PLANS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            selectedPlan === item.id && styles.selectedCard,
                            item.popular && styles.popularCard,
                        ]}
                        onPress={() => setSelectedPlan(item.id)}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.planName}>{item.name}</Text>
                        <Text style={styles.planPrice}>{item.price}</Text>
                        <Text style={styles.planValidity}>
                            Valid for {item.validity}
                        </Text>

                        {item.popular && (
                            <Text style={styles.popularLabel}>
                                Most Popular
                            </Text>
                        )}
                        {item.features.map((f, idx) => (
                            <Text key={idx} style={styles.feature}>
                                • {f}
                            </Text>
                        ))}
                    </TouchableOpacity>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />

            <TouchableOpacity
                disabled={loading}
                style={[styles.subscribeBtn, { opacity: loading ? 0.5 : 1 }]}
                onPress={handleSubscribe}
            >
                {loading ? (
                    <ActivityIndicator size={'small'} color={Colors.GREEN} />
                ) : (
                    <Text style={styles.subscribeText}>Subscribe</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
