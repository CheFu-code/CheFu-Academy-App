import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../../styles/DataAnalysis.styles";

export default function DataAnalysis() {
    const [data, setData] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [csvInput, setCsvInput] = useState("");
    const [filterMin, setFilterMin] = useState("");
    const [filterMax, setFilterMax] = useState("");
    const [showOutliers, setShowOutliers] = useState(false);
    const router = useRouter();

    // Add single number
    const addDataPoint = () => {
        const num = parseFloat(inputValue);
        if (isNaN(num)) {
            Alert.alert("Invalid Input", "Please enter a valid number.");
            return;
        }
        setData((d) => [...d, num]);
        setInputValue("");
    };

    // Remove last point
    const removeLastDataPoint = () => {
        setData((d) => (d.length ? d.slice(0, -1) : d));
    };

    // Clear all data
    const clearData = () => {
        setData([]);
    };

    // Parse CSV input into numbers
    const importCSV = () => {
        const numbers = csvInput
            .split(/[\s,;\n]+/)
            .map((s) => parseFloat(s.trim()))
            .filter((n) => !isNaN(n));
        if (!numbers.length) {
            Alert.alert(
                "No valid numbers found",
                "Please input valid numeric CSV data."
            );
            return;
        }
        setData(numbers);
        setCsvInput("");
        Alert.alert("CSV Imported", `Imported ${numbers.length} data points.`);
    };

    // Export current data as CSV string
    const exportCSV = () => {
        if (!data.length) {
            Alert.alert("No data to export", "Add some data points first.");
            return;
        }
        Alert.alert("Export CSV", "Copy this data:\n\n" + data.join(", "));
    };

    // Filtered data by min/max
    const filteredData = useMemo(() => {
        let arr = [...data];
        const min = parseFloat(filterMin);
        const max = parseFloat(filterMax);
        if (!isNaN(min)) arr = arr.filter((x) => x >= min);
        if (!isNaN(max)) arr = arr.filter((x) => x <= max);
        return arr;
    }, [data, filterMin, filterMax]);

    // Sort ascending/descending
    const sortAsc = () => setData((d) => [...d].sort((a, b) => a - b));
    const sortDesc = () => setData((d) => [...d].sort((a, b) => b - a));

    // Stats calculations
    const count = filteredData.length;
    const sum = filteredData.reduce((a, b) => a + b, 0);
    const mean = count ? sum / count : 0;

    const median = (() => {
        if (!count) return 0;
        const sorted = [...filteredData].sort((a, b) => a - b);
        const mid = Math.floor(count / 2);
        return count % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    })();

    // Mode with freq count
    const modeData = (() => {
        if (!count) return [];
        const freqMap = new Map<number, number>();
        filteredData.forEach((n) => freqMap.set(n, (freqMap.get(n) || 0) + 1));
        let maxFreq = 0;
        freqMap.forEach((freq) => {
            if (freq > maxFreq) maxFreq = freq;
        });
        if (maxFreq === 1) return []; // no mode
        const modes = Array.from(freqMap.entries())
            .filter(([_, freq]) => freq === maxFreq)
            .map(([num]) => num);
        return modes;
    })();

    const minVal = count ? Math.min(...filteredData) : 0;
    const maxVal = count ? Math.max(...filteredData) : 0;

    const stdDev = (() => {
        if (!count) return 0;
        const variance =
            filteredData.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
            count;
        return Math.sqrt(variance);
    })();

    // Outlier detection with IQR
    const outliers = (() => {
        if (!count) return [];
        const sorted = [...filteredData].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(count / 4)];
        const q3 = sorted[Math.floor((count * 3) / 4)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        return filteredData.filter((v) => v < lowerBound || v > upperBound);
    })();

    // Normalize data (min-max scaling to 0-1)
    const normalizeData = () => {
        if (!count) return;
        const min = Math.min(...data);
        const max = Math.max(...data);
        if (min === max) return;
        const normalized = data.map((v) => (v - min) / (max - min));
        setData(normalized);
    };

    // Standardize data (z-score)
    const standardizeData = () => {
        if (!count) return;
        const m = mean;
        const sd = stdDev;
        if (sd === 0) return;
        const standardized = data.map((v) => (v - m) / sd);
        setData(standardized);
    };

    // Text histogram bars
    const histogram = (() => {
        if (!count) return "No data";
        const bins: Record<number, number> = {};
        filteredData.forEach((v) => {
            const bin = Math.floor(v);
            bins[bin] = (bins[bin] || 0) + 1;
        });
        const entries = Object.entries(bins).sort(([a], [b]) => +a - +b);
        return entries
            .map(([bin, freq]) => `${bin}: ${"█".repeat(freq)} (${freq})`)
            .join("\n");
    })();


    return (
        <View style={[styles.container, { padding: 16 }]}>

            
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign name="left" color={"white"} size={24} />
                <Text style={styles.header}>Data Analysis</Text>


            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Manual Data Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add data point (number)"
                        keyboardType="numeric"
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={addDataPoint}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* CSV Import */}
                <Text style={styles.label}>
                    Import CSV (comma, space, newline separated):
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            height: 80,
                            marginBottom: 10,
                            textAlignVertical: "top",
                        },
                    ]}
                    multiline
                    placeholder="e.g. 5, 7, 8, 9, 10"
                    value={csvInput}
                    onChangeText={setCsvInput}
                />
                <TouchableOpacity style={styles.button} onPress={importCSV}>
                    <Text style={styles.buttonText}>Import CSV</Text>
                </TouchableOpacity>

                {/* Export CSV */}
                <TouchableOpacity
                    style={[styles.button, { marginTop: 12 }]}
                    onPress={exportCSV}
                >
                    <Text style={styles.buttonText}>
                        Export CSV (Copy manually)
                    </Text>
                </TouchableOpacity>

                {/* Sorting & Filtering */}
                <View style={styles.filterRow}>
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Filter min"
                        keyboardType="numeric"
                        value={filterMin}
                        onChangeText={setFilterMin}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Filter max"
                        keyboardType="numeric"
                        value={filterMax}
                        onChangeText={setFilterMax}
                    />
                </View>
                <View style={styles.controlsRow}>
                    <TouchableOpacity style={styles.button} onPress={sortAsc}>
                        <Text style={styles.buttonText}>Sort Asc</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={sortDesc}>
                        <Text style={styles.buttonText}>Sort Desc</Text>
                    </TouchableOpacity>
                </View>

                {/* Data Controls */}
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={removeLastDataPoint}
                    >
                        <Text style={styles.buttonText}>Remove Last</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={clearData}>
                        <Text style={styles.buttonText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {/* Transformations */}
                <Text style={styles.label}>Transformations:</Text>
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={normalizeData}
                    >
                        <Text style={styles.buttonText}>Normalize (0-1)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={standardizeData}
                    >
                        <Text style={styles.buttonText}>
                            Standardize (Z-score)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Outliers toggle */}
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: showOutliers
                                    ? "#d32f2f"
                                    : "#ffcc00",
                            },
                        ]}
                        onPress={() => setShowOutliers((v) => !v)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: showOutliers ? "#fff" : "#000" },
                            ]}
                        >
                            {showOutliers ? "Hide Outliers" : "Show Outliers"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Data Points */}
                <View style={styles.section}>
                    <Text style={styles.subHeader}>
                        Data Points ({filteredData.length}){" "}
                        {showOutliers && `- Outliers: ${outliers.length}`}
                    </Text>
                    <Text style={styles.dataText}>
                        {filteredData
                            .map((num) =>
                                showOutliers && outliers.includes(num)
                                    ? `*${num}*`
                                    : `${num}`
                            )
                            .join(", ") || "No data"}
                    </Text>
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Statistics</Text>
                    <Text style={styles.text}>Count: {count}</Text>
                    <Text style={styles.text}>Sum: {sum.toFixed(2)}</Text>
                    <Text style={styles.text}>Mean: {mean.toFixed(2)}</Text>
                    <Text style={styles.text}>Median: {median.toFixed(2)}</Text>
                    <Text style={styles.text}>
                        Mode: {modeData.length ? modeData.join(", ") : "None"}
                    </Text>
                    <Text style={styles.text}>Min: {minVal}</Text>
                    <Text style={styles.text}>Max: {maxVal}</Text>
                    <Text style={styles.text}>
                        Std Dev: {stdDev.toFixed(2)}
                    </Text>
                </View>

                {/* Histogram */}
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Histogram</Text>
                    <Text style={styles.histogram}>{histogram}</Text>
                </View>
            </ScrollView>
        </View>
    );
}
