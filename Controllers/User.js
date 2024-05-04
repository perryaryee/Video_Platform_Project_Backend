import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/Users.js";
import nodemailer from "nodemailer";


const SignUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ email, password: hashedPassword });

        await user.save();

        const verificationCode = generateVerificationCode();

        await sendVerificationEmail(email, verificationCode);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ token, message: 'User created successfully. Check your email for verification code' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


async function sendVerificationEmail(email, code) {
    try {
        let transporter = nodemailer.createTransport({
            secure: false, //also tried 'true'
            port: 587,
            //also tried 25 and 465
            service: "gmail",
            auth: {
                user: "ignitelinesgh@gmail.com",
                pass: "rawumjggboumnqjp",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Send email with verification code
        await transporter.sendMail({
            from: '"Your App" <yourapp@example.com>',
            to: email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${code}`,
        });
    } catch (error) {
        throw new Error('Failed to send verification email');
    }
}