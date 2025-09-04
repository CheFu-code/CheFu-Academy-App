import { TermsText } from "@/component/TermsText";
import { useImmersiveMode } from "@/hooks/useImmersiveMode";
import { useLoadUser } from "@/hooks/useLoadUser";
import { useSocialAuthNavigation } from "@/hooks/useSocialAuthNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/Colors";
import { styles } from "../styles/WelcomeScreen.styles";

export default function Index() {
    const router = useRouter();
    const { loading } = useLoadUser();
    const { navigateGitHub, navigateGoogle } = useSocialAuthNavigation();
    useImmersiveMode();

    return (
        <View style={styles.centeredContainer}>
            <Image
                source={require("./../assets/images/landing.png")}
                style={{ width: "100%", height: 360, marginTop: 20 }}
                resizeMode="contain"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.bottomSheet}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Text style={styles.title}>
                    Welcome to{"\n"}
                    <Text
                        style={{
                            color: Colors.BG_COLOR,
                            fontFamily: "outfit-bold",
                        }}
                    >
                        CheFu Academy
                    </Text>
                </Text>

                <Text style={styles.subtitle}>Smart Learning Starts Here</Text>

                <TouchableOpacity
                    disabled={loading}
                    style={styles.button}
                    onPress={() => router.push("/auth/signUp")}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                {/* <View style={styles.iconsContainer}> */}

                <TouchableOpacity
                    style={styles.iconsContainer}
                    onPress={navigateGoogle}
                >
                    <AntDesign name="google" size={30} color="#fff" />
                    <Text>Google</Text>
                </TouchableOpacity>
                {/* </View> */}

                <TouchableOpacity
                    disabled={loading}
                    onPress={() => router.push("/auth/signIn")}
                    style={[
                        styles.button2,
                        { backgroundColor: Colors.PRIMARY },
                    ]}
                >
                    <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
                        Already have an account? {"\n"}
                        <Text style={{ color: Colors.BLACK }}>Sign In</Text>
                    </Text>
                </TouchableOpacity>

                <TermsText disabled={loading} />
            </ScrollView>
        </View>
    );
}
