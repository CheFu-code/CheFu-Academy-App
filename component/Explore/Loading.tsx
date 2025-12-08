import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';

const Loading = () => {
    const { backgroundColor } = useDarkMode();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor,
            }}
        >
            <LottieView
                autoPlay
                loop
                source={require('../../assets/animations/Loading.json')}
                style={{
                    width: moderateScale(150),
                    height: verticalScale(150),
                }}
            />
            <Text
                style={{
                    marginTop: moderateScale(10),
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(16),
                    color: Colors.PRIMARY,
                }}
            >
                Loading...
            </Text>
        </View>
    );
};

export default Loading;
