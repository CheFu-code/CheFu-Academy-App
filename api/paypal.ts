import axios from "axios";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import admin from "firebase-admin";
import nodemailer from "nodemailer";
import serviceAccount from "../key.json";
import { loadEmailTemplate } from "./helper/loadEmailTemplate";

dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const router: Router = express.Router();
const PAYPAL_API = "https://api-m.paypal.com";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("❌ PayPal credentials not set in environment variables!");
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
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
router.post("/create-order", async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
    try {
        const { amount, return_url, cancel_url } = req.body;

        const accessToken = await getAccessToken();

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    { amount: { currency_code: "USD", value: amount } },
                ],
                application_context: {
                    return_url:
                        return_url || "chefu-academy://subscription/success", // fallback
                    cancel_url:
                        cancel_url || "chefu-academy://subscription/cancel", // fallback
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
router.post("/capture-order", async (req: Request<{}, {}, CaptureOrderBody>, res: Response) => {
    try {
        const { orderID, email, planType } = req.body;

        if (!orderID || !email || !planType) {
            console.warn("⚠️ Missing required fields:", {
                orderID,
                email,
                planType,
            });
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
        const id = `${emailSafe}_${orderID}`;

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
        else if (planType === "premium")
            memberUntil.setDate(now.getDate() + 90);
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
            html: loadEmailTemplate("subscription-confirmation", {
                given_name: details.payer.name?.given_name || "Learner",
                planType: planType.charAt(0).toUpperCase() + planType.slice(1),
                currency: details.purchase_units[0].payments.captures[0].amount.currency_code,
                amount: details.purchase_units[0].payments.captures[0].amount.value,
                status: details.status,
                memberUntil: memberUntil.toDateString(),
                year: new Date().getFullYear(),
            }),
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
                    console.error(
                        `  [${index + 1}] ${JSON.stringify(detail, null, 2)}`
                    );
                });
            }

            res.status(500).json({
                error: "Capture failed",
                paypalError: error.response.data,
                status: error.response.status,
            });
        } else if (error.request) {
            console.error(
                "❌ Capture error - no response received:",
                error.request
            );

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
