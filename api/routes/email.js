const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send welcome email
router.post("/send-welcome", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Missing email or name" });
  }

  const mailOptions = {
    from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🎉 Welcome to CheFu Academy!",
    html: `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9; border: 1px solid #e0e0e0;">
    <h2 style="color: #1a73e8;">Welcome to CheFu Academy, ${name}!</h2>

    <p style="font-size: 16px; line-height: 1.6;">
      We’re thrilled to have you on board. CheFu Academy is your gateway to mastering new skills, deepening your knowledge, and unlocking your potential.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Open the CheFu Academy app on your device to explore your personalized dashboard, access curated courses, track your progress, and connect with a thriving learning community.
    </p>

    <p style="font-size: 16px; line-height: 1.6; text-align: center; margin: 30px 0;">
      🚀 Launch the app and start learning today!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Need help or have questions? We're here for you. Just reply to this email or visit our 
      <a href="https://chefu-academy.com/support" style="color: #1a73e8; text-decoration: none;">Support Center</a>.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #888;">
      Welcome again, and happy learning!<br />
      — The CheFu Inc. Team
    </p>
  </div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Welcome email sent!" });
  } catch (e) {
    console.error("❌ Failed to send welcome email:", e);
    res.status(500).json({ error: "Email send failed" });
  }
});

module.exports = router;
