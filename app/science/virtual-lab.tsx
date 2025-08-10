import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";
import { styles } from "../../styles/VirtualLab.styles";

export default function VirtualLab() {
    const router = useRouter();
    const [heaterOn, setHeaterOn] = useState(false);
    const [coolingOn, setCoolingOn] = useState(false);
    const [temperature, setTemperature] = useState(20);
    const [waterAmount, setWaterAmount] = useState(1);
    const [energyUsed, setEnergyUsed] = useState(0); // kJ
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [paused, setPaused] = useState(false);
    const [history, setHistory] = useState<{ time: string; temp: number }[]>(
        []
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [boilingAlertShown, setBoilingAlertShown] = useState(false);

    useEffect(() => {
        if (paused) return;
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setElapsedTime((t) => t + 1);

            setTemperature((temp) => {
                const rate = 1 / waterAmount;
                let newTemp = temp;

                if (heaterOn) {
                    setEnergyUsed((e) => e + 4.2 * waterAmount * rate);
                    newTemp = Math.min(temp + rate, 100);
                } else if (coolingOn) {
                    newTemp = Math.max(temp - rate * 1.5, 20);
                } else {
                    newTemp = Math.max(temp - rate * 0.5, 20);
                }

                if (newTemp >= 100 && !boilingAlertShown) {
                    setBoilingAlertShown(true);
                    Vibration.vibrate(500);
                    Alert.alert(
                        "Warning",
                        "Water is boiling! Turn off the heater."
                    );
                }

                return newTemp;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [heaterOn, coolingOn, waterAmount, paused, boilingAlertShown]);

    // Reset alert when water cools below boiling point
    useEffect(() => {
        if (temperature < 100 && boilingAlertShown) {
            setBoilingAlertShown(false);
        }
    }, [temperature]);

    const adjustWaterAmount = (change: number) => {
        setWaterAmount((prev) => {
            const newVal = Math.min(5, Math.max(0.1, prev + change));
            return parseFloat(newVal.toFixed(1));
        });
    };

    const resetExperiment = () => {
        setHeaterOn(false);
        setCoolingOn(false);
        setTemperature(20);
        setWaterAmount(1);
        setEnergyUsed(0);
        setElapsedTime(0);
        setHistory([]);
        setPaused(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const experimentNote = () => {
        if (temperature >= 100) return "Water is boiling!";
        if (heaterOn) return "Heater is ON. Temperature rising...";
        if (coolingOn) return "Forced cooling active...";
        if (!heaterOn && temperature > 20) return "Cooling naturally...";
        return "Water is at room temperature.";
    };

    const energyCost = () => {
        const kWh = energyUsed / 3600; // 1 kWh = 3600 kJ
        const pricePerKWh = 2.5; // example cost in Rands
        return (kWh * pricePerKWh).toFixed(2);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                >
                    <AntDesign
                        style={{ marginTop: 10 }}
                        name="left"
                        size={24}
                        color={Colors.WHITE}
                    />
                    <Text style={styles.title}>
                        Virtual Lab - Water Heating
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Heater Toggle */}
                <View style={styles.row}>
                    <Text style={styles.label}>Heater:</Text>
                    <Switch
                        value={heaterOn}
                        onValueChange={(v) => {
                            setHeaterOn(v);
                            if (v) setCoolingOn(false);
                        }}
                    />
                </View>

                {/* Cooling Toggle */}
                <View style={styles.row}>
                    <Text style={styles.label}>Cooling:</Text>
                    <Switch
                        value={coolingOn}
                        onValueChange={(v) => {
                            setCoolingOn(v);
                            if (v) setHeaterOn(false);
                        }}
                    />
                </View>

                {/* Water Amount Control */}
                <View style={[styles.row, { marginTop: 20 }]}>
                    <Text style={styles.label}>
                        Water Amount: {waterAmount.toFixed(1)} L
                    </Text>
                    <View style={styles.stepper}>
                        <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => adjustWaterAmount(-0.1)}
                        >
                            <Text style={styles.stepperText}>−</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => adjustWaterAmount(0.1)}
                        >
                            <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Temperature Display */}
                <View style={styles.temperatureContainer}>
                    <Text
                        style={[
                            styles.temperatureText,
                            temperature >= 100 && { color: "#FF0000" },
                        ]}
                    >
                        {temperature.toFixed(1)} °C
                    </Text>
                    <Text style={styles.infoText}>{experimentNote()}</Text>
                </View>

                {/* Experiment Stats */}
                <View style={styles.statsBox}>
                    <Text style={styles.statsText}>
                        Elapsed Time: {formatTime(elapsedTime)}
                    </Text>
                    <Text style={styles.statsText}>
                        Energy Used: {energyUsed.toFixed(1)} kJ
                    </Text>
                    <Text style={styles.statsText}>
                        Energy Cost: R {energyCost()}
                    </Text>
                </View>

                {/* Pause / Resume */}
                <TouchableOpacity
                    style={[styles.resetButton, { backgroundColor: "#00796B" }]}
                    onPress={() => setPaused((p) => !p)}
                >
                    <Text style={styles.resetText}>
                        {paused ? "Resume" : "Pause"}
                    </Text>
                </TouchableOpacity>

                {/* Reset Button */}
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetExperiment}
                >
                    <Text style={styles.resetText}>Reset Experiment</Text>
                </TouchableOpacity>

                {/* Notes */}
                <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}>Experiment History:</Text>
                    {history.slice(-10).map((h, i) => (
                        <Text key={i} style={styles.notesText}>
                            {h.time} → {h.temp.toFixed(1)}°C
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
