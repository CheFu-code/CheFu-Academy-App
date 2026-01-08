import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { getReadableLocation } from '../helper/getReadableLocation';
import { transporter } from '../helper/transporter';
import { loginAlertMail } from '../mail/loginAlertMail';
import { passwordChangedMail } from '../mail/passwordChangedMail';
import { welcomeMail } from '../mail/welcomeMail';

dotenv.config();

const router = express.Router();

// Send welcome email
router.post('/send-welcome', async (req: Request, res: Response) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    } else if (!name) {
        return res.status(400).json({ error: 'Missing name' });
    }

    try {
        await transporter.sendMail(welcomeMail({ email, name }));
        res.json({ message: 'Welcome email sent!' });
    } catch (e) {
        console.error('❌ Failed to send welcome email:', e);
        res.status(500).json({ error: 'Email send failed' });
    }
});

// send alerts for logins
router.post('/send-alert', async (req: Request, res: Response) => {
    const { email, name, location, device } = req.body;

    if (!email || !name || !location || !device) {
        console.warn('⚠️ Missing email or name in request');
        return res.status(400).json({ error: 'Missing email or name' });
    }
    const locationString = await getReadableLocation(
        location.latitude,
        location.longitude,
    );

    try {
        await transporter.sendMail(
            loginAlertMail({ email, name, location: locationString, device }),
        );
        console.log('✅ Email sent successfully to:', email);
        res.json({ message: 'Login alert email sent!' });
    } catch (e) {
        console.error('❌ Failed to send alert login email:', e);
        res.status(500).json({ error: 'Email send failed' });
    }
});

// send email when user changes password
router.post('/send-password-change', async (req: Request, res: Response) => {
    const { email, name } = req.body;
    if (!email || !name) {
        console.warn('⚠️ Missing email or name in request');
        return res.status(400).json({ error: 'Missing email or name' });
    }

    try {
        console.log('🚀 Sending password change alert email to:', email);
        await transporter.sendMail(passwordChangedMail({ email, name }));
        console.log('✅ Email sent successfully to:', email);
        res.json({ message: 'Password change alert email sent!' });
    } catch (e) {
        console.error('❌ Failed to send alert password change email:', e);
        res.status(500).json({ error: 'Email send failed' });
    }
});
module.exports = router;
