import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/Subscription.success.styles';
import { ActivityIndicator, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Loading() {
    const { color, backgroundColor } = useDarkMode();
    return (
        <View style={[styles.center, { backgroundColor }]}>
            <ActivityIndicator size="large" color={Colors.GREEN} />
            <Text
                style={{
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(20),
                    color,
                }}
            >
                Verifying payment...
            </Text>
        </View>
    );
}
