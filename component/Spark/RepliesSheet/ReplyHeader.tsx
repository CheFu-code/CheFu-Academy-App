import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Text, View } from 'react-native';

const ReplyHeader = () => {
    const { textColor } = useDarkMode();
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={[styles.replyText, { color: textColor }]}>
                Replies
            </Text>
        </View>
    );
};

export default ReplyHeader;
