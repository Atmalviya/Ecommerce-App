const nodemailer = require('nodemailer');
import { Request, Response } from 'express';
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text
        };
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send email');
    }
};
