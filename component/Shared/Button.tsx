import useDarkMode from '@/hooks/useDarkMode';
import { ButtonProps } from '@/types/Button';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function Button({
    text,
    type = 'fill',
    onPress,
    loading,
    disabled,
    icon,
}: ButtonProps) {
    const isDisabled = loading || disabled;
    const { backgroundColor } = useDarkMode();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={{
                backgroundColor:
                    type === 'fill' ? Colors.PRIMARY : backgroundColor,
                paddingVertical: moderateScale(10),
                paddingHorizontal: moderateScale(12),
                width: '100%',
                borderRadius: moderateScale(12),
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: moderateScale(15),
                borderWidth: type === 'outline' ? scale(1) : 0,
                borderColor:
                    type === 'outline' ? Colors.BG_COLOR : 'transparent',
                opacity: isDisabled ? 0.4 : 1,
                flexDirection: 'row',
                gap: scale(6),
            }}
        >
            {!loading ? (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(5),
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: RFValue(15),
                            color: type === 'fill' ? '#fff' : Colors.PRIMARY,
                        }}
                    >
                        {text}
                    </Text>
                    {icon && <View>{icon}</View>}
                </View>
            ) : (
                <ActivityIndicator
                    size={'small'}
                    color={type === 'fill' ? '#fff' : Colors.PRIMARY}
                />
            )}
        </TouchableOpacity>
    );
}
