import express from 'express';
import admin from 'firebase-admin';
import serviceAccount from './firebase/serviceAccountKey.json';

const router = express.Router();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
        ),
    });
} else {
}

const firestore = admin.firestore();

// const token =
//     "eI0GNwPOTR6JoL2rhU5g5l:APA91bGdKKu8EKgMOTgYSv4_gcUmPo-RcD1VI5tpqGl60xKtszkyoA3orqs_CLRfrZG5LSg0uQnhgqaYDTEETDpY3nHw-LnSbln0lLgRlsP4MmboFnnOFIg"; // Replace with actual token
// console.log("📱 Using FCM token:", token);

// // ✅ Notification message
// const message = {
//     notification: {
//         title: "We miss you!",
//         body: "Come back to CheFu Academy – new content awaits 🎓✨",
//     },
//     token,
//     data: {
//         click_action: "FLUTTER_NOTIFICATION_CLICK",
//         url: "https://www.mediafire.com/your-app-link.apk",
//     },
// };

// console.log("📤 Sending notification with payload:", message);

// admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//         console.log("✅ Successfully sent notification:", response);
//     })
//     .catch((error) => {
//         console.error("❌ Error sending notification:", error);
//     });

router.post('/save-fcm-token', async (req, res) => {
    const { email, fcmToken } = req.body;

    if (!fcmToken) {
        console.warn('⚠️ Missing FCM token in request');
        return res.status(400).send('Missing FCM token');
    } else if (!email) {
        console.warn('⚠️ Missing email in request');
        return res.status(400).send('Missing email');
    }

    try {
        await firestore
            .collection('users')
            .doc(email)
            .set({ fcmToken }, { merge: true });

        res.status(200).json({ success: true, message: 'FCM token saved' });
    } catch (error) {
        console.error('❌ Error saving FCM token:', error);
        res.status(500).send('Failed to save FCM token');
    }
});

router.post('/sendToUser', async (req, res) => {
    const { userEmail, title, body } = req.body;

    if (!userEmail) {
        console.warn('⚠️ Missing userEmail in request');
        return res.status(400).send('Missing userEmail in request');
    } else if (!title) {
        console.warn('Missing title in request');
        return res.status(400).send('Missing title in request');
    } else if (!body) {
        console.warn('Missing body in request');
        return res.status(400).send('Missing body in request');
    }

    try {
        const userDoc = await firestore
            .collection('users')
            .doc(userEmail)
            .get();

        if (!userDoc.exists) {
            console.warn('❌ User not found in Firestore:', userEmail);
            return res.status(404).send('User not found');
        }

        const token = userDoc.data()?.fcmToken;

        if (!token) {
            console.warn('❌ User has no FCM token saved:', userEmail);
            return res.status(400).send('User has no FCM token saved');
        }

        const message = {
            token,
            notification: { title, body },
            android: {
                notification: {
                    channelId: 'default', // Ensure this matches the one in your app
                },
            },
        };

        const response = await admin.messaging().send(message);

        res.json({ success: true, response });
    } catch (error: any) {
        console.error('❌ Error sending notification:', error);
        if (
            error.code === 'messaging/registration-token-not-registered' &&
            userEmail
        ) {
            console.warn(
                `Removing invalid FCM token for user ${userEmail} from Firestore.`,
            );
            await firestore
                .collection('users')
                .doc(userEmail)
                .update({ fcmToken: admin.firestore.FieldValue.delete() });
        }
        res.status(500).send(error.message);
    }
});

module.exports = router;
