import HeaderText from '@/component/common/Header';
import { db } from '@/config/firebaseConfig';
import { Colors } from '@/constant/Colors';
import { ACTION_WIDTH } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/NotificationScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    onSnapshot,
    query,
    Timestamp,
    updateDoc,
    where,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    GestureHandlerRootView,
    Swipeable,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

dayjs.extend(relativeTime);

type NotificationType = 'like' | 'comment' | 'newCourse' | 'default';

interface Notification {
    id: string;
    sparkId: string;
    type: NotificationType;
    message: string;
    createdAt: Timestamp;
    read?: boolean;
}

const NotificationScreen = () => {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext); // ✅ get logged in user
    const { backgroundColor } = useDarkMode();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ✅ fetch real-time notifications
    useEffect(() => {
        if (!userDetail) return;

        const q = query(
            collection(db, 'notifications'),
            where('to', '==', userDetail?.uid),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Notification[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const { id, ...rest } = doc.data() as Notification;
                    return {
                        id: doc.id,
                        ...rest,
                    };
                },
            );

            // Sort by newest
            setNotifications(
                data.sort(
                    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
                ),
            );
        });

        return () => unsubscribe();
    }, [userDetail]);

    const renderIcon = (type: NotificationType) => {
        switch (type) {
            case 'like':
                return (
                    <Ionicons
                        name="heart"
                        size={scale(20)}
                        color={Colors.RED}
                    />
                );
            case 'comment':
                return (
                    <Ionicons
                        name="chatbubble"
                        size={scale(20)}
                        color={Colors.GREEN}
                    />
                );
            case 'newCourse':
                return (
                    <Ionicons
                        name="book"
                        size={scale(20)}
                        color={Colors.PRIMARY}
                    />
                );
            default:
                return (
                    <Ionicons
                        name="notifications"
                        size={scale(20)}
                        color={Colors.GRAY}
                    />
                );
        }
    };

    // ✅ mark as read in Firestore
    const handleMarkAsRead = async (id: string) => {
        await updateDoc(doc(db, 'notifications', id), { read: true });
    };
    const handleMarkAsUnRead = async (id: string) => {
        await updateDoc(doc(db, 'notifications', id), { read: false });
    };

    // ✅ delete notification in Firestore
    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'notifications', id));
    };

    const renderRightActions = (item: Notification) => (
        <View style={[styles.actionsContainer, { width: ACTION_WIDTH * 2 }]}>
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    {
                        backgroundColor: item.read
                            ? Colors.PRIMARY
                            : Colors.GREEN,
                    },
                ]}
                onPress={() =>
                    item.read
                        ? handleMarkAsUnRead(item.id)
                        : handleMarkAsRead(item.id)
                }
            >
                <Ionicons
                    name={item.read ? 'notifications' : 'checkmark-done'}
                    size={scale(20)}
                    color={Colors.WHITE}
                />
                <Text style={styles.actionText}>
                    {item.read ? 'Unread' : 'Read'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors.RED }]}
                onPress={() => handleDelete(item.id)}
            >
                <Ionicons name="trash" size={scale(20)} color={Colors.WHITE} />
                <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: Notification }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item)}
            overshootRight={false}
        >
            <Pressable
                onPress={() => {
                    safePush({
                        pathname: '/sparkDetail',
                        params: { sparkId: item.sparkId },
                    });
                    handleMarkAsRead(item.id);
                }}
                style={({ pressed }) => [
                    styles.card,
                    pressed && { opacity: 0.6 },
                    !item.read
                        ? styles.unreadCard
                        : { backgroundColor: 'transparent' },
                ]}
            >
                <View style={styles.iconContainer}>
                    {renderIcon(item.type)}
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.message,
                            !item.read
                                ? styles.unreadText
                                : { fontFamily: 'outfit', color: Colors.WHITE },
                        ]}
                    >
                        {item.message}
                    </Text>

                    <Text style={styles.time}>
                        {item.createdAt
                            ? dayjs(item.createdAt.toDate()).fromNow()
                            : ''}
                    </Text>
                </View>
            </Pressable>
        </Swipeable>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <HeaderText title="Notifications" />

                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="notifications-off"
                            size={scale(40)}
                            color={Colors.GRAY}
                        />
                        <Text style={styles.emptyText}>
                            No notifications yet
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: scale(20) }}
                        ItemSeparatorComponent={() => (
                            <View style={styles.separator} />
                        )}
                    />
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default NotificationScreen;
