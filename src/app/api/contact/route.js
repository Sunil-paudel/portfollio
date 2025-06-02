"use server"
import nodemailer from "nodemailer";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    console.log("API Route: Received form data:", { name, email, message });

    const { GOOGLE_EMAIL, GOOGLE_PASSWORD } = process.env;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
 user: GOOGLE_EMAIL,
 pass: GOOGLE_PASSWORD,
      }
      );

    // Verify transporter configuration (optional, good for debugging)
    try {
      await transporter.verify();
      console.log("API Route: Nodemailer transporter verified successfully.");
    } catch (verifyError) {
      console.error("API Route: Nodemailer transporter verification failed:", verifyError);
      return NextResponse.json({ success: false, error: "Email server verification failed. Please check SMTP credentials." }, { status: 500 });
    }
    
    const mailOptions = {
      from: `"${name}" <${GOOGLE_EMAIL}>`, // Display name from form, actual sender is SMTP_USER
      replyTo: email, // User's email
      to: "paudelsunil16@gmail.com", // Your receiving email address
      subject: `New contact message from ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
      html: `<p>You received a message from:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    const mailOptionsUser = {
      from: `"${(GOOGLE_EMAIL.split('@')[0])}" <${GOOGLE_EMAIL}>`, // Or a generic name like "Support"
      to: email, // User's email
      subject: "Confirmation: Your message has been received",
      text: `Hi ${name},\n\nThank you for contacting us! We have received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nSunil's Portfolio Team`,
      html: `<p>Hi ${name},</p>
             <p>Thank you for contacting us! We have received your message:</p>
             <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em;">${message.replace(/\n/g, '<br>')}</blockquote>
             <p>We will get back to you shortly.</p>
             <p>Best regards,<br/>Sunil's Portfolio Team</p>`,
    };

    console.log("API Route: Attempting to send email...");
    await transporter.sendMail(mailOptions);
    console.log("API Route: Email sent. Attempting to send confirmation to user...");
    await transporter.sendMail(mailOptionsUser);
    console.log("API Route: Confirmation email to user sent.");

    return NextResponse.json(
      { success: true, message: "Message sent successfully! A confirmation has been sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route: Error sending email:", error);
    // Check for specific Nodemailer errors
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
