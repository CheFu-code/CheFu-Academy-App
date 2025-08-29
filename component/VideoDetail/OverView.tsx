import { User } from "@/types/user";
import { Video } from "@/types/video";
import {
    doc,
    getFirestore,
    onSnapshot,
} from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../../styles/OverView.styles";

type Props = {
    video: Video | null;
};

export default function OverView({ video }: Props) {
    const [instructor, setInstructor] = useState<User | null>(null);
    const db = getFirestore();

    useEffect(() => {
        if (!video?.uploadedBy) return;

        // listen to uploader's profile
        const unsubscribe = onSnapshot(
            doc(db, "users", video.uploadedBy), // 👈 docId is the uploader's email
            (docSnap) => {
                if (docSnap.exists()) {
                    setInstructor(docSnap.data() as User);
                }
            }
        );

        return () => unsubscribe();
    }, [video?.uploadedBy]);

    return (
        <View>
            <Text style={styles.header}>What you will learn</Text>

            <View style={{ marginTop: 2 }}>
                {video?.topics?.map((topic, index) => (
                    <Text key={index} style={styles.topic}>
                        • {topic}
                    </Text>
                ))}
            </View>

            <Text style={[styles.header, { marginTop: 16 }]}>
                Course Description
            </Text>
            <Text style={styles.description}>{video?.description}</Text>

            <Text style={[styles.header, { marginTop: 16 }]}>Instructor</Text>

            <View style={styles.profilePictureContainer}>
                {instructor?.profilePicture ? (
                    <Image
                        source={{ uri: instructor.profilePicture }}
                        style={styles.instructorImage}
                    />
                ) : (
                    <View
                        style={[
                            styles.instructorImage,
                            {
                                backgroundColor: "#ccc",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        <Text>?</Text>
                    </View>
                )}
                <View>
                    <Text style={styles.instructorName}>
                        {instructor?.fullname || instructor?.email || "Unknown"}
                    </Text>
                    <Text style={{ fontFamily: "outfit", fontSize: 14 }}>
                        Full Stack Developer
                    </Text>
                </View>
            </View>
        </View>
    );
}
