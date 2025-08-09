import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SystemDesign() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the system-design screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});
