const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const router = express.Router();

const PAYPAL_API = "https://api-m.paypal.com"; // Live (Production)
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or another SMTP service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
          return_url: return_url || "chefu-academy://subscription/success", // fallback
          cancel_url: cancel_url || "chefu-academy://subscription/cancel", // fallback
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("🟢 Create order response:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("❌ Create order error:", error.response?.data || error);
    console.error("❌ Create order error:", error);

    res.status(500).json({ error: "Failed to create order" });
  }
});

// Check order status before capture
async function checkOrderStatus(orderID, accessToken) {
  const response = await axios.get(
    `${PAYPAL_API}/v2/checkout/orders/${orderID}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("ℹ️ Order details:", JSON.stringify(response.data, null, 2));
  return response.data.status;
}

// Capture payment AND write to Firestore + send confirmation email
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

    // Check status first
    const orderStatus = await checkOrderStatus(orderID, accessToken);
    console.log(`ℹ️ Current order status for ${orderID}:`, orderStatus);

    if (orderStatus !== "APPROVED") {
      console.warn(
        `⚠️ Cannot capture order ${orderID}, status is ${orderStatus}`
      );
      return res.status(422).json({
        error: `Order status is ${orderStatus}, cannot capture.`,
      });
    }

    console.log(`🚀 Attempting to capture order: ${orderID}`);

    const captureResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {}, // empty body is valid
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const details = captureResponse.data;
    console.log(
      "✅ PayPal capture successful:",
      JSON.stringify(details, null, 2)
    );

    const db = admin.firestore();

    const emailSafe = email.replace(/[@.]/g, "_"); // Replace unsafe characters
    const id = `${emailSafe}_${orderID}`; // Join with underscore

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

    // Send confirmation email
    const mailOptions = {
      from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Subscription Confirmed - ${planType} Plan`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
    <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Welcome to CheFu Academy!</h1>
    </div>
    <div style="padding: 30px; color: #333;">
      <p style="font-size: 18px; margin-top: 0;">
        Hi <strong>${details.payer.name?.given_name || "Learner"}</strong>,
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        Thank you for subscribing to the <strong style="color: #1a73e8;">${
          planType.charAt(0).toUpperCase() + planType.slice(1)
        } Plan</strong>. We’re excited to have you join our community of passionate learners!
      </p>

      <h2 style="color: #1a73e8; margin-top: 40px; margin-bottom: 10px;">Subscription Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tbody>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Plan Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              planType.charAt(0).toUpperCase() + planType.slice(1)
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Duration:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              planType === "basic"
                ? "30 days"
                : planType === "pro"
                ? "60 days"
                : planType === "premium"
                ? "90 days"
                : "30 days"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Amount Paid:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              details.purchase_units[0].payments.captures[0].amount
                .currency_code
            } ${
        details.purchase_units[0].payments.captures[0].amount.value
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Payment Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              details.status
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Payment Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(
              details.update_time || details.create_time
            ).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <h2 style="color: #1a73e8; margin-top: 0; margin-bottom: 10px;">Payer Information</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tbody>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              details.payer.name?.full_name ||
              `${details.payer.name?.given_name} ${details.payer.name?.surname}`
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
              details.payer.email_address
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Member Until:</td>
            <td style="padding: 8px;">${memberUntil.toDateString()}</td>
          </tr>
        </tbody>
      </table>

      <a href="https://chefu-academy.com/dashboard" 
         style="display: inline-block; background-color: #1a73e8; color: white; padding: 12px 24px; margin: 20px 0; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Go to Your Dashboard
      </a>

      <p style="font-size: 14px; color: #555; margin-top: 40px;">
        If you have any questions or need assistance, feel free to contact our support team anytime.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        &copy; ${new Date().getFullYear()} CheFu Academy. All rights reserved.
      </p>
    </div>
  </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Capture successful and confirmation email sent",
      details,
      member: true,
      planType,
      subscribedAt: now.toISOString(),
      memberUntil: memberUntil.toISOString(),
    });
  } catch (error) {
    if (error.response) {
      console.error("❌ Capture error response:");
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data.message);
      console.error("Debug ID:", error.response.data.debug_id);

      // Log the details properly
      if (Array.isArray(error.response.data.details)) {
        console.error("Details:");
        error.response.data.details.forEach((detail, index) => {
          console.error(`  [${index + 1}] ${JSON.stringify(detail, null, 2)}`);
        });
      }

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
