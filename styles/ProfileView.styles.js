import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    fullname: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 20,
    },
    numberOfCourses: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 20,
        textAlign: "center",
    },
    email: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 14,
    },
    profilePicture: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.YELLOW,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
    },
    backText: {
        color: "white",
        fontFamily: "outfit-bold",
        fontSize: 18,
        maxWidth: 200,
    },
    container: { flex: 1, backgroundColor: Colors.BG_COLOR },
    headerContainer: {
        padding: 10,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    checkmark: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        
    },
    box: {
        borderColor: Colors.WHITE,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "#cccccc54",
        padding: 10,
        maxWidth: 120,
        maxHeight: 120,
        minWidth: 120,
        minHeight: 120,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    bio: {
        color: Colors.WHITE,
        fontFamily: "outfit",
        fontSize: 14,
        marginTop: 10,
    },
    common: {
        flexDirection: "row",
        gap: 20,
    },
    boxContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.WHITE,
        backgroundColor: "#00000054",
    },
    notFound: {
        color: "white",
        fontFamily: "outfit-bold",
        fontSize: 20,
    },
    notFoundMessage: {
        color: "gray",
        fontFamily: "outfit",
        fontSize: 14,
        textAlign: "center",
        marginTop: 6,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 10,
    },
    animationContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
    },
});
