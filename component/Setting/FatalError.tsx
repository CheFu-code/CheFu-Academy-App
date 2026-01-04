import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/Settings.styles';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const FatalError = () => {
    const [fatalError, setFatalError] = useState(null);
    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: verticalScale(50),
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            ]}
        >
            <Text
                style={{
                    color: 'red',
                    fontSize: RFValue(18),
                    marginBottom: moderateScale(20),
                }}
            >
                Something went wrong in Settings.
            </Text>
            <Text
                style={{
                    color: 'red',
                    fontSize: RFValue(14),
                    marginBottom: moderateScale(20),
                }}
            >
                {fatalError?.message || String(fatalError)}
            </Text>
            <TouchableOpacity
                onPress={() => {
                    setFatalError(null);
                }}
                style={{
                    backgroundColor: Colors.PRIMARY,
                    padding: moderateScale(12),
                    borderRadius: scale(8),
                }}
            >
                <Text style={{ color: 'white', fontFamily: 'outfit-bold' }}>
                    Try Again
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default FatalError;
