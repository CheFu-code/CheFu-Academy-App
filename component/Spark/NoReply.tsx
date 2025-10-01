import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '@/styles/SparkDetail';

export default function NoReply() {
    return (
        <View style={styles.Y}>
            <Text style={styles.noReplyText}>No replies yet...</Text>
            <Text style={styles.Z}>Be the first to share your thoughts</Text>
        </View>
    );
}
