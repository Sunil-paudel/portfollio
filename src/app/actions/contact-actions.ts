
'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

// Define the schema for contact form values, matching the client-side schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function sendContactMessage(data: ContactFormValues): Promise<{ success: boolean; message?: string; error?: string }> {
  const parsedData = contactFormSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Server-side validation failed:", parsedData.error.flatten().fieldErrors);
    return { success: false, error: "Invalid data provided. Please check your input." };
  }

  const { name, email, message } = parsedData.data;
  const recipientEmail = "paudelsunil16@gmail.com";

  // Nodemailer transporter setup
  // Ensure you have set these environment variables in your .env file
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  // Enhanced logging for debugging SMTP environment variables
  console.log('--- Checking SMTP Environment Variables for Contact Form ---');
  console.log(`Attempting to read from .env file in project root.`);
  console.log(`SMTP_HOST: ${SMTP_HOST}`);
  console.log(`SMTP_PORT: ${SMTP_PORT}`);
  console.log(`SMTP_USER: ${SMTP_USER}`);
  // Avoid logging the actual password, just confirm its presence
  console.log(`SMTP_PASS: ${SMTP_PASS ? '****** (exists)' : 'NOT FOUND or empty'}`);
  console.log(`SMTP_FROM_EMAIL: ${SMTP_FROM_EMAIL}`);
  console.log(`SMTP_SECURE (derived from env, should be true/false): ${smtpSecure}`);
  console.log('--- End of SMTP Variable Check ---');


  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
    console.error('CRITICAL ERROR: One or more SMTP environment variables are missing or empty. Please check your .env file in the project root and ensure the server was restarted after the last .env modification.');
    return {
      success: false,
      error: "Email service is not configured on the server. Admins: Please check SMTP environment variables and restart the server if changes were made to .env."
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: smtpSecure, // true for 465, false for other ports like 587 (TLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${SMTP_FROM_EMAIL}>`, // Sender address (use a verified address or your SMTP_USER)
    replyTo: email, // User's email as reply-to
    to: recipientEmail, // List of receivers
    subject: `New Contact Form Message from ${name} (Portfolio)`, // Subject line
    text: `You have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Plain text body
    html: `
      <h1>New Message via Portfolio Contact Form</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending email with Nodemailer:", error);
    // It's good practice to avoid exposing detailed error messages to the client.
    // Log the detailed error on the server and return a generic error to the client.
    let clientErrorMessage = "Failed to send message due to a server error.";
    if (error instanceof Error && error.message.includes('Invalid login')) {
        clientErrorMessage = "Failed to send message: Authentication error with email server. Admins: Please check SMTP credentials in .env and ensure the sending Gmail account allows access (e.g., via App Password).";
    } else if (error instanceof Error && error.message.includes('ENOTFOUND') ) {
         clientErrorMessage = "Failed to send message: Could not connect to email server. Admins: Please check SMTP host/port in .env.";
    }
    return { success: false, error: clientErrorMessage };
  }
}
