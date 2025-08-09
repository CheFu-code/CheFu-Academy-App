import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Colors } from "@/constant/Colors";
import { Element, ELEMENTS } from "@/constant/Elements";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const groupColors: Record<string, string> = {
    "alkali metal": "#FF6666",
    "alkaline earth metal": "#FFDEAD",
    "transition metal": "#FFD700",
    "post-transition metal": "#CCCCCC",
    metalloid: "#66CC66",
    nonmetal: "#66CCFF",
    "noble gas": "#9966FF",
    lanthanide: "#FF99CC",
    actinide: "#FF6699",
};

export default function PeriodicTable() {
    const [selectedElement, setSelectedElement] = useState<Element | null>(
        null
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 25,
                }}
            >
                <AntDesign
                    name="left"
                    size={24}
                    color="white"
                />
                <Text style={styles.title}>Periodic Table</Text>
            </TouchableOpacity>
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{ flexGrow: 0 }}
                >
                    <FlatList
                        data={ELEMENTS}
                        keyExtractor={(item) => item.symbol}
                        numColumns={18}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.elementCard,
                                    {
                                        backgroundColor:
                                            groupColors[item.group] ||
                                            Colors.GRAY,
                                    },
                                ]}
                                onPress={() => setSelectedElement(item)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.atomicNumber}>
                                    {item.atomicNumber}
                                </Text>
                                <Text style={styles.symbol}>{item.symbol}</Text>
                            </TouchableOpacity>
                        )}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                transparent
                visible={!!selectedElement}
                onRequestClose={() => setSelectedElement(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedElement && (
                            <>
                                <Text style={styles.modalTitle}>
                                    {selectedElement.name} (
                                    {selectedElement.symbol})
                                </Text>
                                <Text style={styles.commonText}>
                                    Atomic Number:{" "}
                                    {selectedElement.atomicNumber}
                                </Text>

                                <Text style={styles.commonText}>
                                    Group: {selectedElement.group}
                                </Text>
                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setSelectedElement(null)}
                                >
                                    <Text style={styles.closeButtonText}>
                                        Close
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const CARD_SIZE = 48;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 11,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    elementCard: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 8,
        margin: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    atomicNumber: {
        fontSize: 10,
        color: Colors.WHITE,
        position: "absolute",
        top: 4,
        left: 4,
    },
    symbol: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: Colors.BG_COLOR,
        borderRadius: 12,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 12,
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 8,
        paddingHorizontal: 24,
        backgroundColor: "#8E44AD",
        borderRadius: 12,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "600",
    },
    commonText: { color: Colors.WHITE, fontFamily: "outfit" },
});
