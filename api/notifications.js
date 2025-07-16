// notifications.js
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

const serviceAccount = require("./firebase/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

router.post("/sendToUser", async (req, res) => {
  const { userEmail, title, body } = req.body;
  if (!userEmail || !title || !body) {
    return res.status(400).send("Missing fields");
  }

  // Fetch token from your database by userEmail
  const userDoc = await firestore.collection("users").doc(userEmail).get();
  if (!userDoc.exists) return res.status(404).send("User not found");

  const token = userDoc.data().fcmToken;
  if (!token) return res.status(400).send("User has no FCM token saved");

  const message = {
    token,
    notification: { title, body },
    android: { notification: { channelId: "default" } },
  };

  try {
    const response = await admin.messaging().send(message);
    res.send({ success: true, response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
