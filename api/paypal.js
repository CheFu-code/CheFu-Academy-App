const express = require("express");
const axios = require("axios");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

console.log("🟡 Initializing Firebase Admin...");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin initialized.");

const router = express.Router();

const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Sandbox
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Helper to get access token
async function getAccessToken() {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: { username: CLIENT_ID, password: CLIENT_SECRET },
    data: "grant_type=client_credentials",
  });
  return response.data.access_token;
}

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
        application_context: {
          return_url: "chefu-academy://subscription/success",
          cancel_url: "chefu-academy://subscription/cancel",
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Create order error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Capture payment AND write to Firestore
router.post("/capture-order", async (req, res) => {
  try {
    const { orderID, email } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: "Missing orderID" });
    }
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const accessToken = await getAccessToken();

    const captureResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const details = captureResponse.data;

    console.log("✅ PayPal capture successful:", details);

    // Write to Firestore
    const db = admin.firestore();

    console.log("🟢 Writing payment to Firestore...");
    await db.collection("payments").doc(orderID).set({
      email,
      orderID,
      payerID: details.payer.payer_id,
      payerName: details.payer.name,
      amount: details.purchase_units[0].payments.captures[0].amount,
      status: details.status,
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Payment written to Firestore");

    res.json({ message: "Capture successful", details });
  } catch (error) {
    console.error("❌ Capture order error:", error.response?.data || error);
    res.status(500).json({ error: "Capture failed" });
  }
});

module.exports = router;
