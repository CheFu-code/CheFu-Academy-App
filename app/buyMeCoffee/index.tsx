import { AntDesign, Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { WebView } from "react-native-webview";
import { Colors } from "../../constant/Colors";

export default function BuyMeCoffee() {
    const [open, setOpen] = useState(false)

    if (open) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
                <TouchableOpacity
                    onPress={() => setOpen(false)}
                    style={{
                        padding: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: Colors.BG_COLOR,
                        zIndex: 1,
                    }}
                >
                    <AntDesign name="left" size={24} color="white" />
                    <Text style={{ color: Colors.YELLOW, marginLeft: 8, fontSize: 16 }}>
                        Back
                    </Text>
                </TouchableOpacity>

                <WebView
                    source={{ uri: "https://www.buymeacoffee.com/chefu" }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color={"yellow"} />
                        </View>
                    )}
                />

            </View>
        );
    }



    return (
        <View style={{ backgroundColor: Colors.BG_COLOR, padding: 20, }}>

            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 20,
                }}
            >
                <AntDesign
                    style={{ marginTop: 5 }}
                    name="left"
                    size={24}
                    color="white"
                />
                <Text
                    style={{
                        color: Colors.YELLOW,
                        fontFamily: "space-mono",
                        fontSize: 20,
                    }}
                >
                    Buy me coffee
                </Text>
            </TouchableOpacity>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.heading}>☕ Support CheFu Academy</Text>

                <Text style={styles.paragraph}>
                    CheFu Academy is built with love, purpose, and long nights of coding.
                    Every feature you use — from lessons to quizzes, chat, progress
                    tracking and more — has been
                    <Text style={{ fontStyle: "italic" }}> carefully </Text>crafted to
                    empower your learning journey.
                </Text>

                <Text style={styles.paragraph}>
                    But building and maintaining an app like this takes time, resources,
                    and dedication. Your support helps keep this platform alive and
                    improving. Whether it’s for hosting servers, writing content,
                    developing new features, or fixing bugs — every little contribution
                    goes a long way.
                </Text>

                <Text style={styles.paragraph}>
                    If CheFu Academy has helped you, inspired you, or made learning
                    easier, please consider buying me a coffee. It’s a small gesture with
                    a big impact.
                </Text>

                <Text style={styles.quote}>
                    "Small acts, when multiplied by millions of people, can transform the
                    world." – Howard Zinn
                </Text>

                <Text style={styles.paragraph}>
                    I’m not backed by a big company. Just an indie creator on a mission to
                    make learning accessible and powerful for{" "}
                    <Text style={{ fontWeight: 600 }}>everyone</Text>.
                </Text>
            </ScrollView>


            <TouchableOpacity
                onPress={() => {
                    setOpen(true)
                }}
                style={{
                    borderRadius: 20,
                    backgroundColor: Colors.YELLOW,
                    padding: 10,
                    maxWidth: 200,
                    alignItems: "center",
                    alignSelf: "center",
                    marginBottom: 80
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Feather
                        style={{ alignItems: "center" }}
                        name="coffee"
                        size={22}
                        color="black"
                    />
                    <Text
                        style={{
                            textAlign: "center",
                            padding: 5,
                            fontFamily: "outfit-bold",
                        }}
                    >
                        Buy me a coffee
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        // paddingBottom: 40,
        color: Colors.BG_COLOR,
    },
    heading: {
        fontSize: 23,
        fontWeight: "bold",
        marginBottom: 15,
        color: Colors.PRIMARY,
        marginTop: 25,
        textAlign: "center",
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        marginBottom: 15,
    },
    quote: {
        fontStyle: "italic",
        fontSize: 16,
        color: "#666",
        marginVertical: 20,
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: "#ccc",
    },
});
