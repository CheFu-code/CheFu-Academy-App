import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../styles/MechanicsLab.styles";

export default function LogHistory<T>({
  title,
  data,
  renderItem,
}: {
  title: string;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  if (data.length === 0) return null;

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[styles.title, { fontSize: 16 }]}>
        {title} (Latest 5)
      </Text>
      {data.slice(0, 5).map(renderItem)}
    </View>
  );
}
