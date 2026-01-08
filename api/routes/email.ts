import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { getReadableLocation } from '../helper/getReadableLocation';
import { transporter } from '../helper/transporter';

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

    const mailOptions = {
        from: `"CheFu Academy" ― <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎉 Welcome to CheFu Academy!',
        html: `
    <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0; min-height: 100vh;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f8fb; padding: 0; margin: 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(26,115,232,0.07); border: 1px solid #e0e6ed; overflow: hidden;">
              <tr>
                <td style="background: #1a73e8; padding: 32px 0; text-align: center;">
                  <img src="https://www.mediafire.com/view/z2ljawts5j5w1wh/logo.png" alt="CheFu Academy Logo" width="80" style="border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 8px;" />
                  <h1 style="color: #fff; font-size: 2rem; margin: 0; font-weight: 700; letter-spacing: 1px;">Welcome, ${name}!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 32px 16px 32px; color: #222;">
                  <p style="font-size: 1.1rem; line-height: 1.7; margin: 0 0 18px 0;">🎉 <b>Thank you for joining CheFu Academy!</b></p>
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 18px 0;">
                    You’re now part of a vibrant learning community. Explore curated courses, track your progress, and unlock your full potential.
                  </p>
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 18px 0;">
                    <b>Get started now:</b> Open the CheFu Academy app and dive into your personalized dashboard!
                  </p>
                 
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 18px 0;">
                    Need help? Our support team is here for you. Reply to this email or visit our
                    <a href="https://chefu-academy.vercel.app/support" style="color: #1a73e8; text-decoration: underline;">Support Center</a>.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 32px 32px 32px; color: #888; font-size: 0.98rem;">
                  <hr style="margin: 32px 0 18px 0; border: none; border-top: 1px solid #e0e6ed;" />
                  <p style="margin: 0;">Welcome again, and happy learning!<br />— CheFu Academy Team</p>
                  <p style="margin: 18px 0 0 0; font-size: 0.93rem; color: #b0b0b0;">If you did not sign up for CheFu Academy, please ignore this email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
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

    const mailOptions = {
        from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔐 New Login Alert - CheFu Academy',
        html: `
    <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0; min-height: 100vh;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f8fb; padding: 0; margin: 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(26,115,232,0.07); border: 1px solid #e0e6ed; overflow: hidden;">
              <tr>
                <td style="background: #1a73e8; padding: 32px 0; text-align: center;">
                  <img src="https://www.mediafire.com/view/z2ljawts5j5w1wh/logo.png" alt="CheFu Academy Logo" width="80" style="border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 8px;" />
                  <h1 style="color: #fff; font-size: 1.8rem; margin: 0; font-weight: 700;">Login Detected</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px; color: #222;">
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 16px 0;"><b>Hi ${name},</b></p>
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 18px 0;">We noticed a new login to your CheFu Academy account:</p>
                  <ul style="font-size: 1rem; line-height: 1.7; margin: 0 0 18px 16px;">
                    <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                    <li><strong>Location:</strong> ${
                        locationString || 'Unknown'
                    }</li>
                    <li><strong>Device:</strong> ${device?.brand} ${
            device?.modelName
        } (${device?.osName} ${device?.osVersion})</li>
                  </ul>
                  <p style="font-size: 1rem; line-height: 1.7; margin: 0 0 18px 0;">If this was you, no further action is required. If not, please <a href="https://chefu-academy.vercel.app/settings/account" style="color: #1a73e8;">secure your account</a> immediately.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 32px 32px 32px; color: #888; font-size: 0.98rem;">
                  <hr style="margin: 32px 0 18px 0; border: none; border-top: 1px solid #e0e6ed;" />
                  <p style="margin: 0;">Stay safe,<br />— CheFu Academy Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
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

    const mailOptions = {
        from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔒 Password Changed - CheFu Academy',
        html: `
    <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0; min-height: 100vh;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f8fb;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(26,115,232,0.07); border: 1px solid #e0e6ed; overflow: hidden;">
              <tr>
                <td style="background: #1a73e8; padding: 32px 0; text-align: center;">
                  <img src="https://www.mediafire.com/view/z2ljawts5j5w1wh/logo.png" alt="CheFu Academy Logo" width="80" style="border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 8px;" />
                  <h1 style="color: #fff; font-size: 1.8rem; margin: 0; font-weight: 700;">Password Changed</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px; color: #222;">
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 16px 0;"><b>Hi ${name},</b></p>
                  <p style="font-size: 1.05rem; line-height: 1.7; margin: 0 0 18px 0;">
                    We wanted to let you know that your CheFu Academy password was successfully changed.
                  </p>
                  <p style="font-size: 1rem; line-height: 1.7; margin: 0 0 18px 0;">
                    If this was you, you can safely ignore this email. If not, we recommend resetting your password immediately and contacting support.
                  </p>
                  <p style="font-size: 1rem; line-height: 1.7; margin: 0 0 18px 0;">
                    Need help? Contact us at our
                    <a href="mailto:"chefu.inc@gmail.com" style="color: #1a73e8; text-decoration: underline;">Support Center</a>.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 32px 32px 32px; color: #888; font-size: 0.98rem;">
                  <hr style="margin: 32px 0 18px 0; border: none; border-top: 1px solid #e0e6ed;" />
                  <p style="margin: 0;">Stay safe,<br />— CheFu Academy Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    `,
    };

    try {
        console.log('🚀 Sending password change alert email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to:', email);
        res.json({ message: 'Password change alert email sent!' });
    } catch (e) {
        console.error('❌ Failed to send alert password change email:', e);
        res.status(500).json({ error: 'Email send failed' });
    }
});
module.exports = router;
