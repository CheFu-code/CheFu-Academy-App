const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 📬 POST /api/email
router.post("/paypal-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
    from: `"CheFu Academy" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent." });
  } catch (error) {
    console.error("❌ Email error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
