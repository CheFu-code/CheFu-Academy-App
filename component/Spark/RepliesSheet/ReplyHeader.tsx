import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Text, View } from 'react-native';

const ReplyHeader = () => {
    const { color } = useDarkMode();
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={[styles.replyText, { color }]}>
                Replies
            </Text>
        </View>
    );
};

export default ReplyHeader;
