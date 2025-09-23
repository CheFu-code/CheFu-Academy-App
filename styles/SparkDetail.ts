import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 12,
    },
    backText: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between',
        padding: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
    },
    author: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#777',
    },
    categoryBox: {
        backgroundColor: Colors.BG_GRAY,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        right: 10,
    },
    category: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.PRIMARY,
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
        paddingHorizontal: 10,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        color: 'white',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        borderTopWidth: 0.2,
        borderColor: Colors.GRAY,
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: Colors.PRIMARY,
    },
    commentsSection: {
        // marginTop: 20,
    },
    commentsHeader: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
    },
    comment: {
        flexDirection: 'row',
        // marginBottom: 12,
        alignItems: 'flex-start',
        gap: 10,
        // borderTopWidth: 0.2,
        // borderColor: Colors.GRAY,
        paddingTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    commentAuthor: {
        fontSize: 14,
        marginBottom: 2,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    commentText: {
        fontSize: 14,
        color: 'white',
    },
    noComments: {
        fontSize: 14,
        color: '#888',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        fontSize: 16,
        color: '#888',
    },
    commentInput: {
        padding: 7,
        fontSize: 14,
        color: Colors.BLACK,
        backgroundColor: Colors.BG_GRAY,
        maxWidth: "65%",
        borderRadius: 20,
        flex: 1,
        fontFamily: 'outfit',
        marginLeft: 10,
        marginTop: 10
    },
    addButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        borderColor: Colors.GRAY,
    },
    postButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 10,
        marginTop: 10
    },
});
