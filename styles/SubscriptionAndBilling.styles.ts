import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        marginTop: verticalScale(30),
        backgroundColor: Colors.GRAY,
        padding: moderateScale(4),
        borderRadius: moderateScale(20),
        color: "white",
    },
    heading: {
        fontSize: scale(24),
        fontWeight: "bold",
        marginTop: verticalScale(30),
        color: Colors.PRIMARY,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
    },
    section: {
        marginTop: verticalScale(30),
    },
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: "600",
        marginBottom: verticalScale(12),
    },
    planName: {
        fontSize: scale(16),
        marginBottom: verticalScale(4),
        color: Colors.GREEN,
        fontFamily: "outfit-bold",
    },
    renewalDate: {
        fontSize: scale(14),
        color: "#ccc",
        marginBottom: verticalScale(12),
        fontFamily: "outfit",
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(16),
        borderRadius: moderateScale(6),
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderColor: "#333",
    },
    paymentText: {
        color: "#ccc",
        fontSize: scale(14),
    },
});
