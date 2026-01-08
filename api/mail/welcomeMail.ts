import { SendMailOptions } from 'nodemailer';

interface WelcomeMailProps {
    email: string;
    name: string;
}

/**
 * Generates the mail options for the welcome email.
 */
export const welcomeMail = ({
    email,
    name,
}: WelcomeMailProps): SendMailOptions => ({
    from: `"CheFu Academy" ― <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🎉 Welcome to CheFu Academy!',
    html: `
  <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0; min-height: 100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f8fb;">
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
                <p style="font-size: 1.1rem; line-height: 1.7;">🎉 <b>Thank you for joining CheFu Academy!</b></p>
                <p style="font-size: 1.05rem; line-height: 1.7;">
                  You’re now part of a vibrant learning community. Explore curated courses, track your progress, and unlock your full potential.
                </p>
                <p style="font-size: 1.05rem; line-height: 1.7;">
                  <b>Get started now:</b> Open the CheFu Academy app and dive into your personalized dashboard!
                </p>
                <p style="font-size: 1.05rem; line-height: 1.7;">
                  Need help? Our support team is here for you. Reply to this email or visit our
                  <a href="https://chefu-academy.vercel.app/support" style="color: #1a73e8; text-decoration: underline;">Support Center</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 32px 32px; color: #888; font-size: 0.98rem;">
                <hr style="margin: 32px 0 18px 0; border-top: 1px solid #e0e6ed;" />
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
});
