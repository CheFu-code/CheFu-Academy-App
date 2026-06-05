import { styles } from '@/styles/Settings.styles';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, verticalScale } from 'react-native-size-matters';

type FatalErrorProps = {
    message?: string;
};

const FatalError = ({ message }: FatalErrorProps) => {
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
            {message ? (
                <Text
                    style={{
                        color: 'red',
                        fontSize: RFValue(14),
                        marginBottom: moderateScale(20),
                    }}
                >
                    {message}
                </Text>
            ) : null}
        </View>
    );
};

export default FatalError;
