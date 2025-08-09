import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Slider from "@react-native-community/slider";

export default function VirtualLab() {
    const router = useRouter();

    const [heaterOn, setHeaterOn] = useState(false);
    const [temperature, setTemperature] = useState(20); // Initial temp in °C
    const [waterAmount, setWaterAmount] = useState(1); // liters

    useEffect(() => {
        let interval: number | null = null;

        if (heaterOn) {
            interval = setInterval(() => {
                setTemperature((temp) => Math.min(temp + 1, 100)); // max 100 °C
            }, 1000);
        } else {
            interval = setInterval(() => {
                setTemperature((temp) => Math.max(temp - 1, 20)); // cools to 20 °C
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [heaterOn]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                >
                    <AntDesign name="left" size={24} color={Colors.WHITE} />
                </TouchableOpacity>
                <Text style={styles.title}>Virtual Lab - Water Heating</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Heater Toggle */}
                <View style={styles.row}>
                    <Text style={styles.label}>Heater:</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={heaterOn ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={setHeaterOn}
                        value={heaterOn}
                    />
                </View>

                {/* Water Amount Slider */}
                <View style={styles.row}>
                    <Text style={styles.label}>
                        Water Amount: {waterAmount.toFixed(1)} L
                    </Text>
                </View>
                <Slider
                    minimumValue={0.1}
                    maximumValue={5}
                    value={waterAmount}
                    step={0.1}
                    minimumTrackTintColor="#8E44AD"
                    maximumTrackTintColor="#000000"
                    onValueChange={setWaterAmount}
                    style={{ width: "100%", height: 40 }}
                    accessibilityLabel="Water amount slider"
                />

                {/* Temperature Display */}
                <View style={styles.temperatureContainer}>
                    <Text style={styles.temperatureText}>
                        {temperature.toFixed(1)} °C
                    </Text>
                    <Text style={styles.infoText}>
                        {temperature >= 100
                            ? "Water is boiling!"
                            : temperature <= 20
                            ? "Water is at room temperature."
                            : "Heating water..."}
                    </Text>
                </View>

                {/* Experiment Notes */}
                <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}>Experiment Notes:</Text>
                    <Text style={styles.notesText}>
                        Adjust the water amount and toggle the heater. The
                        temperature will increase when the heater is on and
                        decrease when it is off.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 50 : 30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.WHITE,
        flexShrink: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        color: Colors.WHITE,
    },
    temperatureContainer: {
        marginTop: 24,
        alignItems: "center",
    },
    temperatureText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FF4500",
    },
    infoText: {
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 8,
    },
    notesBox: {
        marginTop: 40,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
    },
    notesTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: Colors.WHITE,
        marginBottom: 8,
    },
    notesText: {
        color: Colors.GRAY,
        fontSize: 16,
        lineHeight: 22,
    },
});
