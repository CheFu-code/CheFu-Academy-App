const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

const serviceAccount = require("./firebase/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

router.post("/save-fcm-token", async (req, res) => {
  const { email, fcmToken } = req.body;

  if (!email || !fcmToken) {
    return res.status(400).send("Missing email or FCM token");
  }

  try {
    // Update or create user doc with the fcmToken
    await firestore.collection("users").doc(email).set(
      { fcmToken },
      { merge: true } // Merge to not overwrite other user data
    );

    res.status(200).json({ success: true, message: "FCM token saved" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).send("Failed to save FCM token");
  }
});

module.exports = router;
