import { SendMailOptions } from 'nodemailer';

interface LoginAlertMailProps {
    email: string;
    name: string;
    location: string | null;
    device: {
        brand?: string;
        modelName?: string;
        osName?: string;
        osVersion?: string;
    };
    time?: string;
}

/**
 * Generates the mail options for a new login alert.
 */
export const loginAlertMail = ({
    email,
    name,
    location,
    device,
    time = new Date().toLocaleString(),
}: LoginAlertMailProps): SendMailOptions => ({
    from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🔐 New Login Alert - CheFu Academy',
    html: `
  <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0; min-height: 100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f8fb;">
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
                <p style="font-size: 1.05rem; line-height: 1.7;"><b>Hi ${name},</b></p>
                <p style="font-size: 1.05rem; line-height: 1.7;">We noticed a new login to your CheFu Academy account:</p>
                <ul style="font-size: 1rem; line-height: 1.7; margin: 0 0 18px 16px;">
                  <li><strong>Time:</strong> ${time}</li>
                  <li><strong>Location:</strong> ${location || 'Unknown'}</li>
                  <li><strong>Device:</strong> ${device?.brand || ''} ${
        device?.modelName || ''
    } (${device?.osName || ''} ${device?.osVersion || ''})</li>
                </ul>
                <p style="font-size: 1rem; line-height: 1.7;">
                  If this was you, no action is required. If not, please 
                  <a href="https://chefu-academy.vercel.app/settings/account" style="color: #1a73e8;">secure your account</a> immediately.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 32px; color: #888; font-size: 0.98rem;">
                <hr style="margin: 32px 0; border-top: 1px solid #e0e6ed;" />
                <p>Stay safe,<br />— CheFu Academy Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
});
