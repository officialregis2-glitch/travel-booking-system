import nodemailer from 'nodemailer';

// Zoho SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com', // Use smtp.zoho.eu if your account is based in Europe
  port: 465,             // Zoho recommends port 465 for SSL
  secure: true,          // true for port 465, false for port 587
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_APP_PASSWORD ? process.env.ZOHO_APP_PASSWORD.replace(/\s/g, '') : '',
  },
});

export async function sendEmailNotification(to, subject, htmlContent) {
  if (!to) {
    console.error('❌ No recipient email address provided');
    return false;
  }
  
  if (!process.env.ZOHO_USER || !process.env.ZOHO_APP_PASSWORD) {
    console.error('❌ Zoho credentials not configured in .env');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Travel Booking System" <${process.env.ZOHO_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✅ Email sent from Zoho to ${to} (ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('❌ Zoho Email error:', error.message);
    return false;
  }
}