import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    Vibration,
    View,
    ViewStyle,
} from "react-native";
import { styles } from "../../styles/CircuitSimulator.styles";

export default function CircuitSimulator() {
    // Electrical state (units: V, ohm, μF)
    const [batteryV, setBatteryV] = useState(9); // volts
    const [internalR, setInternalR] = useState(1); // ohms
    const [resistance, setResistance] = useState(10); // ohms
    const [capacitance_uF, setCapacitance_uF] = useState(100); // microfarads
    const [modeSeries, setModeSeries] = useState(true); 
    const [ledForwardV, setLedForwardV] = useState(2); // V drop for LED
    const [ledOn, setLedOn] = useState(true);

    // Capacitor simulation state
    const [capVoltage, setCapVoltage] = useState(0); // V across capacitor
    const [isCharging, setIsCharging] = useState(false); // auto-charge simulation toggle
    const [isDischarging, setIsDischarging] = useState(false); // auto-discharge toggle
    const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const SIM_STEP_MS = 100; // update every 100ms

    // History / logs
    const [history, setHistory] = useState<string[]>([]);

    // Utility conversions
    const C = Math.max(1e-9, capacitance_uF / 1e6); // convert μF to F (protect against zero)
    const totalR = resistance + internalR; // total series resistance
    const timeConstant = totalR * C; // seconds

    // Instantaneous current if capacitor absent (steady DC): I = V / R_total
    const steadyCurrent = batteryV / Math.max(0.0001, totalR); // A

    // LED current estimate: if LED in series with R, I_led = max(0, (V - Vled) / R_total)
    const ledCurrent = ledOn
        ? Math.max(0, (batteryV - ledForwardV) / Math.max(0.0001, totalR))
        : 0;
    // brightness: clamp 0..1 mapped from current (0..50mA typical)
    const ledBrightness = Math.min(1, ledCurrent / 0.05);

    // Energy stored in capacitor: 0.5 * C * V^2 (Joules)
    const capEnergy = 0.5 * C * capVoltage * capVoltage;

    // Battery delivered power (approx): P = V * I (use I through resistor/cap depending on state)
    const instantaneousCurrent = (() => {
        // If actively charging/discharging, approximate current based on RC equation:
        // I = (Vbattery - Vc)/R_total when charging, and I = Vc / R_total when discharging
        if (isCharging)
            return Math.abs((batteryV - capVoltage) / Math.max(0.0001, totalR));
        if (isDischarging)
            return Math.abs(capVoltage / Math.max(0.0001, totalR));
        // otherwise steady current (resistor only)
        return steadyCurrent;
    })();

    const batteryPower = batteryV * instantaneousCurrent;

    // Helpers to log
    function pushLog(msg: string) {
        setHistory((h) =>
            [`${new Date().toLocaleTimeString()} — ${msg}`, ...h].slice(0, 100)
        );
    }

    // Adjustment helpers (avoid negative values)
    function inc(setter: (v: number) => void, v: number, step = 1) {
        setter(Math.round((v + step) * 100) / 100);
    }
    function dec(setter: (v: number) => void, v: number, step = 1) {
        setter(Math.round(Math.max(0, v - step) * 100) / 100);
    }

    // Reset
    function resetAll() {
        setBatteryV(9);
        setInternalR(1);
        setResistance(10);
        setCapacitance_uF(100);
        setCapVoltage(0);
        setIsCharging(false);
        setIsDischarging(false);
        setLedOn(true);
        setHistory([]);
        pushLog("Reset all values");
    }

    // Simulation loop (numerical Euler for charging/discharging)
    useEffect(() => {
        // clear old interval
        if (simIntervalRef.current) {
            clearInterval(simIntervalRef.current);
            simIntervalRef.current = null;
        }

        // only run loop if charging or discharging
        if (!isCharging && !isDischarging) return;

        simIntervalRef.current = setInterval(() => {
            setCapVoltage((prevVc) => {
                const dt = SIM_STEP_MS / 1000; // seconds
                // R_total (series) used
                const R = totalR;
                if (isCharging) {
                    // Vc' = (Vb - Vc) / (R*C)
                    const dv = ((batteryV - prevVc) / (R * C)) * dt;
                    const newVc = prevVc + dv;
                    // Bound Vc ≤ batteryV
                    const bounded = Math.min(newVc, batteryV);
                    // vibration/alert when near boiling? (not relevant here)
                    if (bounded >= batteryV * 0.999) {
                        // nearly fully charged
                        Vibration.vibrate?.(50);
                        pushLog("Capacitor reached ~100% of battery voltage");
                        setIsCharging(false); // auto-stop
                    }
                    return bounded;
                } else {
                    // discharging into resistor: Vc' = - Vc / (R*C)
                    const dv = -(prevVc / (R * C)) * dt;
                    const newVc = Math.max(0, prevVc + dv);
                    if (newVc <= 1e-3) {
                        pushLog("Capacitor fully discharged");
                        setIsDischarging(false);
                    }
                    return newVc;
                }
            });
        }, SIM_STEP_MS);

        return () => {
            if (simIntervalRef.current) {
                clearInterval(simIntervalRef.current);
                simIntervalRef.current = null;
            }
        };
        // re-run whenever charging/discharging state, batteryV, R, C change
    }, [isCharging, isDischarging, batteryV, totalR, C]);

    // Derived: estimate time to reach X% charge for RC charging: t = -RC * ln(1 - X)
    function timeToPercent(percent = 0.99) {
        if (percent <= 0 || percent >= 1) return Infinity;
        const t = -timeConstant * Math.log(1 - percent);
        return t; // seconds
    }

    // Manual charge/discharge single-step (useful for users who don't want continuous)
    function manualChargeStep() {
        // one step of Euler
        const dt = SIM_STEP_MS / 1000;
        const R = totalR;
        setCapVoltage((prev) => {
            const dv = ((batteryV - prev) / (R * C)) * dt;
            const bounded = Math.min(prev + dv, batteryV);
            pushLog(`Manual charge step → Vc=${bounded.toFixed(3)}V`);
            return bounded;
        });
    }
    function manualDischargeStep() {
        const dt = SIM_STEP_MS / 1000;
        const R = totalR;
        setCapVoltage((prev) => {
            const dv = -(prev / (R * C)) * dt;
            const bounded = Math.max(prev + dv, 0);
            pushLog(`Manual discharge step → Vc=${bounded.toFixed(3)}V`);
            return bounded;
        });
    }

    // Quick simulation shortcuts (charge to X% instantly approximate)
    function quickChargeTo(percent = 0.63) {
        // for RC charging, Vc = V*(1 - e^{-t/RC}); invert to approximate t needed
        const t = timeConstant * -Math.log(1 - percent);
        // approximate final Vc by formula V*(1 - e^{-t/RC}) which should equal percent*V
        const target = batteryV * percent;
        setCapVoltage(target);
        pushLog(
            `Quick charged capacitor to ${(percent * 100).toFixed(
                0
            )}% (~${t.toFixed(1)}s)`
        );
    }

    // Simple harmless safeguards (no divide by zero)
    const safeTimeConst = isFinite(timeConstant) ? timeConstant : 0;

    // visual charge percent
    const capPercent = Math.max(
        0,
        Math.min(1, batteryV === 0 ? 0 : capVoltage / batteryV)
    );
    const widthPercent = `${(capPercent * 100).toFixed(
        1
    )}%` as ViewStyle["width"];
    const navigation = useNavigation();

    return (
        <View style={[styles.screen, { flex: 1, padding: 14 }]}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
                style={styles.backButton}
            >
                <AntDesign name="left" size={24} color="white" />
                <Text style={styles.title}>Circuit Simulator</Text>
            </TouchableOpacity>
            <ScrollView style={styles.screen}>
                {/* Diagram and mode */}
                <View style={styles.box}>
                    <Text style={styles.sub}>
                        Mode: {modeSeries ? "SERIES" : "PARALLEL"}
                    </Text>
                    <TouchableOpacity
                        style={[styles.smallBtn, styles.toggle]}
                        onPress={() => {
                            setModeSeries((s) => !s);
                            pushLog(
                                `Mode set to ${
                                    modeSeries ? "PARALLEL" : "SERIES"
                                }`
                            );
                        }}
                    >
                        <Text style={styles.smallBtnText}>Toggle Mode</Text>
                    </TouchableOpacity>

                    <Text style={styles.diagram}>
                        {modeSeries
                            ? "Battery — Rint — R — Capacitor"
                            : "Battery branches → R // C (conceptual)"}
                    </Text>
                </View>

                {/* Battery & R controls */}
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Battery (V)</Text>
                        <Text style={styles.big}>{batteryV.toFixed(2)} V</Text>
                        <View style={styles.controls}>
                            <TouchableOpacity
                                onPress={() => dec(setBatteryV, batteryV, 1)}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>−</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => inc(setBatteryV, batteryV, 1)}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.label}>Internal R</Text>
                        <Text style={styles.big}>{internalR.toFixed(2)} Ω</Text>
                        <View style={styles.controls}>
                            <TouchableOpacity
                                onPress={() =>
                                    dec(setInternalR, internalR, 0.5)
                                }
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>−</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    inc(setInternalR, internalR, 0.5)
                                }
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.label}>Resistance (R)</Text>
                        <Text style={styles.big}>
                            {resistance.toFixed(2)} Ω
                        </Text>
                        <View style={styles.controls}>
                            <TouchableOpacity
                                onPress={() =>
                                    dec(setResistance, resistance, 1)
                                }
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>−</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    inc(setResistance, resistance, 1)
                                }
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Capacitance and capacitor UI */}
                <View style={styles.box}>
                    <Text style={styles.label}>Capacitance</Text>
                    <Text style={styles.big}>
                        {capacitance_uF.toFixed(1)} μF
                    </Text>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            onPress={() =>
                                dec(setCapacitance_uF, capacitance_uF, 10)
                            }
                            style={styles.btn}
                        >
                            <Text style={styles.btnText}>−</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                inc(setCapacitance_uF, capacitance_uF, 10)
                            }
                            style={styles.btn}
                        >
                            <Text style={styles.btnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.chargeBar]}>
                        <View
                            style={[styles.chargeFill, { width: widthPercent }]}
                        />
                    </View>
                    <Text style={styles.smallText}>
                        Capacitor Vc: {capVoltage.toFixed(3)} V (
                        {(capPercent * 100).toFixed(1)}%)
                    </Text>
                    <Text style={styles.smallText}>
                        Energy stored: {capEnergy.toFixed(4)} J
                    </Text>
                    <Text style={styles.smallText}>
                        Time constant τ = R·C ≈ {safeTimeConst.toFixed(3)} s
                    </Text>

                    <View
                        style={{ flexDirection: "row", marginTop: 8, gap: 8 }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.actionBtn,
                                isCharging && styles.activeBtn,
                            ]}
                            onPress={() => {
                                setIsCharging((s) => {
                                    const next = !s;
                                    setIsDischarging(false);
                                    if (next) pushLog("Auto-charge started");
                                    else pushLog("Auto-charge stopped");
                                    return next;
                                });
                            }}
                        >
                            <Text style={styles.actionText}>
                                {isCharging
                                    ? "Stop Auto-Charge"
                                    : "Start Auto-Charge"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionBtn,
                                isDischarging && styles.activeBtn,
                            ]}
                            onPress={() => {
                                setIsDischarging((s) => {
                                    const next = !s;
                                    setIsCharging(false);
                                    if (next) pushLog("Auto-discharge started");
                                    else pushLog("Auto-discharge stopped");
                                    return next;
                                });
                            }}
                        >
                            <Text style={styles.actionText}>
                                {isDischarging
                                    ? "Stop Auto-Discharge"
                                    : "Start Auto-Discharge"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <TouchableOpacity
                            style={styles.smallAction}
                            onPress={manualChargeStep}
                        >
                            <Text style={styles.smallActionText}>
                                Manual +step
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.smallAction}
                            onPress={manualDischargeStep}
                        >
                            <Text style={styles.smallActionText}>
                                Manual −step
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.smallAction}
                            onPress={() => quickChargeTo(0.632)}
                        >
                            <Text style={styles.smallActionText}>
                                Quick to 63%
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LED simulation */}
                <View style={styles.box}>
                    <Text style={styles.label}>LED</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={styles.smallText}>
                            Forward V ≈ {ledForwardV.toFixed(2)} V
                        </Text>
                        <TouchableOpacity
                            onPress={() => setLedOn((s) => !s)}
                            style={[
                                styles.smallBtn,
                                ledOn ? styles.activeBtn : null,
                            ]}
                        >
                            <Text style={styles.smallBtnText}>
                                {ledOn ? "LED ON" : "LED OFF"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ledPreview}>
                        <View
                            style={[
                                styles.ledBubble,
                                { opacity: ledBrightness },
                            ]}
                        />
                        <Text style={styles.smallText}>
                            I ≈ {(ledCurrent * 1000).toFixed(2)} mA • Brightness{" "}
                            {(ledBrightness * 100).toFixed(0)}%
                        </Text>
                    </View>
                </View>

                {/* Calculations & power */}
                <View style={styles.box}>
                    <Text style={styles.label}>Instantaneous Calculations</Text>
                    <Text style={styles.smallText}>
                        I (instant) = {instantaneousCurrent.toFixed(4)} A
                    </Text>
                    <Text style={styles.smallText}>
                        Battery power ≈ {batteryPower.toFixed(3)} W
                    </Text>
                    <Text style={styles.smallText}>
                        Steady resistor current (no C) ={" "}
                        {steadyCurrent.toFixed(4)} A
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.rowControls}>
                    <TouchableOpacity
                        style={styles.resetBtn}
                        onPress={resetAll}
                    >
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => {
                            setHistory([]);
                            pushLog("Cleared history");
                        }}
                    >
                        <Text style={styles.resetText}>Clear History</Text>
                    </TouchableOpacity>
                </View>

                {/* History */}
                <View style={styles.box}>
                    <Text style={styles.label}>History (recent)</Text>
                    {history.length === 0 ? (
                        <Text style={styles.smallText}>No events yet</Text>
                    ) : (
                        history.slice(0, 10).map((h, i) => (
                            <Text key={i} style={styles.smallText}>
                                {h}
                            </Text>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}
