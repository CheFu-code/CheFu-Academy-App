import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import CourseProgressCard from "../Shared/CourseProgressCard";

export default function CourseProgress({ courseList, enroll = false }) {
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, [])
    );

    const handlePress = (item) => {
        const id = item.id || item.courseTitle || "";
        setLoadingId(id);

        // Add a small delay so loading state can show before navigation
        setTimeout(() => {
            router.push({
                pathname: "/courseView",
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll,
                },
            });
        }, 100);
    };

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
                Progress
            </Text>
            <FlatList
                data={courseList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) =>
                    item.id?.toString() ?? Math.random().toString()
                }
                renderItem={({ item }) => (
                    <CourseProgressCard
                        item={item}
                        onPress={() => handlePress(item)}
                        disabled={Boolean(loadingId)} // disable all while one is loading
                        loading={
                            loadingId === (item.id || item.courseTitle || "")
                        } // show loader on the right one
                    />
                )}
            />
        </View>
    );
}
