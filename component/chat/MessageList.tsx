import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/MessageList";

export default function MessageList({
    messages,
    userDetail,
    otherUser,
    scrollViewRef,
}: any) {
    return (
        <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
            }
        >
            {messages.length === 0 ? (
                <Text style={styles.noMessageText}>No messages yet</Text>
            ) : (
                messages.map((msg: any) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageRow,
                            msg.senderId === userDetail.email
                                ? { justifyContent: "flex-end" }
                                : { justifyContent: "flex-start" },
                        ]}
                    >
                        {msg.senderId !== userDetail.email && (
                            <Image
                                source={
                                    otherUser?.profilePicture
                                        ? { uri: otherUser?.profilePicture }
                                        : require("../../assets/images/logo.png")
                                }
                                style={styles.avatar}
                            />
                        )}

                        <View
                            style={[
                                styles.messageBubble,
                                msg.senderId === userDetail.email
                                    ? styles.userMessage
                                    : styles.adminMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{msg.text}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(
                                    msg.createdAt?.toDate?.()
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}


