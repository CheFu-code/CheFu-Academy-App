import { faqsData } from "@/constant/SystemDesignData/FaqsData";
import { principlesData } from "@/constant/SystemDesignData/PrinciplesData";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Clipboard,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { styles } from "../../styles/SystemDesign.styles";

export default function SystemDesign() {
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [bookmarkedPrinciples, setBookmarkedPrinciples] = useState<number[]>(
        []
    );
    const [bookmarkedFAQs, setBookmarkedFAQs] = useState<number[]>([]);
    const [notes, setNotes] = useState<{ [key: number]: string }>({});

    // Filter principles and FAQs based on search term
    const filteredPrinciples = useMemo(() => {
        return principlesData.filter(
            (p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const filteredFAQs = useMemo(() => {
        return faqsData.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Toggle bookmarks
    const toggleBookmarkPrinciple = (id: number) => {
        setBookmarkedPrinciples((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleBookmarkFAQ = (id: number) => {
        setBookmarkedFAQs((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Copy FAQ answer to clipboard
    const copyToClipboard = (text: string) => {
        Clipboard.setString(text);
        Alert.alert("Copied!", "Answer copied to clipboard.");
    };

    // Handle note changes
    const updateNote = (id: number, text: string) => {
        setNotes((prev) => ({ ...prev, [id]: text }));
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>System Design Overview</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Search principles or FAQs..."
                placeholderTextColor="#888"
                value={searchTerm}
                onChangeText={setSearchTerm}
                accessibilityLabel="Search system design topics"
            />

            <Text style={styles.bookmarkCounter}>
                Bookmarked Principles: {bookmarkedPrinciples.length} | FAQs:{" "}
                {bookmarkedFAQs.length}
            </Text>

            <Text style={styles.sectionTitle}>Key Principles</Text>
            {filteredPrinciples.length === 0 && (
                <Text style={styles.noResults}>No principles found.</Text>
            )}
            {filteredPrinciples.map((p) => (
                <View key={p.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{p.title}</Text>
                        <TouchableOpacity
                            onPress={() => toggleBookmarkPrinciple(p.id)}
                            accessibilityLabel={`${
                                bookmarkedPrinciples.includes(p.id)
                                    ? "Remove"
                                    : "Add"
                            } bookmark for ${p.title}`}
                            style={styles.bookmarkBtn}
                        >
                            <Text
                                style={[
                                    styles.bookmarkText,
                                    bookmarkedPrinciples.includes(p.id) &&
                                        styles.bookmarkedText, // color here
                                ]}
                            >
                                {bookmarkedPrinciples.includes(p.id)
                                    ? "★"
                                    : "☆"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.cardDesc}>{p.desc}</Text>

                    <Text style={styles.noteLabel}>Your Notes:</Text>
                    <TextInput
                        style={styles.noteInput}
                        multiline
                        placeholder="Write notes here..."
                        placeholderTextColor="#666"
                        value={notes[p.id] || ""}
                        onChangeText={(text) => updateNote(p.id, text)}
                    />
                </View>
            ))}

            <Text style={styles.sectionTitle}>FAQ</Text>
            {filteredFAQs.length === 0 && (
                <Text style={styles.noResults}>No FAQs found.</Text>
            )}
            {filteredFAQs.map((faq, i) => (
                <View key={faq.id} style={styles.faqCard}>
                    <TouchableOpacity
                        onPress={() => toggleFAQ(i)}
                        accessibilityRole="button"
                        accessibilityLabel={`Toggle answer for: ${faq.question}`}
                    >
                        <View style={styles.faqHeader}>
                            <Text style={styles.faqQuestion}>
                                {faq.question}
                            </Text>
                            <TouchableOpacity
                                onPress={() => toggleBookmarkFAQ(faq.id)}
                                accessibilityLabel={`${
                                    bookmarkedFAQs.includes(faq.id)
                                        ? "Remove"
                                        : "Add"
                                } bookmark for FAQ`}
                            >
                                <Text
                                    style={[
                                        styles.bookmarkText,
                                        bookmarkedFAQs.includes(faq.id) &&
                                            styles.bookmarked,
                                    ]}
                                >
                                    {bookmarkedFAQs.includes(faq.id)
                                        ? "★"
                                        : "☆"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                    {expandedFAQ === i && (
                        <>
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            <TouchableOpacity
                                onPress={() => copyToClipboard(faq.answer)}
                                style={styles.copyBtn}
                                accessibilityLabel={`Copy answer for: ${faq.question}`}
                            >
                                <Text style={styles.copyBtnText}>
                                    Copy Answer
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}
