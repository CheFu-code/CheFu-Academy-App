import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";

export default function CancelScreen() {
    setTimeout;
    return (
        <View style={styles.container}>
            <Ionicons
                name="close-circle-outline"
                size={100}
                color={Colors.RED}
            />
            <Text style={styles.title}>Subscription Canceled</Text>
            <Text style={styles.message}>
                We're sorry to see you go. Your subscription has been
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.PRIMARY,
        marginTop: 20,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: Colors.GRAY,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: "bold",
    },
});
