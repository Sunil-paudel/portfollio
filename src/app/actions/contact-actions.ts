
'use server';

import { z } from 'zod';

// Define the schema for contact form values, matching the client-side schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function sendContactMessage(data: ContactFormValues): Promise<{ success: boolean; message?: string; error?: string }> {
  // Validate the data on the server side as well
  const parsedData = contactFormSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Server-side validation failed:", parsedData.error.flatten().fieldErrors);
    return { success: false, error: "Invalid data provided. Please check your input." };
  }

  const { name, email, message } = parsedData.data;
  const recipientEmail = "paudelsunil16@gmail.com"; // Target email address

  console.log(`Simulating sending email:
    To: ${recipientEmail}
    From: ${name} <${email}>
    Subject: New Contact Form Message from ${name}
    Message:
    ${message}
  `);

  // **IMPORTANT**: To actually send an email, you would integrate an email service here.
  // For example, using Nodemailer with an SMTP provider, or services like Resend, SendGrid, AWS SES, etc.
  // This typically involves:
  // 1. Installing the necessary library (e.g., `npm install resend` or `npm install nodemailer`).
  // 2. Setting up API keys or credentials, usually in environment variables (e.g., process.env.RESEND_API_KEY).
  // 3. Writing the code to send the email using the chosen library.

  // Example with Resend (pseudo-code, assuming Resend is set up):
  /*
  import { Resend } from 'resend';

  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API key is not configured.');
    return { success: false, error: "Email service is not configured on the server." };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'YourPortfolio <your-verified-sending-email@yourdomain.com>', // Replace with your verified sending email
      to: [recipientEmail],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h1>New Message via Portfolio Contact Form</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (emailError) {
      console.error("Resend email sending error:", emailError);
      return { success: false, error: "Failed to send message due to a server error." };
    }

    console.log("Email sent successfully via Resend:", emailData);
    return { success: true, message: "Message sent successfully!" };

  } catch (error) {
    console.error("Generic email sending error:", error);
    return { success: false, error: "An unexpected error occurred while trying to send the message." };
  }
  */

  // For now, we'll just simulate success after a short delay.
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Message sent successfully (simulated)!" };
}
