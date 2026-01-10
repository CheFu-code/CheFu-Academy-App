import useDarkMode from '@/hooks/useDarkMode';
import { ActivityIndicator, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';

const ListFooter = () => {
    const { color } = useDarkMode();
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: scale(3),
            }}
        >
            <Text
                style={{
                    color,
                    textAlign: 'center',
                    padding: scale(10),
                    margin: scale(5),
                }}
            >
                Loading more...
            </Text>
            <ActivityIndicator size={'small'} color={color} />
        </View>
    );
};

export default ListFooter;
