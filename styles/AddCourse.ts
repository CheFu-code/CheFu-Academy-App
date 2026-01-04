import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#121212',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'outfit-bold',
        color: Colors.GREEN,
        marginTop: 15,
    },
    modalSubtext: {
        fontSize: 14,
        color: '#ccc',
        textAlign: 'center',
        marginTop: 8,
        fontFamily: 'outfit',
    },
    textInput: {
        padding: scale(15),
        backgroundColor: Colors.WHITE,
        width: '100%',
        borderRadius: scale(10),
        marginTop: verticalScale(20),
        color: 'black',
        height: verticalScale(90),
        alignItems: 'flex-start',
        fontSize: RFValue(15),
        fontFamily: 'outfit',
        borderWidth: scale(0.5),
        borderColor: Colors.GRAY,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: 'outfit-bold',
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },
    subscribeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.GREEN,
        alignItems: 'center',
        marginTop: 10,
    },
    subscribeText: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: RFValue(15),
    },
    title: {
        fontFamily: 'outfit',
        fontSize: RFValue(16),
        marginTop: verticalScale(5),
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        color: '#666',
        marginTop: verticalScale(10),
    },
    backIcon: {
        padding: moderateScale(3),
        borderRadius: moderateScale(10),
        backgroundColor: Colors.BG_GRAY,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 30,
        paddingTop: 40,
        backgroundColor: Colors.BG_COLOR,
        zIndex: 10,
    },
    header: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(24),
        color: Colors.PRIMARY,
    },
    topicsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 6,
    },
    topics: {
        padding: 7,
        borderWidth: 0.4,
        borderColor: Colors.WHITE,
        borderRadius: 99,
        paddingHorizontal: 15,
    },
    selectTopic: {
        fontFamily: 'outfit',
        fontSize: RFValue(16),
    },
});
