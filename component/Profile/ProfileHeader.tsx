// components/Profile/ProfileHeader.tsx
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { formatDate } from "@/helpers/formatDate";
import { useProfileActions } from "@/hooks/useProfileActions";
import { styles } from "@/styles/Profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ErrorModal from "../Shared/ErrorModal";

interface ProfileHeaderProps {
    avatarURL: string;
    fullname: string;
    email: string;
    member: boolean;
    memberUntil?: string;
    planType?: string;
    createdAt?: string;
    provider?: string;
    onChangeAvatar: () => void;
    loading: boolean;
    onChangeName: (newName: string) => void;
    loader: boolean;
}

export const ProfileHeader = ({
    avatarURL,
    fullname,
    email,
    member,
    memberUntil,
    planType,
    createdAt,
    provider,
    onChangeAvatar,
    onChangeName,
    loader,
}: ProfileHeaderProps) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const auth = getAuth();
    const firestore = getFirestore();
    const [modalVisible, setModalVisible] = useState(false);
    const [nameInput, setNameInput] = useState(fullname);
    const { loading, verifyEmail } = useProfileActions(
        userDetail,
        setUserDetail,
        router
    );
    const [error, setError] = useState({
        message: "",
        visible: false,
        title: "",
    });

    const handleSave = () => {
        const trimmed = nameInput.trim();

        // Validation rules
        if (!trimmed) {
            setError({
                message: "Name cannot be empty.",
                visible: true,
                title: "Invalid Name",
            });
            return;
        }
        if (!/^[A-Za-z\s]+$/.test(trimmed)) {
            setError({
                message: "Name can only contain letters and spaces.",
                visible: true,
                title: "Invalid Name",
            });
            return;
        }
        if (trimmed.length > 30) {
            setError({
                message: "Name cannot be longer than 30 characters.",
                visible: true,
                title: "Invalid Name",
            });
            return;
        }

        onChangeName(trimmed);
        setModalVisible(false);
    };

    return (
        <>
            <View style={styles.header}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "90%",
                        marginTop: 10,
                    }}
                >
                    {auth.currentUser?.emailVerified ? (
                        <Text
                            style={[
                                styles.profileEmail,
                                { color: Colors.GREEN, marginTop: 10 },
                            ]}
                        >
                            Email Verified
                        </Text>
                    ) : (
                        <TouchableOpacity
                            disabled={loading}
                            onPress={verifyEmail}
                        >
                            <Text
                                style={[
                                    styles.profileEmail,
                                    {
                                        color: Colors.RED,
                                        textDecorationLine: "underline",
                                        marginTop: 10,
                                    },
                                ]}
                            >
                                Email not verified
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => router.push("/settings")}>
                        <Ionicons
                            style={{
                                marginTop: 3,
                                alignItems: "flex-end",
                                padding: 10,
                            }}
                            name="settings-outline"
                            size={20}
                            color={Colors.GRAY}
                        />
                    </TouchableOpacity>
                </View>
                {/**later i wil comment out later */}
                {/* <TouchableOpacity onPress={handleChangeAvatar}> */}
                <Pressable>
                    <Image
                        style={[
                            styles.avatar,
                            {
                                borderColor: member
                                    ? Colors.GREEN
                                    : Colors.PRIMARY,
                            },
                        ]}
                        source={
                            ["github.com", "google.com"].includes(
                                userDetail?.provider
                            )
                                ? { uri: avatarURL }
                                : require("../../assets/images/logo.png")
                        }
                    />
                </Pressable>

                {userDetail && (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <View>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={styles.profileName}
                                    >
                                        {fullname}
                                    </Text>
                                </TouchableOpacity>
                                <Text
                                    numberOfLines={1}
                                    style={styles.profileEmail}
                                >
                                    Joined {formatDate(createdAt)}
                                </Text>
                            </View>
                            {member && (
                                <Ionicons
                                    color={Colors.GREEN}
                                    size={20}
                                    name="checkmark-circle"
                                />
                            )}
                        </View>

                        <Text numberOfLines={1} style={styles.profileEmail}>
                            {email}
                        </Text>

                        {planType && memberUntil && (
                            <Text style={styles.expiryText}>
                                Your plan will expire on{" "}
                                {memberUntil ? formatDate(memberUntil) : "N/A"}
                            </Text>
                        )}
                    </>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles2.modalBackground}>
                    <View style={styles2.modalContainer}>
                        <Text style={styles2.modalTitle}>Change Name</Text>
                        <TextInput
                            value={nameInput}
                            onChangeText={setNameInput}
                            style={styles.input}
                            placeholder="Enter new name"
                            placeholderTextColor={Colors.WHITE}
                        />
                        <View style={styles2.buttons}>
                            <TouchableOpacity
                                disabled={loader}
                                style={[
                                    styles2.buttonCancel,
                                    { opacity: loader ? 0.5 : 1 },
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles2.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={loader}
                                style={[
                                    styles2.buttonSave,
                                    { opacity: loader ? 0.5 : 1 },
                                ]}
                                onPress={handleSave}
                            >
                                <Text style={styles2.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ErrorModal
                visible={error.visible}
                title={error.title}
                message={error.message}
                onConfirm={() =>
                    setError((prev) => ({
                        ...prev,
                        visible: false,
                    }))
                }
            />
        </>
    );
};

const styles2 = StyleSheet.create({
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#222",
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#333",
        color: "white",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    buttonCancel: {
        padding: 10,
        backgroundColor: "#555",
        borderRadius: 8,
    },
    buttonSave: {
        padding: 10,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
