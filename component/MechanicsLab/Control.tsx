import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MechanicsLab.styles";

export default function Control({
  label,
  value,
  setValue,
  step = 1,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  step?: number;
  min?: number;
  max?: number;
}) {
  const increment = () => {
    setValue((prev) => Math.min(max, Math.round((prev + step) * 10) / 10));
  };
  const decrement = () => {
    setValue((prev) => Math.max(min, Math.round((prev - step) * 10) / 10));
  };

  return (
    <View style={styles.controlRow}>
      <Text style={styles.label}>
        {label}: {value.toFixed(2)}
      </Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity onPress={decrement} style={styles.button}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={increment} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
