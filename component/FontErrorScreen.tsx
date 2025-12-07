import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { Colors } from '@/constant/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';

const FontErrorScreen = () => {
    const scheme = useColorScheme();
    const textColor = scheme === 'dark' ? 'red' : '#D32F2F';

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
                color={textColor}
                style={{ marginBottom: verticalScale(14) }}
            />

            <Text
                style={{
                    color: textColor,
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
                    color: textColor,
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
