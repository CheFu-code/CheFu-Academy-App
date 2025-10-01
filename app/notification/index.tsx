// import React, { useState, useCallback } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     FlatList,
//     Pressable,
//     TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constant/Colors';
// import { useSafeNavigation } from '@/hooks/useSafeNavigation';
// import { RFValue } from 'react-native-responsive-fontsize';
// // import {
// //     Swipeable,
// //     GestureHandlerRootView,
// // } from 'react-native-gesture-handler';

// type NotificationType = 'like' | 'comment' | 'newCourse' | 'default';

// interface Notification {
//     id: string;
//     type: NotificationType;
//     message: string;
//     time: string;
//     read?: boolean;
// }

// const initialNotifications: Notification[] = [
//     {
//         id: '1',
//         type: 'like',
//         message: 'John liked your course',
//         time: '2h ago',
//         read: false,
//     },
//     {
//         id: '2',
//         type: 'comment',
//         message: 'Sarah commented on your video',
//         time: '5h ago',
//         read: true,
//     },
//     {
//         id: '3',
//         type: 'newCourse',
//         message: 'New course “React Native Basics” is now available!',
//         time: '1d ago',
//         read: false,
//     },
// ];

// const ACTION_WIDTH = 70;

// const NotificationScreen = () => {
//     const { safeBack } = useSafeNavigation();
//     const [notifications, setNotifications] =
//         useState<Notification[]>(initialNotifications);

//     const renderIcon = (type: NotificationType) => {
//         switch (type) {
//             case 'like':
//                 return <Ionicons name="heart" size={22} color={Colors.RED} />;
//             case 'comment':
//                 return (
//                     <Ionicons
//                         name="chatbubble"
//                         size={22}
//                         color={Colors.GREEN}
//                     />
//                 );
//             case 'newCourse':
//                 return (
//                     <Ionicons name="book" size={22} color={Colors.PRIMARY} />
//                 );
//             default:
//                 return (
//                     <Ionicons
//                         name="notifications"
//                         size={22}
//                         color={Colors.GRAY}
//                     />
//                 );
//         }
//     };

//     const handlePress = useCallback((id: string) => {
//         setNotifications((prev) =>
//             prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
//         );
//     }, []);

//     const handleDelete = (id: string) => {
//         setNotifications((prev) => prev.filter((n) => n.id !== id));
//     };

//     const handleMarkAsRead = (id: string) => {
//         setNotifications((prev) =>
//             prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
//         );
//     };

//     const renderRightActions = (id: string) => (
//         <View style={[styles.actionsContainer, { width: ACTION_WIDTH * 2 }]}>
//             <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: Colors.GREEN }]}
//                 onPress={() => handleMarkAsRead(id)}
//             >
//                 <Ionicons
//                     name="checkmark-done"
//                     size={20}
//                     color={Colors.WHITE}
//                 />
//                 <Text style={styles.actionText}>Read</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: Colors.RED }]}
//                 onPress={() => handleDelete(id)}
//             >
//                 <Ionicons name="trash" size={20} color={Colors.WHITE} />
//                 <Text style={styles.actionText}>Delete</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     const renderItem = ({ item }: { item: Notification }) => (
//         <Swipeable
//             renderRightActions={() => renderRightActions(item.id)}
//             overshootRight={false}
//         >
//             <Pressable
//                 onPress={() => handlePress(item.id)}
//                 style={({ pressed }) => [
//                     styles.card,
//                     pressed && { opacity: 0.6 },
//                     !item.read && styles.unreadCard,
//                 ]}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Notification: ${item.message}`}
//             >
//                 <View style={styles.iconContainer}>
//                     {renderIcon(item.type)}
//                 </View>
//                 <View style={styles.textContainer}>
//                     <Text
//                         style={[
//                             styles.message,
//                             !item.read && styles.unreadText,
//                         ]}
//                     >
//                         {item.message}
//                     </Text>
//                     <Text style={styles.time}>{item.time}</Text>
//                 </View>
//             </Pressable>
//         </Swipeable>
//     );

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <SafeAreaView style={styles.container}>
//                 <TouchableOpacity onPress={safeBack} style={styles.backButton}>
//                     <AntDesign name="left" size={20} color={'white'} />
//                     <Text style={styles.header}>Notifications</Text>
//                 </TouchableOpacity>

//                 {notifications.length === 0 ? (
//                     <View style={styles.emptyState}>
//                         <Ionicons
//                             name="notifications-off"
//                             size={40}
//                             color={Colors.GRAY}
//                         />
//                         <Text style={styles.emptyText}>
//                             No notifications yet
//                         </Text>
//                     </View>
//                 ) : (
//                     <FlatList
//                         showsVerticalScrollIndicator={false}
//                         data={notifications}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderItem}
//                         contentContainerStyle={{ paddingBottom: 20 }}
//                         ItemSeparatorComponent={() => (
//                             <View style={styles.separator} />
//                         )}
//                     />
//                 )}
//             </SafeAreaView>
//         </GestureHandlerRootView>
//     );
// };

// export default NotificationScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.BG_COLOR,
//         paddingHorizontal: 16,
//     },
//     header: {
//         fontSize: RFValue(20),
//         fontWeight: 'bold',
//         marginVertical: 12,
//         color: Colors.WHITE,
//     },
//     card: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         backgroundColor: 'transparent',
//         overflow: 'hidden',
//     },
//     unreadCard: {
//         backgroundColor: Colors.GRAY,
//         borderRadius: 8,
//         paddingHorizontal: 8,
//     },
//     iconContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: Colors.BG_GRAY,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 12,
//     },
//     textContainer: { flex: 1 },
//     message: { fontSize: RFValue(13), color: Colors.WHITE },
//     unreadText: { fontWeight: 'bold', color: Colors.PRIMARY },
//     time: { fontSize: RFValue(11), color: Colors.WHITE, marginTop: 2 },
//     separator: { height: 1, backgroundColor: Colors.GRAY, opacity: 0.2 },
//     emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     emptyText: { marginTop: 8, fontSize: RFValue(14), color: Colors.GRAY },
//     backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     actionsContainer: { flexDirection: 'row', alignItems: 'center' },
//     actionButton: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: ACTION_WIDTH,
//         height: '100%',
//     },
//     actionText: { color: Colors.WHITE, fontSize: RFValue(10), marginTop: 2 },
// });
