import useDarkMode from '@/hooks/useDarkMode';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function CancelScreen() {
    const { backgroundColor } = useDarkMode();
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Ionicons
                name="close-circle-outline"
                size={scale(100)}
                color={Colors.RED}
            />
            <Text style={styles.title}>Subscription Canceled</Text>
            <Text style={styles.message}>
                We&apos;re sorry to see you go. Your subscription has been
                successfully canceled. You will no longer be charged.
            </Text>
            <Link href="/(tabs)/home" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    title: {
        fontSize: RFValue(28),
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginTop: moderateScale(20),
        textAlign: 'center',
    },
    message: {
        fontSize: RFValue(15),
        color: Colors.GRAY,
        textAlign: 'center',
        marginTop: moderateScale(10),
        marginBottom: moderateScale(30),
        lineHeight: 24,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(30),
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: RFValue(18),
        fontWeight: 'bold',
    },
});
