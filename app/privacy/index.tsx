import HeaderText from '@/component/common/Header';
import { Colors } from '@/constant/Colors';
import { ACADEMY_PRIVACY_URL } from '@/constant/links';
import useDarkMode from '@/hooks/useDarkMode';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export default function Privacy() {
    const { backgroundColor, color } = useDarkMode();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="Back" />
            <View style={styles.content}>
                <Text style={[styles.eyebrow, { color: Colors.PRIMARY }]}>
                    CheFu Academy
                </Text>
                <Text style={[styles.title, { color }]}>Privacy Policy</Text>
                <Text style={styles.copy}>
                    We keep the official privacy policy on the Academy web app so
                    the mobile app always opens the latest version.
                </Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => Linking.openURL(ACADEMY_PRIVACY_URL)}
                >
                    <Text style={styles.buttonText}>Open Privacy Policy</Text>
                </Pressable>
                <Text style={styles.url}>{ACADEMY_PRIVACY_URL}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(18),
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    eyebrow: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(12),
        marginBottom: verticalScale(8),
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(28),
        marginBottom: verticalScale(12),
    },
    copy: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        lineHeight: RFValue(21),
        marginBottom: verticalScale(22),
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        borderRadius: moderateScale(8),
        minHeight: verticalScale(48),
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.88,
    },
    buttonText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(14),
    },
    url: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: RFValue(11),
        marginTop: verticalScale(12),
        textAlign: 'center',
    },
});
