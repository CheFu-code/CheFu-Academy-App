import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        marginBottom: 8,
        fontFamily: "outfit-bold",
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "outfit",
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "black",
    },
    instructorName: {
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
    profilePictureContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    topic: {
        marginLeft: 8,
        marginBottom: 4,
        fontFamily: "outfit",
        fontSize: 16,
    },
});
