import { Colors } from '@/constant/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function LoggedOutMessage() {
    return (
        <View style={styles.container}>
            <Text
                accessibilityLabel="You are logged out"
                accessibilityRole="alert"
                style={styles.message}
            >
                You are logged out
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        color: Colors.WHITE,
        fontWeight: '600',
    },
});
