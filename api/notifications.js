// const express = require("express");
// const admin = require("firebase-admin");
// const router = express.Router();
// const path = require("path");

// // Initialize Firebase Admin only once
// if (!admin.apps.length) {
//   const serviceAccount = require("../firebase/serviceAccountKey.json");

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // POST /api/notifications
// router.post("/", async (req, res) => {
//   const { token, title, body, data } = req.body;

//   if (!token || !title || !body) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const message = {
//     token,
//     notification: {
//       title,
//       body,
//     },
//     data: data || {}, // Optional payload
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ Notification sent:", response);
//     res.json({ success: true, response });
//   } catch (error) {
//     console.error("❌ FCM send error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;
