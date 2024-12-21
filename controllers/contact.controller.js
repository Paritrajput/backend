import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Contact Us Message from ${name}`,
      text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};
export default contact;
