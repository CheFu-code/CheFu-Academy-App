import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import { AntDesign } from '@expo/vector-icons';

interface Props {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function AddComment({
    value,
    onChange,
    onSubmit,
    loading,
}: Props) {
    return (
        <View style={styles.addButtonContainer}>
            <TextInput
                multiline
                numberOfLines={2}
                placeholder="Add a comment..."
                style={styles.commentInput}
                placeholderTextColor={Colors.GRAY}
                value={value}
                onChangeText={onChange}
            />
            <TouchableOpacity
                onPress={onSubmit}
                disabled={!value.trim() || loading}
                style={[
                    styles.postButton,
                    { opacity: loading || !value.trim() ? 0.5 : 1 },
                ]}
            >
                <Text style={{ fontFamily: 'outfit', color: Colors.WHITE }}>
                    {loading ? 'Posting...' : 'Post'}
                </Text>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                    <AntDesign name="plus" size={12} color={Colors.WHITE} />
                )}
            </TouchableOpacity>
        </View>
    );
}
