const express = require("express");
const axios = require("axios");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    const { amount, return_url, cancel_url } = req.body;

    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
        application_context: {
          return_url: return_url || "chefu-academy://subscription/success", // ✅ fallback
          cancel_url: cancel_url || "chefu-academy://subscription/cancel", // ✅ fallback
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
    const { orderID, email, planType } = req.body;

    if (!orderID || !email || !planType) {
      console.warn("⚠️ Missing required fields:", { orderID, email, planType });
      return res
        .status(400)
        .json({ error: "Missing orderID, email, or planType" });
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

    const db = admin.firestore();

    const id = email + orderID;

    await db.collection("payments").doc(id).set({
      email,
      orderID,
      planType,
      payerID: details.payer.payer_id,
      payerName: details.payer.name,
      amount: details.purchase_units[0].payments.captures[0].amount,
      status: details.status,
      timestamp: new Date().toISOString(),
    });

    // Calculate memberUntil based on plan
    const now = new Date();
    const memberUntil = new Date(now);

    if (planType === "basic") memberUntil.setDate(now.getDate() + 30);
    else if (planType === "pro") memberUntil.setDate(now.getDate() + 60);
    else if (planType === "premium") memberUntil.setDate(now.getDate() + 90);
    else memberUntil.setDate(now.getDate() + 30); // default fallback

    await db.collection("users").doc(email).set(
      {
        member: true,
        planType,
        subscribedAt: now.toISOString(),
        memberUntil: memberUntil.toISOString(),
      },
      { merge: true }
    );

    res.json({
      message: "Capture successful",
      details,
      member: true,
      planType,
      subscribedAt: now.toISOString(),
      memberUntil: memberUntil.toISOString(),
    });
  } catch (error) {
    if (error.response) {
      console.error("❌ Capture error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      res.status(500).json({
        error: "Capture failed",
        paypalError: error.response.data,
        status: error.response.status,
      });
    } else if (error.request) {
      console.error("❌ Capture error - no response received:", error.request);

      res.status(500).json({
        error: "No response received from PayPal",
      });
    } else {
      console.error("❌ Capture error - general:", error.message);

      res.status(500).json({
        error: "General error",
        message: error.message,
      });
    }
  }
});

module.exports = router;
