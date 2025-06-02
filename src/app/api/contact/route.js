"use server";
import nodemailer from "nodemailer";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    console.log("API Route: Received form data:", { name, email, message });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: "paudelsunil16@gmail.com",
      subject: `New contact message from ${name}`,
      text: `You received a message from ${name}`,
      html: `<p>You received a message from:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    const mailOptionsUser = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Confirmation: Your message has been received",
      text: `Hi ${name},\n\nThank you for contacting us! We have received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nSunil's Portfolio Team`,
      html: `<p>Hi ${name},</p>
             <p>Thank you for contacting us! We have received your message:</p>
             <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em;">${message.replace(/\n/g, '<br>')}</blockquote>
             <p>We will get back to you shortly.</p>
             <p>Best regards,<br/>Sunil Paudel</p>`,
    };

    console.log("API Route: Sending email...");
    await transporter.sendMail(mailOptions);

    console.log("API Route: Sending confirmation to user...");
    await transporter.sendMail(mailOptionsUser);

    return NextResponse.json(
      { success: true, message: "Message sent successfully! A confirmation has been sent to your email." },
      { status: 200 }
    );

  } catch (error) {
    console.error("API Route: Error sending email:", error);

    let errorMessage = "Failed to send message. Please try again later.";
    if (error.code === 'EENVELOPE') {
      errorMessage = "Invalid email address(es) provided.";
    } else if (error.code === 'EAUTH') {
      errorMessage = "Email authentication failed. Please check server credentials.";
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = "Could not connect to email server. Please try again later.";
    }

    return NextResponse.json(
      { success: false, error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
