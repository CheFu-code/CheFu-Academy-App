import notifee from "@notifee/react-native";

async function setupNotificationChannel() {
    await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        sound: "default", // plays the default notification sound
        importance: 4, // HIGH importance makes sound play
    });
}

async function notifyUser(title, body) {
    await setupNotificationChannel();

    await notifee.displayNotification({
        title,
        body,
        android: {
            channelId: "default",
            smallIcon: "ic_launcher",
        },
    });
}

export default notifyUser;
