import { Colors } from "@/constant/Colors";
import {
    angleStep,
    DEBOUNCE_DELAY,
    feetPerMeter,
    gravityStep,
    k,
    maxAngle,
    maxGravity,
    maxVelocity,
    minAngle,
    minGravity,
    minVelocity,
    velocityStep,
} from "@/constant/physics";
import { PRESETS } from "@/constant/Planets";
import { clampAndStep } from "@/utils/math";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    AccessibilityInfo,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    Vibration,
    View,
} from "react-native";
import { styles } from "../../styles/PhysicsVisualizer.styles";

export default function PhysicsVisualizer() {
    const [gravity, setGravity] = useState(9.8);
    const [unit, setUnit] = useState("m/s²");
    const [history, setHistory] = useState<number[]>([]);
    const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
    const [initialVelocity, setInitialVelocity] = useState(20);
    const [launchAngle, setLaunchAngle] = useState(45);
    const [airResistance, setAirResistance] = useState(false);
    const router = useRouter();
    const gravityDebounce = useRef<number | null>(null);
    const velocityDebounce = useRef<number | null>(null);
    const angleDebounce = useRef<number | null>(null);

    useEffect(() => {
        AccessibilityInfo.isScreenReaderEnabled().then(setAccessibilityEnabled);
    }, []);

    function onGravityChange(text: string) {
        const val = parseFloat(text);
        if (isNaN(val)) return;
        const stepped = clampAndStep(val, minGravity, maxGravity, gravityStep);

        if (gravityDebounce.current) clearTimeout(gravityDebounce.current);
        gravityDebounce.current = setTimeout(() => {
            setGravity(stepped);
            setHistory((h) => [stepped, ...h].slice(0, 10));
            if (Platform.OS !== "web") Vibration.vibrate(10);
        }, DEBOUNCE_DELAY);
    }

    // Debounced velocity input update
    function onVelocityChange(text: string) {
        const val = parseFloat(text);
        if (isNaN(val)) return;
        const stepped = clampAndStep(
            val,
            minVelocity,
            maxVelocity,
            velocityStep
        );

        if (velocityDebounce.current) clearTimeout(velocityDebounce.current);
        velocityDebounce.current = setTimeout(() => {
            setInitialVelocity(stepped);
        }, DEBOUNCE_DELAY);
    }

    // Debounced angle input update
    function onAngleChange(text: string) {
        const val = parseFloat(text);
        if (isNaN(val)) return;
        const stepped = clampAndStep(val, minAngle, maxAngle, angleStep);

        if (angleDebounce.current) clearTimeout(angleDebounce.current);
        angleDebounce.current = setTimeout(() => {
            setLaunchAngle(stepped);
        }, DEBOUNCE_DELAY);
    }

    // Unit toggle
    const toggleUnit = () => {
        if (unit === "m/s²") {
            setUnit("ft/s²");
            setGravity((g) => +(g * feetPerMeter).toFixed(2));
            setInitialVelocity((v) => +(v * feetPerMeter).toFixed(2));
        } else {
            setUnit("m/s²");
            setGravity((g) => +(g / feetPerMeter).toFixed(2));
            setInitialVelocity((v) => +(v / feetPerMeter).toFixed(2));
        }
    };

    // Reset all values
    const reset = () => {
        setGravity(unit === "m/s²" ? 9.8 : +(9.8 * feetPerMeter).toFixed(2));
        setInitialVelocity(20);
        setLaunchAngle(45);
        setAirResistance(false);
        setHistory([]);
    };

    // Projectile motion calculations
    const gForCalc = unit === "m/s²" ? gravity : gravity / feetPerMeter;
    const vForCalc =
        unit === "m/s²" ? initialVelocity : initialVelocity / feetPerMeter;
    const angleRad = (launchAngle * Math.PI) / 180;

    let timeOfFlight, maxHeight, range;

    if (airResistance) {
        const t_step = 0.01;
        let vx = vForCalc * Math.cos(angleRad);
        let vy = vForCalc * Math.sin(angleRad);
        let x = 0;
        let y = 0;
        let t = 0;
        maxHeight = 0;

        while (y >= 0) {
            const v = Math.sqrt(vx * vx + vy * vy);
            const ax = -k * vx;
            const ay = -gForCalc - k * vy;

            vx += ax * t_step;
            vy += ay * t_step;
            x += vx * t_step;
            y += vy * t_step;
            t += t_step;

            if (y > maxHeight) maxHeight = y;
        }

        timeOfFlight = t;
        range = x;
    } else {
        timeOfFlight = (2 * vForCalc * Math.sin(angleRad)) / gForCalc;
        maxHeight =
            (Math.pow(vForCalc, 2) * Math.pow(Math.sin(angleRad), 2)) /
            (2 * gForCalc);
        range = (Math.pow(vForCalc, 2) * Math.sin(2 * angleRad)) / gForCalc;
    }

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                    styles.backButton,
                    { opacity: pressed ? 0.6 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
            >
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text style={styles.headerTitle}>Physics Visualizer</Text>
            </Pressable>

            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Gravity Input */}
                    <Text style={styles.label}>Gravity ({unit}):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        defaultValue={gravity.toFixed(2)}
                        onChangeText={onGravityChange}
                        accessibilityLabel="Gravity input"
                        accessibilityHint={`Enter gravity value between ${minGravity} and ${maxGravity} ${unit}`}
                    />

                    {/* Velocity Input */}
                    <Text style={styles.label}>
                        Initial Velocity ({unit.split("/")[0]}):
                    </Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        defaultValue={initialVelocity.toFixed(2)}
                        onChangeText={onVelocityChange}
                        accessibilityLabel="Initial velocity input"
                        accessibilityHint={`Enter initial velocity between ${minVelocity} and ${maxVelocity} ${
                            unit.split("/")[0]
                        }`}
                    />

                    {/* Launch Angle Input */}
                    <Text style={styles.label}>Launch Angle (°):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        defaultValue={launchAngle.toFixed(2)}
                        onChangeText={onAngleChange}
                        accessibilityLabel="Launch angle input"
                        accessibilityHint={`Enter launch angle between ${minAngle} and ${maxAngle} degrees`}
                    />

                    {/* Controls */}
                    <View style={styles.controlsRow}>
                        <Pressable
                            onPress={toggleUnit}
                            style={styles.unitToggle}
                        >
                            <Text style={styles.unitToggleText}>
                                Toggle Unit
                            </Text>
                        </Pressable>
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Air Resistance</Text>
                            <Switch
                                value={airResistance}
                                onValueChange={setAirResistance}
                            />
                        </View>
                    </View>

                    {/* Presets */}
                    <View style={styles.presetsRow}>
                        {PRESETS.map((preset) => (
                            <Pressable
                                key={preset.label}
                                style={styles.presetButton}
                                onPress={() =>
                                    setGravity(
                                        unit === "m/s²"
                                            ? preset.gravity
                                            : +(
                                                  preset.gravity * feetPerMeter
                                              ).toFixed(2)
                                    )
                                }
                                accessibilityRole="button"
                                accessibilityLabel={`Set gravity to ${preset.label}`}
                            >
                                <Text style={styles.presetText}>
                                    {preset.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Reset Button */}
                    <Pressable
                        style={styles.resetButton}
                        onPress={reset}
                        accessibilityRole="button"
                        accessibilityLabel="Reset all values"
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </Pressable>

                    {/* Results */}
                    <View style={styles.visualizationBox}>
                        <Text style={styles.visualizationText}>
                            Time of flight: {timeOfFlight.toFixed(2)} s
                        </Text>
                        <Text style={styles.visualizationText}>
                            Max height: {maxHeight.toFixed(2)}{" "}
                            {unit.split("/")[0]}
                        </Text>
                        <Text style={styles.visualizationText}>
                            Range: {range.toFixed(2)} {unit.split("/")[0]}
                        </Text>
                    </View>

                    {/* History */}
                    <Text style={styles.historyTitle}>
                        Gravity History (last 10 changes)
                    </Text>
                    <View style={[styles.historyContainer, { width: 300 }]}>
                        {history.length === 0 && (
                            <Text style={styles.historyEmpty}>
                                No changes yet
                            </Text>
                        )}
                        {history.map((val, i) => {
                            const height = (val / maxGravity) * 100;
                            return (
                                <View
                                    key={i}
                                    style={[
                                        styles.historyBar,
                                        {
                                            height: height,
                                            backgroundColor:
                                                Colors.PRIMARY || "#8E44AD",
                                        },
                                    ]}
                                    accessible
                                    accessibilityLabel={`Gravity value ${val.toFixed(
                                        2
                                    )} ${unit}`}
                                />
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
