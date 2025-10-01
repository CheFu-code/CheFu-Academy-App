import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

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
        alignItems: 'flex-start',
        gap: 10,
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
        fontFamily: 'outfit',
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
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between'
    },
    commentTimestamp: {
        fontSize: 12,
        color: '#777',
        fontFamily: 'outfit',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
        gap: 20,
    },
    menuTrigger: {
        padding: 2,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
    },
    editInput: {
        color: Colors.WHITE,
        fontSize: RFValue(13),
        // marginBottom: 5,
        borderWidth: 0.7,
        borderColor: Colors.GRAY,
        borderRadius: 22,
        // marginTop: 10,
        flex: 1,
        maxWidth: '75%',
        padding: 10,
        fontFamily: 'outfit',
        textAlignVertical: 'top',
        minHeight: 40,
        maxHeight: 100,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.BG_COLOR,
    },
    editHeader: {
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
        borderRadius: 12,
    },
    editText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontFamily: 'outfit-bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    }, modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    menuOption2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        padding: 5,
        borderRadius: 5,
    },
    menuOption1: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingBottom: 5,
        borderBottomWidth: 0.3,
        borderColor: Colors.GRAY,
    },
    optionsContainerStyle: {
        backgroundColor: Colors.BG_COLOR,
        borderRadius: 8,
        paddingVertical: 5,
        borderWidth: 0.4,
        borderColor: Colors.GRAY,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.BG_COLOR,
        padding: 8,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    replyButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        alignItems: 'center',
        marginLeft: 10,
        paddingHorizontal: 16,
        borderRadius: 22,
    },
    replyText: {
        color: Colors.WHITE,
        fontSize: RFValue(14),
        fontFamily: 'outfit-bold',
    },
    noReplyText: {
        color: Colors.GRAY,
        marginBottom: 5,
        fontFamily: 'outfit-bold',
    },
    reply: {
        color: Colors.GRAY,
        fontSize: RFValue(11),
        lineHeight: 20,
        maxWidth: 270,
    }, fullname: {
        color: Colors.WHITE,
        fontSize: RFValue(12),
    }, fullnameCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
    }, containerReply: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: Colors.BG_COLOR,
        borderRadius: 10,
    },
    X: {
        flexDirection: 'row',
        gap: 10,
    }, Y: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    }, Z: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit',
        marginTop: 6,
    }, A: {
        color: Colors.WHITE,
        fontFamily: 'outfit',
        fontSize: RFValue(12),
    }, delete: {
        padding: 6,
        paddingHorizontal:8,
        backgroundColor: Colors.LIGHT_RED, borderRadius: '50%'
    }

});
