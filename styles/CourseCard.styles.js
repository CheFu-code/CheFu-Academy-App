import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 12,
        padding: 5,
        marginTop: 10,
        width: '49%',
    },
    bannerImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        color: Colors.PRIMARY,
    },
    chapterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 18,
    },
    chapter: {
        fontSize: 14,
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
    },
    time: {
        fontSize: 10,
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
        justifyContent: 'flex-end',
        right: 5,
    },
    creatorProfilePicWrapper: {
        position: 'absolute',
        top: 5, // distance from top of banner
        right: 5, // distance from left of banner
        zIndex: 10,
    },
    creatorProfilePic: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#ccc',
        borderRadius: 20,
    },
    ownerLabel: {
        marginTop: 6,
        fontSize: 10,
        color: Colors.GREEN,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.GREEN,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
});
