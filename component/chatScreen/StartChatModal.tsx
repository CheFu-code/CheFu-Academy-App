import { Colors } from "@/constant/Colors";
import { User } from "@/types/user";
import { AntDesign } from "@expo/vector-icons";
import {
    FlatList,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type StartChatModalProps = {
    visible: boolean;
    onClose: () => void;
    users: User[];
    onStartChat: (user: User) => void;
};

export const StartChatModal:React.FC<StartChatModalProps> = ({ visible, onClose, users, onStartChat }) => (
    <Modal visible={visible} animationType="slide" transparent>
        <View
            style={{
                flex: 1,
                backgroundColor: "rgba(52,48,48,0.75)",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    backgroundColor: Colors.BLACK,
                    borderRadius: 12,
                    margin: 20,
                    padding: 10,
                    maxHeight: "70%",
                }}
            >
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 18,
                        color: Colors.WHITE,
                        marginBottom: 15,
                        textAlign: "center",
                    }}
                >
                    Start a conversation
                </Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => onStartChat(item)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 8,
                            }}
                        >
                            <Image
                                source={
                                    item.profilePicture
                                        ? { uri: item.profilePicture }
                                        : require("../../assets/images/logo.png")
                                }
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    marginRight: 10,
                                    borderWidth: 0.2,
                                    borderColor: "green",
                                }}
                            />
                            <Text
                                style={{
                                    color: Colors.WHITE,
                                    fontFamily: "outfit",
                                }}
                            >
                                {item.fullname || "Unnamed User"}
                            </Text>
                            {(item.member || item.roles?.includes("admin")) && (
                                <AntDesign
                                    name="checkcircleo"
                                    size={13}
                                    color={Colors.PRIMARY}
                                    style={{ marginLeft: 5 }}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        marginTop: 15,
                        alignSelf: "center",
                        padding: 10,
                        borderRadius: 6,
                        backgroundColor: Colors.PRIMARY,
                    }}
                >
                    <Text
                        style={{
                            color: Colors.WHITE,
                            fontFamily: "outfit-bold",
                        }}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);
