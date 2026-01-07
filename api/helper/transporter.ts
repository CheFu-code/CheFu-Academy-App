import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Nodemailer transporter setup
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
