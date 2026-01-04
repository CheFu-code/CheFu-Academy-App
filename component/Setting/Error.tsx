import { styles } from '@/styles/Settings.styles';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale } from 'react-native-size-matters';

const Error = ({ err }: { err: any }) => {
    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: moderateScale(50),
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
                A fatal error occurred in Settings.
            </Text>
            <Text
                style={{
                    color: 'red',
                    fontSize: RFValue(14),
                    marginBottom: moderateScale(20),
                }}
            >
                {err?.message || String(err)}
            </Text>
        </View>
    );
};

export default Error;
