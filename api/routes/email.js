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
      <h2>Hello ${name},</h2>
      <p>Welcome to <strong>CheFu Academy</strong>! We're excited to have you join us.</p>
      <p>Start exploring your dashboard, and if you have any questions, we're here to help!</p>
      <a href="https://chefu-academy.com/dashboard" style="padding: 10px 20px; background: #1a73e8; color: white; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
      <p>Happy learning!<br/>— The CheFu Team</p>
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
