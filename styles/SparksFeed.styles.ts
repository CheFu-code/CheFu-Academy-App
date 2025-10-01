import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.PRIMARY,
    },
    categoryCont: {
        backgroundColor: '#8FBC8F20',
        padding: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    content: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    author: {
        fontSize: 12,
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6,
        borderTopWidth: 0.2,
        borderColor: Colors.GRAY,
        paddingTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.BG_GRAY,
        padding: 8,
        borderRadius: 10,
        paddingHorizontal: 18,
    },
    actionText: {
        fontSize: 12,
        color: Colors.PRIMARY,
    },
    authorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});