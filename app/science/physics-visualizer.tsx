import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    AccessibilityInfo,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    Vibration,
    View,
} from "react-native";

const PRESETS = [
    { label: "Earth", gravity: 9.8 },
    { label: "Moon", gravity: 1.62 },
    { label: "Mars", gravity: 3.71 },
    { label: "Jupiter", gravity: 24.79 },
];

const DEBOUNCE_DELAY = 100; // ms

export default function PhysicsVisualizer() {
    const [gravity, setGravity] = useState(9.8);
    const [unit, setUnit] = useState("m/s²");
    const [history, setHistory] = useState<number[]>([]);
    const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);

    const sliderWidth = 300;
    const min = 0;
    const max = 30;
    const step = 0.1;

    // Debounce gravity updates to avoid spamming setState
    const debounceTimeout = useRef<number | null>(null);

    // Accessibility status listener
    useEffect(() => {
        AccessibilityInfo.isScreenReaderEnabled().then(setAccessibilityEnabled);
    }, []);

    const updateGravity = (val: number) => {
        val = Math.max(min, Math.min(max, val));
        val = Math.round(val / step) * step;

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            setGravity(val);
            // Save history (max 10)
            setHistory((h) => [val, ...h].slice(0, 10));
            if (Platform.OS !== "web") Vibration.vibrate(10);
        }, DEBOUNCE_DELAY);
    };

    const pan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let deltaX = gestureState.moveX - gestureState.x0;
                let ratio = deltaX / sliderWidth;
                let newVal = gravity + ratio * (max - min);
                updateGravity(newVal);
            },
            onPanResponderRelease: () => {},
        })
    ).current;

    const thumbLeft = ((gravity - min) / (max - min)) * sliderWidth;

    // Toggle units conversion
    const toggleUnit = () => {
        if (unit === "m/s²") {
            setUnit("ft/s²");
            setGravity((g) => +(g * 3.28084).toFixed(2));
        } else {
            setUnit("m/s²");
            setGravity((g) => +(g / 3.28084).toFixed(2));
        }
    };

    // Reset gravity to Earth's default in current unit
    const resetGravity = () => {
        setGravity(unit === "m/s²" ? 9.8 : +(9.8 * 3.28084).toFixed(2));
        setHistory([]);
    };

    // Calculate projectile motion for 45° launch at initial velocity 20 m/s or ft/s depending on unit
    const initialVelocity = 20;
    const gForCalc = unit === "m/s²" ? gravity : gravity / 3.28084; // convert to m/s² for calc

    const timeOfFlight =
        (2 * initialVelocity * Math.sin(Math.PI / 4)) / gForCalc;
    const maxHeight =
        (Math.pow(initialVelocity, 2) * Math.pow(Math.sin(Math.PI / 4), 2)) /
        (2 * gForCalc);
    const range =
        (Math.pow(initialVelocity, 2) * Math.sin(Math.PI / 2)) / gForCalc;

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
                <Text
                    style={styles.label}
                    accessibilityRole="adjustable"
                    accessibilityValue={{ min, max, now: Math.round(gravity * 100) }}
                    accessibilityHint="Adjust gravity value"
                    accessibilityActions={[
                        { name: "increment", label: "Increase gravity" },
                        { name: "decrement", label: "Decrease gravity" },
                    ]}
                    onAccessibilityAction={(event) => {
                        if (event.nativeEvent.actionName === "increment")
                            updateGravity(gravity + step);
                        else if (event.nativeEvent.actionName === "decrement")
                            updateGravity(gravity - step);
                    }}
                >
                    Gravity: {gravity.toFixed(2)} {unit}
                </Text>

                <Pressable onPress={toggleUnit} style={styles.unitToggle}>
                    <Text style={styles.unitToggleText}>
                        Toggle Unit (m/s² ⇄ ft/s²)
                    </Text>
                </Pressable>

                <View
                    style={[styles.slider, { width: sliderWidth }]}
                    {...pan.panHandlers}
                >
                    <View style={[styles.track, { width: sliderWidth }]} />
                    <View style={[styles.filledTrack, { width: thumbLeft }]} />
                    <View style={[styles.thumb, { left: thumbLeft - 12 }]} />
                </View>

                <View style={styles.presetsRow}>
                    {PRESETS.map((preset) => (
                        <Pressable
                            key={preset.label}
                            style={styles.presetButton}
                            onPress={() =>
                                setGravity(
                                    unit === "m/s²"
                                        ? preset.gravity
                                        : +(preset.gravity * 3.28084).toFixed(2)
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

                <Pressable
                    style={styles.resetButton}
                    onPress={resetGravity}
                    accessibilityRole="button"
                    accessibilityLabel="Reset gravity"
                >
                    <Text style={styles.resetButtonText}>Reset Gravity</Text>
                </Pressable>

                <View style={styles.visualizationBox}>
                    <Text style={styles.visualizationText}>
                        Projectile motion at 45° launch, initial velocity:{" "}
                        {initialVelocity} {unit}
                    </Text>
                    <Text style={styles.visualizationText}>
                        Time of flight: {timeOfFlight.toFixed(2)} s
                    </Text>
                    <Text style={styles.visualizationText}>
                        Max height: {maxHeight.toFixed(2)} {unit}
                    </Text>
                    <Text style={styles.visualizationText}>
                        Range: {range.toFixed(2)} {unit}
                    </Text>
                </View>

                <Text style={styles.historyTitle}>
                    Gravity History (last 10 changes)
                </Text>
                <View style={[styles.historyContainer, { width: sliderWidth }]}>
                    {history.length === 0 && (
                        <Text style={styles.historyEmpty}>No changes yet</Text>
                    )}
                    {history.map((val, i) => {
                        const height = (val / max) * 100;
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        paddingTop: Platform.OS === "android" ? 40 : 60,
        paddingHorizontal: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.WHITE,
        marginLeft: 12,
    },
    content: {
        flex: 1,
        alignItems: "center",
    },
    label: {
        color: Colors.WHITE,
        fontSize: 18,
        marginBottom: 8,
    },
    unitToggle: {
        marginBottom: 20,
        backgroundColor: Colors.PRIMARY || "#8E44AD",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    unitToggleText: {
        color: Colors.WHITE,
        fontWeight: "600",
        fontSize: 16,
    },
    slider: {
        height: 40,
        justifyContent: "center",
        marginBottom: 24,
    },
    track: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.GRAY || "#ddd",
        position: "absolute",
        left: 0,
    },
    filledTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.PRIMARY || "#8E44AD",
        position: "absolute",
        left: 0,
    },
    thumb: {
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY || "#8E44AD",
        top: 8,
    },
    presetsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: 320,
        marginBottom: 16,
    },
    presetButton: {
        backgroundColor: Colors.BLACK || "#222",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.PRIMARY || "#8E44AD",
    },
    presetText: {
        color: Colors.WHITE,
        fontWeight: "600",
    },
    resetButton: {
        backgroundColor: Colors.PRIMARY || "#8E44AD",
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginBottom: 24,
    },
    resetButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
    },
    visualizationBox: {
        marginTop: 12,
        width: 320,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.PRIMARY || "#8E44AD",
        padding: 16,
        backgroundColor: Colors.BLACK || "#222",
    },
    visualizationText: {
        color: Colors.WHITE,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 6,
    },
    historyTitle: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
    },
    historyContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        height: 100,
        gap: 4,
    },
    historyBar: {
        width: 20,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    historyEmpty: {
        color: Colors.GRAY,
        fontStyle: "italic",
    },
});
