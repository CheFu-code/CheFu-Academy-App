import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale } from 'react-native-size-matters';

const HeaderText = ({ title }: { title: string }) => {
    const { safeBack } = useSafeNavigation();
    const { color } = useDarkMode();
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(5),
            }}
            onPress={safeBack}
        >
            <AntDesign name="left" size={scale(22)} color={color} />
            <Text
                style={{
                    color,
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(22),
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default HeaderText;
