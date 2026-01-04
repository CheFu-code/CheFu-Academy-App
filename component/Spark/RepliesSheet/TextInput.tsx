import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import { ReplyProps } from '@/types/sparks';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ReplyTextInput = ({
    replyText,
    setReplyText,
    handleAddReply,
    replying,
}: ReplyProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <TextInput
                placeholder="Write a reply..."
                placeholderTextColor={Colors.GRAY}
                style={styles.editInput}
                multiline
                value={replyText}
                onChangeText={setReplyText}
                numberOfLines={3}
            />
            <TouchableOpacity
                onPress={handleAddReply}
                style={[
                    styles.replyButton,
                    {
                        backgroundColor: replyText.trim()
                            ? Colors.PRIMARY
                            : Colors.BG_GRAY,
                    },
                ]}
                disabled={replying || !replyText.trim()}
            >
                {replying ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                    <Text style={styles.A}>Reply</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ReplyTextInput;
