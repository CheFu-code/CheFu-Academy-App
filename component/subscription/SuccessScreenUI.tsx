import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/Subscription.success.styles';
import { SuccessScreenUIProps } from '@/types/receipt';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';

const SuccessScreenUI = ({ receipt, countdown }: SuccessScreenUIProps) => {
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                }}
            >
                <Ionicons color={'green'} name="checkmark-circle" size={24} />
                <Text style={styles.title}>Payment Receipt</Text>
            </View>
            <Text style={styles.anyText}>
                Order ID:{' '}
                <Text style={{ color: Colors.PRIMARY }}>{receipt.id}</Text>
            </Text>
            <Text style={styles.anyText}>
                Status:{' '}
                <Text style={{ color: Colors.GREEN }}>{receipt.status}</Text>
            </Text>

            <Text style={styles.anyText}>
                Plan Type:{' '}
                <Text style={{ color: Colors.PRIMARY }}>
                    {receipt.planType}
                </Text>
            </Text>

            <Text style={styles.anyText}>
                Payer:{' '}
                <Text style={{ color: Colors.PRIMARY }}>
                    {receipt?.payer?.name?.given_name || 'Unknown'}{' '}
                    {receipt?.payer?.name?.surname || ''}
                </Text>
            </Text>

            <Text style={styles.anyText}>
                Amount:{' '}
                <Text style={{ color: Colors.PRIMARY }}>
                    {receipt?.purchase_units?.[0]?.payments?.captures?.[0]
                        ?.amount?.value || 'N/A'}{' '}
                    {receipt?.purchase_units?.[0]?.payments?.captures?.[0]
                        ?.amount?.currency_code || ''}
                </Text>
            </Text>

            <View style={styles.countdownContainer}>
                <ActivityIndicator size="small" color="green" />
                <Text style={styles.redirectText}>
                    You&apos;ll be redirected within:{' '}
                    <Text style={{ color: Colors.PRIMARY }}>
                        {countdown} second{countdown !== 1 ? 's' : ''}.
                    </Text>{' '}
                    Please don&apos;t leave the app.
                </Text>
            </View>
        </View>
    );
};

export default SuccessScreenUI;
