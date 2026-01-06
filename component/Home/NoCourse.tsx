import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Button from '../Shared/Button';

export default function NoCourse() {
    const { safePush } = useSafeNavigation();
    const {color} = useDarkMode();
    const [loading, setLoading] = useState(false);

    return (
        <View
            style={{
                marginTop: moderateScale(60),
                display: 'flex',
                alignItems: 'center',
                paddingHorizontal: scale(10),
            }}
        >
            <Image
                style={{
                    height: verticalScale(160),
                    width: scale(150),
                    marginBottom: moderateScale(20),
                }}
                source={require('../../assets/images/book1.webp')}
            />
            <Text
                style={{
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(24),
                    textAlign: 'center',
                    color,
                    marginBottom: moderateScale(10),
                }}
            >
                You don&apos;t have any course yet
            </Text>

            <Button
                onPress={() => safePush('/addCourse')}
                text={'+ Create new course'}
                disabled={loading}
                loading={false}
                icon={null}
            />
            <Button
                onPress={() => safePush('/(tabs)/explore')}
                disabled={loading}
                text={'Explore existing courses'}
                type="outline"
                loading={false}
                icon={null}
            />
        </View>
    );
}
