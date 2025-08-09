import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { styles } from "../../styles/BuyMeCoffee.styles";

export default function BuyMeCoffee() {
    return (
        <View style={{ backgroundColor: Colors.BG_COLOR, padding: 20 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign
                    style={{ marginTop: 5 }}
                    name="left"
                    size={24}
                    color="white"
                />
                <Text style={styles.buyMeCoffee}>Buy me coffee</Text>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>☕ Support CheFu Academy</Text>

                <Text style={styles.paragraph}>
                    CheFu Academy is built with love, purpose, and long nights
                    of coding. Every feature you use — from lessons to quizzes,
                    chat, progress tracking and more — has been
                    <Text style={{ fontStyle: "italic" }}> carefully </Text>
                    crafted to empower your learning journey.
                </Text>

                <Text style={styles.paragraph}>
                    But building and maintaining an app like this takes time,
                    resources, and dedication. Your support helps keep this
                    platform alive and improving. Whether it’s for hosting
                    servers, writing content, developing new features, or fixing
                    bugs — every little contribution goes a long way.
                </Text>

                <Text style={styles.paragraph}>
                    If CheFu Academy has helped you, inspired you, or made
                    learning easier, please consider buying me a coffee. It’s a
                    small gesture with a big impact.
                </Text>

                <Text style={styles.quote}>
                    "Small acts, when multiplied by millions of people, can
                    transform the world." – Howard Zinn
                </Text>

                <Text style={styles.paragraph}>
                    I’m not backed by a big company. Just an indie creator on a
                    mission to make learning accessible and powerful for{" "}
                    <Text style={{ fontWeight: 600 }}>everyone</Text>.
                </Text>
            </ScrollView>

            <TouchableOpacity
                onPress={() => {
                    Linking.openURL("https://www.buymeacoffee.com/chefu");
                }}
                style={styles.buttonContainer}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <Feather
                        style={{ alignItems: "center" }}
                        name="coffee"
                        size={22}
                        color="black"
                    />
                    <Text style={styles.buttonText}>Buy me a coffee</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
