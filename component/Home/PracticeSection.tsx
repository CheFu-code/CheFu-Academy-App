import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";
import { PracticeOption } from "../../constant/Option";

export default function PracticeSection() {
    const router = useRouter();
    return (
        <View
            style={{
                marginTop: 10,
            }}
        >
            <Text
                style={{
                    fontFamily: "outfit-bold",
                    fontSize: 25,
                    color: Colors.PRIMARY,
                }}
            >
                Practice
            </Text>
            <View>
                <FlatList
                    numColumns={3}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/practice/[type]", // dynamic route template
                                    params: { type: item.name }, // provide param to replace [type]
                                })
                            }
                            style={{
                                flex: 1,
                                margin: 4,
                                aspectRatio: 1,
                            }}
                        >
                            <Image
                                source={item?.image}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: 100,
                                    borderRadius: 15,
                                }}
                            />
                            <Text
                                style={{
                                    position: "absolute",
                                    padding: 8,
                                    fontFamily: "outfit-bold",
                                    fontSize: 13,
                                    color: Colors.WHITE,
                                }}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    data={PracticeOption}
                />
            </View>
        </View>
    );
}
