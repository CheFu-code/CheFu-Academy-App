import Control from "@/component/MechanicsLab/Control";
import LogHistory from "@/component/MechanicsLab/LogHistory";
import { Colors } from "@/constant/Colors";
import useStopWatchTimer from "@/hooks/useStopWatchTimer";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MechanicsLab.styles";

export default function MechanicsLab() {
    const [velocity, setVelocity] = useState(10); // m/s
    const [angle, setAngle] = useState(45); // degrees
    const router = useRouter();
    const [projectileResults, setProjectileResults] = useState({
        timeOfFlight: 0,
        maxHeight: 0,
        range: 0,
    });
    const [projectileHistory, setProjectileHistory] = useState<
        Array<{
            velocity: number;
            angle: number;
            results: typeof projectileResults;
        }>
    >([]);

    // Simple harmonic motion states
    const [amplitude, setAmplitude] = useState(5); // meters
    const [frequency, setFrequency] = useState(1); // Hz
    const [shmPeriod, setShmPeriod] = useState(0);
    const [shmMaxVelocity, setShmMaxVelocity] = useState(0);
    const [shmHistory, setShmHistory] = useState<
        Array<{
            amplitude: number;
            frequency: number;
            period: number;
            maxVelocity: number;
        }>
    >([]);

    // Free fall simulation states
    const [height, setHeight] = useState(10); // meters
    const [mass, setMass] = useState(1); // kg
    const [gravity, setGravity] = useState(9.8); // m/s^2
    const [gravityOn, setGravityOn] = useState(true);

    const [freeFallResults, setFreeFallResults] = useState({
        timeToFall: 0,
        potentialEnergy: 0,
        kineticEnergy: 0,
    });
    const [freeFallHistory, setFreeFallHistory] = useState<
        Array<{ height: number; mass: number; results: typeof freeFallResults }>
    >([]);

    const { timer, running, startTimer, stopTimer, resetTimer } =
        useStopWatchTimer();

    const increment = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        val: number,
        step = 1
    ) => setter((prev) => Math.round((prev + step) * 10) / 10);

    const decrement = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        val: number,
        step = 1
    ) => setter((prev) => Math.max(0, Math.round((prev - step) * 10) / 10));

    // Projectile motion calculation
    const calculateProjectile = () => {
        if (velocity <= 0 || angle <= 0 || angle >= 90) {
            Alert.alert(
                "Invalid input",
                "Velocity > 0 and angle between 0 and 90 degrees."
            );
            return;
        }
        const g = 9.8;
        const angleRad = (angle * Math.PI) / 180;

        const timeOfFlight = (2 * velocity * Math.sin(angleRad)) / g;
        const maxHeight = (velocity ** 2 * Math.sin(angleRad) ** 2) / (2 * g);
        const range = (velocity ** 2 * Math.sin(2 * angleRad)) / g;

        const results = { timeOfFlight, maxHeight, range };
        setProjectileResults(results);
        setProjectileHistory((h) => [{ velocity, angle, results }, ...h]);
    };

    const resetProjectile = () => {
        setVelocity(10);
        setAngle(45);
        setProjectileResults({ timeOfFlight: 0, maxHeight: 0, range: 0 });
        setProjectileHistory([]);
    };

    // SHM calculation
    const calculateSHM = () => {
        if (amplitude <= 0 || frequency <= 0) {
            Alert.alert(
                "Invalid input",
                "Amplitude and frequency must be positive."
            );
            return;
        }
        const period = 1 / frequency;
        const maxVelocity = 2 * Math.PI * frequency * amplitude;
        setShmPeriod(period);
        setShmMaxVelocity(maxVelocity);
        setShmHistory((h) => [
            ...h,
            { amplitude, frequency, period, maxVelocity },
        ]);
    };

    const resetSHM = () => {
        setAmplitude(5);
        setFrequency(1);
        setShmPeriod(0);
        setShmMaxVelocity(0);
        setShmHistory([]);
    };

    // Free fall calculation
    const calculateFreeFall = () => {
        if (height <= 0 || mass <= 0 || gravity < 0) {
            Alert.alert(
                "Invalid input",
                "Height and mass must be positive; gravity cannot be negative."
            );
            return;
        }
        if (!gravityOn) {
            Alert.alert("Gravity Off", "Gravity is off, object will not fall.");
            setFreeFallResults({
                timeToFall: Infinity,
                potentialEnergy: mass * gravity * height,
                kineticEnergy: 0,
            });
            return;
        }
        const timeToFall = Math.sqrt((2 * height) / gravity);
        const potentialEnergy = mass * gravity * height;
        const kineticEnergy = 0.5 * mass * (gravity * timeToFall) ** 2; // v = g*t

        setFreeFallResults({ timeToFall, potentialEnergy, kineticEnergy });
        setFreeFallHistory((h) => [
            {
                height,
                mass,
                results: { timeToFall, potentialEnergy, kineticEnergy },
            },
            ...h,
        ]);
    };

    const resetFreeFall = () => {
        setHeight(10);
        setMass(1);
        setGravity(9.8);
        setGravityOn(true);
        setFreeFallResults({
            timeToFall: 0,
            potentialEnergy: 0,
            kineticEnergy: 0,
        });
        setFreeFallHistory([]);
        stopTimer();
        resetTimer();
    };

    // Toggle gravity
    const toggleGravity = () => {
        setGravityOn((on) => !on);
    };

    return (
        <View style={[styles.container, { padding: 16 }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign name="left" color={"white"} size={24} />
                <Text style={styles.header}>Mechanics Lab</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Projectile Motion */}
                <View style={styles.section}>
                    <Text style={styles.title}>Projectile Motion</Text>

                    <Control
                        label="Initial Velocity (m/s)"
                        value={velocity}
                        setValue={setVelocity}
                        step={0.5}
                        min={0}
                        max={100}
                    />
                    <Control
                        label="Launch Angle (°)"
                        value={angle}
                        setValue={setAngle}
                        step={1}
                        min={0}
                        max={90}
                    />

                    <TouchableOpacity
                        onPress={calculateProjectile}
                        style={styles.calcButton}
                    >
                        <Text style={styles.calcButtonText}>
                            Calculate Projectile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={resetProjectile}
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetButtonText}>
                            Reset Projectile
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.resultsBox}>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Time of Flight:{" "}
                            {projectileResults.timeOfFlight.toFixed(2)} s
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Max Height: {projectileResults.maxHeight.toFixed(2)}{" "}
                            m
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Range: {projectileResults.range.toFixed(2)} m
                        </Text>
                    </View>

                    <LogHistory
                        title="Projectile History"
                        data={projectileHistory}
                        renderItem={(item, i) => (
                            <Text key={i}>
                                V: {item.velocity} m/s, Angle: {item.angle}° →
                                Time: {item.results.timeOfFlight.toFixed(2)}s,
                                Range: {item.results.range.toFixed(2)}m
                            </Text>
                        )}
                    />
                </View>

                {/* Simple Harmonic Motion */}
                <View style={styles.section}>
                    <Text style={styles.title}>Simple Harmonic Motion</Text>

                    <Control
                        label="Amplitude (m)"
                        value={amplitude}
                        setValue={setAmplitude}
                        step={0.5}
                        min={0}
                        max={100}
                    />
                    <Control
                        label="Frequency (Hz)"
                        value={frequency}
                        setValue={setFrequency}
                        step={0.1}
                        min={0}
                        max={100}
                    />

                    <TouchableOpacity
                        onPress={calculateSHM}
                        style={styles.calcButton}
                    >
                        <Text style={styles.calcButtonText}>Calculate SHM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={resetSHM}
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetButtonText}>Reset SHM</Text>
                    </TouchableOpacity>

                    <View style={styles.resultsBox}>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Period: {shmPeriod.toFixed(2)} s
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Max Velocity: {shmMaxVelocity.toFixed(2)} m/s
                        </Text>
                    </View>

                    <LogHistory
                        title="SHM History"
                        data={shmHistory}
                        renderItem={(item, i) => (
                            <Text key={i}>
                                Amp: {item.amplitude} m, Freq: {item.frequency}{" "}
                                Hz → Period: {item.period.toFixed(2)}s, Max V:{" "}
                                {item.maxVelocity.toFixed(2)} m/s
                            </Text>
                        )}
                    />
                </View>

                {/* Free Fall Simulation */}
                <View style={styles.section}>
                    <Text style={styles.title}>Free Fall Simulation</Text>

                    <Control
                        label="Height (m)"
                        value={height}
                        setValue={setHeight}
                        step={0.5}
                        min={0}
                        max={1000}
                    />
                    <Control
                        label="Mass (kg)"
                        value={mass}
                        setValue={setMass}
                        step={0.1}
                        min={0}
                        max={1000}
                    />
                    <Control
                        label="Gravity (m/s²)"
                        value={gravity}
                        setValue={setGravity}
                        step={0.1}
                        min={0}
                        max={20}
                    />

                    <View style={styles.controlRow}>
                        <Text style={styles.label}>
                            Gravity: {gravityOn ? "On" : "Off"}
                        </Text>
                        <TouchableOpacity
                            onPress={toggleGravity}
                            style={styles.toggleButton}
                        >
                            <Text style={styles.buttonText}>
                                {gravityOn ? "Turn Off" : "Turn On"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={calculateFreeFall}
                        style={styles.calcButton}
                    >
                        <Text style={styles.calcButtonText}>
                            Calculate Free Fall
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={resetFreeFall}
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetButtonText}>
                            Reset Free Fall
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.resultsBox}>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Time to Fall:{" "}
                            {freeFallResults.timeToFall === Infinity
                                ? "∞ (No fall)"
                                : freeFallResults.timeToFall.toFixed(2)}{" "}
                            s
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Potential Energy:{" "}
                            {freeFallResults.potentialEnergy.toFixed(2)} J
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Kinetic Energy:{" "}
                            {freeFallResults.kineticEnergy.toFixed(2)} J
                        </Text>
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit",
                            }}
                        >
                            Energy Conservation:{" "}
                            {Math.abs(
                                freeFallResults.potentialEnergy -
                                    freeFallResults.kineticEnergy
                            ) < 0.1 ? (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={16}
                                    color={Colors.GREEN}
                                />
                            ) : (
                                <Ionicons
                                    name="close-circle"
                                    size={16}
                                    color={Colors.RED}
                                />
                            )}
                        </Text>
                    </View>

                    {/* Stopwatch Timer */}
                    <View
                        style={[
                            styles.section,
                            { marginTop: 10, backgroundColor: "#333" },
                        ]}
                    >
                        <Text style={[styles.title, { fontSize: 18 }]}>
                            Free Fall Stopwatch Timer
                        </Text>
                        <Text
                            style={[
                                styles.label,
                                { fontSize: 24, textAlign: "center" },
                            ]}
                        >
                            {timer.toFixed(1)} s
                        </Text>
                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                onPress={startTimer}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={stopTimer}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Stop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={resetTimer}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                marginTop: 10,
                                color: "#ccc",
                                fontStyle: "italic",
                            }}
                        >
                            Use stopwatch to time actual free fall experiment.
                        </Text>
                    </View>

                    <LogHistory
                        title="Free Fall History"
                        data={freeFallHistory}
                        renderItem={(item, i) => (
                            <Text
                                style={{ color: "#fff", fontFamily: "outfit" }}
                                key={i}
                            >
                                Height: {item.height} m, Mass: {item.mass} kg →
                                Time: {item.results.timeToFall.toFixed(2)} s
                            </Text>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
