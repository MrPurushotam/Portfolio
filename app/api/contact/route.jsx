import { NextResponse } from 'next/server';

const nodemailer = require('nodemailer');

export const POST = async (req) => {
    try {
        const { name, email, message, subject } = await req.json();
        if (!name || !email || !message || !subject) {
            return NextResponse.json({ message: 'All fields are required', success: false }, { status: 400 });
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `${subject}`,
            text: `From: ${name} <${email}>\n\n${message}`
        };
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully', success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error sending email', error, success: false }, { status: 500 });
    }
}
