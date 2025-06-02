
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
  const recipientEmail = "paudelsunil16@gmail.com"; // Admin email

  // Nodemailer transporter setup
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  console.log('--- Checking SMTP Environment Variables for Contact Form ---');
  console.log(`Attempting to read from .env file in project root.`);
  console.log(`SMTP_HOST: ${SMTP_HOST}`);
  console.log(`SMTP_PORT: ${SMTP_PORT}`);
  console.log(`SMTP_USER: ${SMTP_USER}`);
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
    secure: smtpSecure, 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Email to Admin
  const adminMailOptions = {
    from: `"${name}" <${SMTP_FROM_EMAIL}>`, 
    replyTo: email, 
    to: recipientEmail, 
    subject: `New Contact Form Message from ${name} (Portfolio)`,
    text: `You have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h1>New Message via Portfolio Contact Form</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // Confirmation Email to User
  const userConfirmationMailOptions = {
    from: `"Sunil's Portfolio" <${SMTP_FROM_EMAIL}>`, // Use your portfolio name or your name
    to: email, // The user's email address
    subject: `Message Received - Sunil's Portfolio`,
    text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you as soon as possible.\n\nBest regards,\nSunil Paudel`,
    html: `
      <h1>Message Received!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for contacting me through my portfolio. I've received your message and will get back to you as soon as possible.</p>
      <p><strong>Your Message:</strong></p>
      <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 5px; color: #555;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <p>Best regards,<br/>Sunil Paudel</p>
    `,
  };

  try {
    // Send email to admin
    const adminEmailInfo = await transporter.sendMail(adminMailOptions);
    console.log("Message to admin sent: %s", adminEmailInfo.messageId);

    // Attempt to send confirmation email to user
    try {
      const userEmailInfo = await transporter.sendMail(userConfirmationMailOptions);
      console.log("Confirmation email to user sent: %s", userEmailInfo.messageId);
    } catch (userEmailError) {
      console.error("Error sending confirmation email to user:", userEmailError);
      // Don't fail the whole operation if only the confirmation email fails
      // You might want to log this more robustly in a real application
    }

    return { success: true, message: "Message sent successfully! A confirmation has been sent to your email." };
  } catch (error) {
    console.error("Error sending email with Nodemailer:", error);
    let clientErrorMessage = "Failed to send message due to a server error.";
    if (error instanceof Error && error.message.includes('Invalid login')) {
        clientErrorMessage = "Failed to send message: Authentication error with email server. Admins: Please check SMTP credentials in .env and ensure the sending Gmail account allows access (e.g., via App Password).";
    } else if (error instanceof Error && error.message.includes('ENOTFOUND') ) {
         clientErrorMessage = "Failed to send message: Could not connect to email server. Admins: Please check SMTP host/port in .env.";
    }
    return { success: false, error: clientErrorMessage };
  }
}
