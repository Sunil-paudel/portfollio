"use server"
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parse JSON from the request (front-end must send JSON, not FormData)
    const { name, email, message } = await request.json();

   

    // Setup nodemailer transporter with Gmail SMTP and env credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    // Email to you (paudelsunil16@gmail.com) with user info
    const mailToYou = {
      from: process.env.GOOGLE_EMAIL,
      to: "paudelsunil16@gmail.com",
      subject: `New contact message from ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
    };

    // Confirmation email to user
    const mailToUser = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Message Received - Thank you!",
      text: `Hi ${name},\n\nThank you for contacting us! We have received your message:\n"${message}"\n\nWe will get back to you shortly.`,
    };

    // Send both emails
    await transporter.sendMail(mailToYou);
    await transporter.sendMail(mailToUser);

    // Respond success
    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
