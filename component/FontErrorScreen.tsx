import { Colors } from '@/constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, useColorScheme } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

const FontErrorScreen = () => {
    const scheme = useColorScheme();
    const color = scheme === 'dark' ? 'red' : '#D32F2F';

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                    scheme === 'dark' ? Colors.BG_COLOR : Colors.WHITE,
                paddingHorizontal: verticalScale(20),
            }}
        >
            <MaterialIcons
                name="error-outline"
                size={scale(60)}
                color={color}
                style={{ marginBottom: verticalScale(14) }}
            />

            <Text
                style={{
                    color,
                    fontSize: RFValue(18),
                    fontWeight:"bold",
                    textAlign: 'center',
                    marginBottom: verticalScale(6),
                }}
            >
                Failed to load fonts.
            </Text>

            <Text
                style={{
                    color,
                    fontSize: RFValue(14),
                    textAlign: 'center',
                    lineHeight: verticalScale(18),
                }}
            >
                Please restart the app. If the problem persists, reinstall the
                application...
            </Text>
        </View>
    );
};

export default FontErrorScreen;
