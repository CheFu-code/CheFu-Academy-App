import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, scale } from "react-native-size-matters";

const AVATAR_SIZE = moderateScale(100);
const CAMERA_SIZE = scale(34);


export const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: moderateScale(15) },
    title: {
        fontSize: RFValue(20),
        fontFamily: 'outfit-bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    avatarCont: {
        alignSelf: 'center',
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: moderateScale(10),
        position: 'relative',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: scale(50),
    },
    cameraBtn: {
        position: 'absolute',
        right: -scale(4), // slightly outside for overlap
        bottom: -scale(4),
        width: CAMERA_SIZE,
        height: CAMERA_SIZE,
        borderRadius: CAMERA_SIZE / 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: scale(10),
        marginBottom: moderateScale(10),
    },
});
