import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path (backend folder)
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Check if variables are loaded
console.log('🔍 Email Debug:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Found' : '❌ Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Found' : '❌ Missing');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM ? '✅ Found' : '❌ Missing');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Format service type for display
const formatServiceType = (serviceId) => {
  switch (serviceId) {
    case 1: return 'Event Management';
    case 2: return 'Car Rental';
    case 3: return 'Tourism Package';
    default: return 'Booking';
  }
};

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generic send email function
export const sendEmail = async (to, subject, html, text) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Generate booking confirmation email
export const sendBookingConfirmation = async (bookingData) => {
  try {
    const {
      customerName,
      customerEmail,
      bookingNumber,
      serviceId,
      serviceName,
      startDate,
      endDate,
      guests,
      totalPrice
    } = bookingData;

    const displayServiceName = serviceName || formatServiceType(serviceId);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c9a86c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .booking-reference { background-color: #c9a86c; color: white; padding: 10px; text-align: center; border-radius: 8px; font-size: 18px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999; }
          .contact-info { margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 8px; }
          .contact-info p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THE HURBERT</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for choosing THE HURBERT! We have received your booking request and are excited to serve you.</p>
            
            <div class="booking-reference">
              <strong>Booking Reference:</strong> ${bookingNumber}
            </div>
            
            <h3>Booking Details</h3>
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${displayServiceName}</span>
              </div>
              ${startDate ? `
              <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${formatDate(startDate)}</span>
              </div>
              ` : ''}
              ${endDate ? `
              <div class="detail-row">
                <span class="detail-label">End Date:</span>
                <span class="detail-value">${formatDate(endDate)}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Number of Guests:</span>
                <span class="detail-value">${guests}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span class="detail-value">$${totalPrice}</span>
              </div>
            </div>
            
            <div class="contact-info">
              <p><strong>What's Next?</strong></p>
              <p>Our team will review your request and contact you within <strong>24 hours</strong> to confirm availability and discuss details.</p>
              <p>If you have any questions, please don't hesitate to reach out:</p>
              <p>📞 <strong>Phone/WhatsApp:</strong> +250 782 169 162</p>
              <p>📧 <strong>Email:</strong> thehurbertltd@gmail.com</p>
            </div>
            
            <p>We look forward to creating an unforgettable experience for you!</p>
            <p>Best regards,<br>The THE HURBERT Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} THE HURBERT. All rights reserved.</p>
            <p>1 KN 78 St, Kigali, Rwanda</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      THE HURBERT - Booking Confirmation
      
      Dear ${customerName},
      
      Thank you for choosing THE HURBERT! We have received your booking request.
      
      Booking Reference: ${bookingNumber}
      
      Booking Details:
      - Service: ${displayServiceName}
      ${startDate ? `- Start Date: ${formatDate(startDate)}` : ''}
      ${endDate ? `- End Date: ${formatDate(endDate)}` : ''}
      - Number of Guests: ${guests}
      - Total Price: $${totalPrice}
      
      What's Next?
      Our team will review your request and contact you within 24 hours to confirm availability and discuss details.
      
      Contact Information:
      Phone/WhatsApp: +250 782 169 162
      Email: thehurbertltd@gmail.com
      
      We look forward to creating an unforgettable experience for you!
      
      Best regards,
      The THE HURBERT Team
      
      ---
      1 KN 78 St, Kigali, Rwanda
    `;

    return await sendEmail(customerEmail, `Booking Confirmation - ${displayServiceName} - ${bookingNumber}`, html, text);
    
  } catch (error) {
    console.error('❌ Failed to send booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send contact auto-reply to client
export const sendContactAutoReply = async (contactData) => {
  try {
    const { name, email, message } = contactData;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c9a86c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .message-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; font-style: italic; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999; }
          .contact-info { margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 8px; }
          .whatsapp-button { display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THE HURBERT</h1>
            <p>We've Received Your Message</p>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for contacting THE HURBERT! We have received your message and appreciate you reaching out to us.</p>
            
            <div class="message-box">
              <p><strong>Your message:</strong></p>
              <p>"${message}"</p>
            </div>
            
            <p>Our team will review your inquiry and get back to you within <strong>24 hours</strong> during business days.</p>
            
            <div class="contact-info">
              <p><strong>Need immediate assistance?</strong></p>
              <p>For urgent matters, you can reach us on WhatsApp:</p>
              <p>📱 <strong>+250 782 169 162</strong></p>
              <a href="https://wa.me/250782169162" class="whatsapp-button">Chat on WhatsApp</a>
            </div>
            
            <p>We look forward to assisting you!</p>
            <p>Best regards,<br>The THE HURBERT Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} THE HURBERT. All rights reserved.</p>
            <p>1 KN 78 St, Kigali, Rwanda</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      THE HURBERT - We've Received Your Message
      
      Dear ${name},
      
      Thank you for contacting THE HURBERT! We have received your message and appreciate you reaching out to us.
      
      Your message:
      "${message}"
      
      Our team will review your inquiry and get back to you within 24 hours during business days.
      
      For urgent matters, you can reach us on WhatsApp: +250 782 169 162
      
      We look forward to assisting you!
      
      Best regards,
      The THE HURBERT Team
      
      ---
      1 KN 78 St, Kigali, Rwanda
    `;

    return await sendEmail(email, 'Thank you for contacting THE HURBERT', html, text);
  } catch (error) {
    console.error('❌ Failed to send contact auto-reply:', error);
    return { success: false, error: error.message };
  }
};

// Send contact notification to admin
export const sendContactNotification = async (contactData) => {
  try {
    const { name, email, phone, subject, message, id } = contactData;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background-color: #c9a86c; color: white; padding: 15px; text-align: center; }
          .details { background-color: #f5f5f5; padding: 20px; margin: 20px 0; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📬 NEW CONTACT FORM SUBMISSION</h1>
        </div>
        <div class="details">
          <p><span class="label">Message ID:</span> ${id || 'N/A'}</p>
          <p><span class="label">Name:</span> ${name}</p>
          <p><span class="label">Email:</span> ${email}</p>
          <p><span class="label">Phone:</span> ${phone || 'Not provided'}</p>
          <p><span class="label">Subject:</span> ${subject || 'No subject'}</p>
          <p><span class="label">Message:</span></p>
          <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
        <p>View in admin dashboard: <a href="http://localhost:5173/admin/messages">Click here</a></p>
      </body>
      </html>
    `;

    const text = `
      NEW CONTACT FORM SUBMISSION
      
      Message ID: ${id || 'N/A'}
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject || 'No subject'}
      
      Message:
      ${message}
      
      View in admin dashboard: http://localhost:5173/admin/messages
    `;

    return await sendEmail(process.env.EMAIL_USER, `📧 New Contact: ${name} - ${subject || 'No subject'}`, html, text);
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    return { success: false, error: error.message };
  }
};