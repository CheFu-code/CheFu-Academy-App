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
    const db = getFirestore();

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
                {video?.thumbnailURL ? (
                    <Image
                        source={{ uri: video?.thumbnailURL }}
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
                        {video?.instructorCompany || "Unknown"}
                    </Text>
                    <Text style={{ fontFamily: "outfit", fontSize: 14 }}>
                        {video?.instructorName || "Unknown"}
                    </Text>
                </View>
            </View>
        </View>
    );
}
