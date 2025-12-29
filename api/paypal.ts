import axios, { isAxiosError } from 'axios';
import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import admin from 'firebase-admin';
import serviceAccount from '../key.json';
import { CLIENT_ID, CLIENT_SECRET, PAYPAL_API } from './constants/values';
import { checkOrderStatus } from './helper/checkOrderStatus';
import { getAccessToken } from './helper/getAccessToke';
import { loadEmailTemplate } from './helper/loadEmailTemplate';
import { transporter } from './helper/transporter';
import { CaptureOrderBody } from './types/captureOrderBody';
import { CreateOrderBody } from './types/createOrderBody';

dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const router: Router = express.Router();

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('❌ PayPal credentials not set in environment variables!');
}

// Create order
router.post(
    '/create-order',
    async (req: Request<unknown, unknown, CreateOrderBody>, res: Response) => {
        try {
            const { amount, return_url, cancel_url } = req.body;
            const accessToken = await getAccessToken();
            const response = await axios.post(
                `${PAYPAL_API}/v2/checkout/orders`,
                {
                    intent: 'CAPTURE',
                    purchase_units: [
                        { amount: { currency_code: 'USD', value: amount } },
                    ],
                    application_context: {
                        return_url:
                            return_url ||
                            'chefu-academy://subscription/success', // fallback
                        cancel_url:
                            cancel_url || 'chefu-academy://subscription/cancel', // fallback
                    },
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            res.json(response.data);
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.error(
                    '❌ Create order Axios error:',
                    err.response?.data || err.message,
                );
            } else if (err instanceof Error) {
                console.error('❌ Create order general error:', err.message);
            } else {
                console.error('❌ Create order unknown error:', err);
            }

            res.status(500).json({ error: 'Failed to create order' });
        }
    },
);

// Capture payment AND write to Firestore + send confirmation email
router.post(
    '/capture-order',
    async (req: Request<unknown, unknown, CaptureOrderBody>, res: Response) => {
        try {
            const { orderID, email, planType } = req.body;

            if (!orderID || !email || !planType) {
                console.warn('⚠️ Missing required fields:', {
                    orderID,
                    email,
                    planType,
                });
                return res
                    .status(400)
                    .json({ error: 'Missing orderID, email, or planType' });
            }

            const accessToken = await getAccessToken();

            // Check status first
            const orderStatus = await checkOrderStatus(orderID, accessToken);

            if (orderStatus !== 'APPROVED') {
                return res.status(422).json({
                    error: `Order status is ${orderStatus}, cannot capture.`,
                });
            }

            const captureResponse = await axios.post(
                `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
                {}, // empty body is valid
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            const details = captureResponse.data;
            const db = admin.firestore();
            const emailSafe = email.replace(/[@.]/g, '_'); // Replace unsafe characters
            const id = `${emailSafe}_${orderID}`;

            await db.collection('payments').doc(id).set({
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

            if (planType === 'basic') memberUntil.setDate(now.getDate() + 30);
            else if (planType === 'pro')
                memberUntil.setDate(now.getDate() + 60);
            else if (planType === 'premium')
                memberUntil.setDate(now.getDate() + 90);
            else memberUntil.setDate(now.getDate() + 30); // default fallback

            await db.collection('users').doc(email).set(
                {
                    member: true,
                    planType,
                    subscribedAt: now.toISOString(),
                    memberUntil: memberUntil.toISOString(),
                },
                { merge: true },
            );

            // Send confirmation email
            const mailOptions = {
                from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Subscription Confirmed - ${planType} Plan`,
                html: loadEmailTemplate('subscription-confirmation', {
                    given_name: details.payer.name?.given_name || 'Learner',
                    planType:
                        planType.charAt(0).toUpperCase() + planType.slice(1),
                    currency:
                        details.purchase_units[0].payments.captures[0].amount
                            .currency_code,
                    amount: details.purchase_units[0].payments.captures[0]
                        .amount.value,
                    status: details.status,
                    memberUntil: memberUntil.toDateString(),
                    year: new Date().getFullYear(),
                }),
            };

            await transporter.sendMail(mailOptions);

            res.json({
                message: 'Capture successful and confirmation email sent',
                details,
                member: true,
                planType,
                subscribedAt: now.toISOString(),
                memberUntil: memberUntil.toISOString(),
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const response = err.response;

                if (response) {
                    console.error('❌ Capture error response:');
                    console.error('Status:', response.status);
                    console.error('Message:', response.data?.message);
                    console.error('Debug ID:', response.data?.debug_id);

                    if (Array.isArray(response.data?.details)) {
                        console.error('Details:');
                        response.data.details.forEach(
                            (detail: unknown, index: number) => {
                                console.error(
                                    `  [${index + 1}] ${JSON.stringify(
                                        detail,
                                        null,
                                        2,
                                    )}`,
                                );
                            },
                        );
                    }

                    return res.status(500).json({
                        error: 'Capture failed',
                        paypalError: response.data,
                        status: response.status,
                    });
                }

                if (err.request) {
                    console.error(
                        '❌ Capture error - no response received:',
                        err.request,
                    );

                    return res.status(500).json({
                        error: 'No response received from PayPal',
                    });
                }

                console.error('❌ Capture error Axios message:', err.message);

                return res.status(500).json({
                    error: 'Axios error',
                    message: err.message,
                });
            }

            // Non-Axios errors
            if (err instanceof Error) {
                console.error('❌ Capture error - general:', err.message);

                return res.status(500).json({
                    error: 'General error',
                    message: err.message,
                });
            }

            // Truly unknown error
            console.error('❌ Capture error - unknown:', err);

            return res.status(500).json({
                error: 'Unknown error occurred',
            });
        }
    },
);

module.exports = router;
