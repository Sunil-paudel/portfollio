
import nodemailer from "nodemailer";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    console.log("API Route: Received message from", name, email, message);

    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_SECURE || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
      console.error("API Route: SMTP environment variables are not properly configured.");
      return NextResponse.json({ success: false, error: "Server configuration error for sending email." }, { status: 500 });
    }
    
    console.log("API Route: Using SMTP Config:", { SMTP_HOST, SMTP_PORT, SMTP_SECURE: SMTP_SECURE === 'true', SMTP_USER, SMTP_FROM_EMAIL });


    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_SECURE === 'true', // Convert string to boolean
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      // Add timeout options for debugging if needed
      // connectionTimeout: 10000, // 10 seconds
      // greetingTimeout: 10000, // 10 seconds
      // socketTimeout: 10000, // 10 seconds
    });

    // Verify transporter configuration (optional, good for debugging)
    try {
      await transporter.verify();
      console.log("API Route: Nodemailer transporter verified successfully.");
    } catch (verifyError) {
      console.error("API Route: Nodemailer transporter verification failed:", verifyError);
      return NextResponse.json({ success: false, error: "Email server verification failed. Please check SMTP credentials." }, { status: 500 });
    }
    
    const mailToAdmin = {
      from: `"${name}" <${SMTP_FROM_EMAIL}>`, // Display name from form, actual sender is SMTP_USER
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

    const mailToUser = {
      from: `"${(SMTP_FROM_EMAIL.split('@')[0])}" <${SMTP_FROM_EMAIL}>`, // Or a generic name like "Support"
      to: email, // User's email
      subject: "Message Received - Thank you!",
      text: `Hi ${name},\n\nThank you for contacting us! We have received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nSunil's Portfolio Team`,
      html: `<p>Hi ${name},</p>
             <p>Thank you for contacting us! We have received your message:</p>
             <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em;">${message.replace(/\n/g, '<br>')}</blockquote>
             <p>We will get back to you shortly.</p>
             <p>Best regards,<br/>Sunil's Portfolio Team</p>`,
    };

    console.log("API Route: Attempting to send email to admin...");
    await transporter.sendMail(mailToAdmin);
    console.log("API Route: Email to admin sent. Attempting to send confirmation to user...");
    await transporter.sendMail(mailToUser);
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
