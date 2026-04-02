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

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Map event type values to display names
const getEventTypeDisplay = (eventType) => {
  const eventTypeMap = {
    'wedding': 'Wedding',
    'corporate': 'Corporate Meeting',
    'conference': 'Conference',
    'birthday': 'Birthday Party',
    'gala': 'Gala Dinner',
    'virtual': 'Virtual/Online Event'
  };
  
  return eventTypeMap[eventType] || eventType || 'Event Management';
};

// Helper function to safely display array values
const displayArray = (arr) => {
  if (!arr) return 'Not specified';
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.join(', ');
  }
  return 'Not specified';
};

// ============================================
// EMAIL FOR CLIENT (FULL CONFIRMATION)
// ============================================
export const sendClientBookingConfirmation = async (bookingData) => {
  try {
    console.log('📧 Client Email - Full booking data:', JSON.stringify(bookingData, null, 2));

    const {
      customerName,
      customerEmail,
      bookingNumber,
      serviceId,
      serviceName,
      eventType,
      startDate,
      endDate,
      guests,
      totalPrice,
      selectedServices,
      notes,
      
      // Car specific
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      selectedCarModels,
      selectedCarTypes,
      selectedTransmissions,
      selectedFuelTypes,
      numberOfCars,
      carSelectedServices,
      
      // Tour specific
      tourStartDate,
      tourEndDate,
      selectedPackages,
      numberOfTravelers,
      specialRequests,
      tourSelectedServices,
      
      // Event specific
      venuePreference
    } = bookingData;

    // Build the service display name based on service type
    let serviceDisplay = '';
    
    if (serviceId === 1) { // Event
      serviceDisplay = getEventTypeDisplay(eventType);
    } else if (serviceId === 2) { // Car
      serviceDisplay = 'Car Rental';
    } else if (serviceId === 3) { // Tour
      serviceDisplay = 'Tourism Package';
    }

    // Build service-specific details
    let serviceDetailsHtml = '';
    let serviceDetailsText = '';

    if (serviceId === 1) { // Event - FIXED: Removed duplicate "Event Type"
      serviceDetailsHtml = `
        <div class="detail-row">
          <span class="detail-label">Service:</span>
          <span class="detail-value">${getEventTypeDisplay(eventType)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue Preference:</span>
          <span class="detail-value">${venuePreference || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Start Date:</span>
          <span class="detail-value">${formatDate(startDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">End Date:</span>
          <span class="detail-value">${formatDate(endDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${guests}</span>
        </div>
      `;
      serviceDetailsText = `
      - Service: ${getEventTypeDisplay(eventType)}
      - Venue: ${venuePreference || 'Not specified'}
      - Start Date: ${formatDate(startDate)}
      - End Date: ${formatDate(endDate)}
      - Guests: ${guests}`;
    } else if (serviceId === 2) { // Car
      serviceDetailsHtml = `
        <div class="detail-row">
          <span class="detail-label">Pickup Date:</span>
          <span class="detail-value">${pickupDate || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Pickup Time:</span>
          <span class="detail-value">${pickupTime || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Return Date:</span>
          <span class="detail-value">${returnDate || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Return Time:</span>
          <span class="detail-value">${returnTime || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${pickupLocation || 'Kigali International Airport'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Car Models:</span>
          <span class="detail-value">${displayArray(selectedCarModels)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Car Types:</span>
          <span class="detail-value">${displayArray(selectedCarTypes)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transmission:</span>
          <span class="detail-value">${displayArray(selectedTransmissions)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fuel Type:</span>
          <span class="detail-value">${displayArray(selectedFuelTypes)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Cars:</span>
          <span class="detail-value">${numberOfCars || 1}</span>
        </div>
      `;
      serviceDetailsText = `
      - Pickup Date: ${pickupDate || 'Not specified'} at ${pickupTime || 'Not specified'}
      - Return Date: ${returnDate || 'Not specified'} at ${returnTime || 'Not specified'}
      - Location: ${pickupLocation || 'Kigali International Airport'}
      - Car Models: ${displayArray(selectedCarModels)}
      - Car Types: ${displayArray(selectedCarTypes)}
      - Transmission: ${displayArray(selectedTransmissions)}
      - Fuel Type: ${displayArray(selectedFuelTypes)}
      - Number of Cars: ${numberOfCars || 1}`;
    } else if (serviceId === 3) { // Tour - FIXED: Added all fields
      serviceDetailsHtml = `
        <div class="detail-row">
          <span class="detail-label">Tour Packages:</span>
          <span class="detail-value">${displayArray(selectedPackages)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Start Date:</span>
          <span class="detail-value">${formatDate(tourStartDate) || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">End Date:</span>
          <span class="detail-value">${formatDate(tourEndDate) || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Travelers:</span>
          <span class="detail-value">${numberOfTravelers || 1}</span>
        </div>
      `;
      serviceDetailsText = `
      - Tour Packages: ${displayArray(selectedPackages)}
      - Start Date: ${formatDate(tourStartDate) || 'Not specified'}
      - End Date: ${formatDate(tourEndDate) || 'Not specified'}
      - Travelers: ${numberOfTravelers || 1}`;
    }

    // Build services list
    let allSelectedServices = [];
    if (serviceId === 1 && selectedServices) allSelectedServices = selectedServices;
    if (serviceId === 2 && carSelectedServices) allSelectedServices = carSelectedServices;
    if (serviceId === 3 && tourSelectedServices) allSelectedServices = tourSelectedServices;

    const servicesList = allSelectedServices && allSelectedServices.length > 0 
      ? `<div class="services-list">
          <h3>Additional Services Selected</h3>
          <ul>
            ${allSelectedServices.map(service => `<li>✓ ${service}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const servicesListText = allSelectedServices && allSelectedServices.length > 0
      ? `\nAdditional Services Selected:\n${allSelectedServices.map(s => `- ${s}`).join('\n')}`
      : '';

    // Add notes/special requests
    const additionalInfoHtml = (notes || specialRequests) ? `
      <div class="additional-info">
        <h3>Additional Information</h3>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
      </div>
    ` : '';

    const additionalInfoText = (notes || specialRequests) ? `
      
      ADDITIONAL INFORMATION:
      ${notes ? `Notes: ${notes}` : ''}
      ${specialRequests ? `Special Requests: ${specialRequests}` : ''}
    ` : '';

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
          .detail-label { font-weight: bold; color: #666; width: 40%; }
          .detail-value { color: #333; width: 60%; text-align: right; }
          .booking-reference { background-color: #c9a86c; color: white; padding: 10px; text-align: center; border-radius: 8px; font-size: 18px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999; }
          .services-list, .additional-info { background-color: #fef3e2; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .services-list h3, .additional-info h3 { color: #c9a86c; margin-top: 0; margin-bottom: 10px; }
          .services-list ul { list-style: none; padding: 0; margin: 0; }
          .services-list li { padding: 5px 0; color: #666; border-bottom: 1px dashed #e0e0e0; }
          .services-list li:last-child { border-bottom: none; }
          .additional-info p { margin: 10px 0; padding: 10px; background-color: white; border-radius: 5px; }
          .contact-info { margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 8px; }
          .whatsapp-link { color: #25D366; text-decoration: none; font-weight: bold; }
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
            <p>Thank you for choosing THE HURBERT! We have received your booking request.</p>
            
            <div class="booking-reference">
              <strong>Booking Reference:</strong> ${bookingNumber}
            </div>
            
            <h3>Booking Details</h3>
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceDisplay}</span>
              </div>
              ${serviceDetailsHtml}
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span class="detail-value">$${totalPrice}</span>
              </div>
            </div>
            
            ${servicesList}
            ${additionalInfoHtml}
            
            <div class="contact-info">
              <p><strong>What's Next?</strong></p>
              <p>Our team will review your request and contact you within <strong>24 hours</strong> to confirm availability and discuss details.</p>
              <p>If you have any questions in the meantime, please don't hesitate to reach out:</p>
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
      - Service: ${serviceDisplay}
      ${serviceDetailsText}
      - Total Price: $${totalPrice}
      ${servicesListText}
      ${additionalInfoText}
      
      What's Next?
      Our team will review your request and contact you within 24 hours to confirm availability and discuss details.
      
      If you have any questions, please don't hesitate to reach out:
      📞 Phone/WhatsApp: +250 782 169 162
      📧 Email: thehurbertltd@gmail.com
      
      We look forward to creating an unforgettable experience for you!
      
      Best regards,
      The THE HURBERT Team
      
      ---
      1 KN 78 St, Kigali, Rwanda
      © ${new Date().getFullYear()} THE HURBERT. All rights reserved.
    `;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'THE HURBERT'}" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject: `Booking Confirmation - ${serviceDisplay} - ${bookingNumber}`,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Client confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send client confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// EMAIL FOR COMPANY (FULL DETAILS + ACTION ITEMS)
// ============================================
export const sendAdminBookingNotification = async (bookingData) => {
  try {
    console.log('📧 Admin Email - Full booking data received:', JSON.stringify(bookingData, null, 2));

    const {
      customerName,
      customerEmail,
      customerPhone,
      bookingNumber,
      serviceId,
      serviceName,
      startDate,
      endDate,
      guests,
      totalPrice,
      notes,
      
      // Event specific
      eventType,
      venuePreference,
      selectedServices,
      
      // Car specific
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      selectedCarModels,
      selectedCarTypes,
      selectedTransmissions,
      selectedFuelTypes,
      carSelectedServices,
      numberOfCars,
      
      // Tour specific
      tourStartDate,
      tourEndDate,
      selectedPackages,
      tourSelectedServices,
      numberOfTravelers,
      specialRequests
    } = bookingData;

    // Log specific fields to verify they're being received
    console.log('📧 Car Rental Specific Fields:', {
      selectedCarModels,
      selectedCarTypes,
      selectedTransmissions,
      selectedFuelTypes,
      numberOfCars,
      carSelectedServices
    });

    console.log('📧 Event Specific Fields:', {
      eventType,
      venuePreference,
      selectedServices,
      notes
    });

    console.log('📧 Tourism Specific Fields:', {
      selectedPackages,
      specialRequests,
      tourSelectedServices,
      numberOfTravelers
    });

    // Build service-specific details
    let serviceDetails = '';
    let serviceDisplay = '';
    
    if (serviceId === 1) { // Event - FIXED: Removed duplicate "Event Type"
      serviceDisplay = getEventTypeDisplay(eventType);
      serviceDetails = `
        <p><span class="label">Service:</span> <span class="value">${getEventTypeDisplay(eventType) || 'Not specified'}</span></p>
        <p><span class="label">Venue Preference:</span> <span class="value">${venuePreference || 'Not specified'}</span></p>
        <p><span class="label">Start Date:</span> <span class="value">${formatDate(startDate) || 'Not specified'}</span></p>
        <p><span class="label">End Date:</span> <span class="value">${formatDate(endDate) || 'Not specified'}</span></p>
        <p><span class="label">Guests:</span> <span class="value">${guests || 1}</span></p>
      `;
    } else if (serviceId === 2) { // Car
      serviceDisplay = 'Car Rental';
      serviceDetails = `
        <p><span class="label">Pickup Date:</span> <span class="value">${pickupDate || 'Not specified'}</span></p>
        <p><span class="label">Pickup Time:</span> <span class="value">${pickupTime || 'Not specified'}</span></p>
        <p><span class="label">Return Date:</span> <span class="value">${returnDate || 'Not specified'}</span></p>
        <p><span class="label">Return Time:</span> <span class="value">${returnTime || 'Not specified'}</span></p>
        <p><span class="label">Location:</span> <span class="value">${pickupLocation || 'Not specified'}</span></p>
        <p><span class="label">Car Models:</span> <span class="value">${displayArray(selectedCarModels)}</span></p>
        <p><span class="label">Car Types:</span> <span class="value">${displayArray(selectedCarTypes)}</span></p>
        <p><span class="label">Transmission:</span> <span class="value">${displayArray(selectedTransmissions)}</span></p>
        <p><span class="label">Fuel Types:</span> <span class="value">${displayArray(selectedFuelTypes)}</span></p>
        <p><span class="label">Number of Cars:</span> <span class="value">${numberOfCars || 1}</span></p>
      `;
    } else if (serviceId === 3) { // Tour - FIXED: Added all fields
      serviceDisplay = 'Tourism Package';
      serviceDetails = `
        <p><span class="label">Tour Packages:</span> <span class="value">${displayArray(selectedPackages)}</span></p>
        <p><span class="label">Start Date:</span> <span class="value">${formatDate(tourStartDate) || 'Not specified'}</span></p>
        <p><span class="label">End Date:</span> <span class="value">${formatDate(tourEndDate) || 'Not specified'}</span></p>
        <p><span class="label">Number of Travelers:</span> <span class="value">${numberOfTravelers || 1}</span></p>
      `;
    }

    // Build selected services list
    let allSelectedServices = [];
    if (serviceId === 1 && selectedServices) allSelectedServices = selectedServices;
    if (serviceId === 2 && carSelectedServices) allSelectedServices = carSelectedServices;
    if (serviceId === 3 && tourSelectedServices) allSelectedServices = tourSelectedServices;

    const servicesList = allSelectedServices && allSelectedServices.length > 0 ? `
      <div class="services-section">
        <h3 class="section-title">Additional Services Selected</h3>
        <div class="booking-details">
          <ul style="list-style: none; padding: 0;">
            ${allSelectedServices.map(service => 
              `<li style="padding: 8px 0; border-bottom: 1px dashed #e0e0e0;">✓ ${service}</li>`
            ).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    // Combine notes and special requests
    const additionalInfo = (notes || specialRequests) ? `
      <h2 class="section-title">Additional Information</h2>
      <div class="booking-details">
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
      </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c9a86c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
          .detail-row { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #666; display: inline-block; width: 140px; }
          .value { color: #333; }
          .booking-reference { background-color: #c9a86c; color: white; padding: 10px; text-align: center; border-radius: 8px; font-size: 18px; margin: 20px 0; }
          .section-title { color: #c9a86c; font-size: 18px; margin: 20px 0 10px 0; border-bottom: 2px solid #c9a86c; padding-bottom: 5px; }
          .admin-note { background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .admin-note p { margin: 5px 0; color: #856404; }
          .admin-note ul { margin: 5px 0; color: #856404; }
          .services-section { margin: 20px 0; }
          .highlight { background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 NEW BOOKING REQUEST</h1>
          </div>
          <div class="content">
            <div class="booking-reference">
              <strong>Booking Reference:</strong> ${bookingNumber}
            </div>
            
            <h2 class="section-title">Customer Information</h2>
            <div class="booking-details">
              <div class="detail-row"><span class="label">Name:</span> <span class="value">${customerName}</span></div>
              <div class="detail-row"><span class="label">Email:</span> <span class="value">${customerEmail}</span></div>
              <div class="detail-row"><span class="label">Phone:</span> <span class="value">${customerPhone || 'Not provided'}</span></div>
            </div>
            
            <h2 class="section-title">Booking Details</h2>
            <div class="booking-details">
              <div class="detail-row"><span class="label">Service:</span> <span class="value">${serviceDisplay}</span></div>
              ${serviceDetails}
              <div class="detail-row"><span class="label">Total Price:</span> <span class="value">$${totalPrice}</span></div>
            </div>
            
            ${servicesList}
            
            ${additionalInfo}
            
            <div class="admin-note">
              <p><strong>📋 ACTION REQUIRED:</strong></p>
              <ul>
                <li>✓ Review all booking details above carefully</li>
                <li>✓ Contact customer within 24 hours</li>
                <li>✓ Confirm availability for selected options</li>
                <li>✓ Update status in admin dashboard</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:5173/admin/bookings" style="background-color: #c9a86c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Admin Dashboard</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      🔔 NEW BOOKING REQUEST
      
      Booking Reference: ${bookingNumber}
      
      CUSTOMER INFORMATION:
      Name: ${customerName}
      Email: ${customerEmail}
      Phone: ${customerPhone || 'Not provided'}
      
      BOOKING DETAILS:
      Service: ${serviceDisplay}
      ${serviceId === 1 ? `
      Service: ${getEventTypeDisplay(eventType) || 'Not specified'}
      Venue: ${venuePreference || 'Not specified'}
      Start Date: ${formatDate(startDate) || 'Not specified'}
      End Date: ${formatDate(endDate) || 'Not specified'}
      Guests: ${guests || 1}
      ` : ''}
      ${serviceId === 2 ? `
      Pickup Date: ${pickupDate || 'Not specified'} at ${pickupTime || 'Not specified'}
      Return Date: ${returnDate || 'Not specified'} at ${returnTime || 'Not specified'}
      Location: ${pickupLocation || 'Not specified'}
      Car Models: ${displayArray(selectedCarModels)}
      Car Types: ${displayArray(selectedCarTypes)}
      Transmission: ${displayArray(selectedTransmissions)}
      Fuel Types: ${displayArray(selectedFuelTypes)}
      Number of Cars: ${numberOfCars || 1}
      ` : ''}
      ${serviceId === 3 ? `
      Tour Packages: ${displayArray(selectedPackages)}
      Start Date: ${formatDate(tourStartDate) || 'Not specified'}
      End Date: ${formatDate(tourEndDate) || 'Not specified'}
      Travelers: ${numberOfTravelers || 1}
      ` : ''}
      Total Price: $${totalPrice}
      
      ${allSelectedServices && allSelectedServices.length > 0 ? `
      ADDITIONAL SERVICES SELECTED:
      ${allSelectedServices.map(s => `- ${s}`).join('\n')}
      ` : ''}
      
      ${notes ? `ADDITIONAL NOTES: ${notes}` : ''}
      ${specialRequests ? `SPECIAL REQUESTS: ${specialRequests}` : ''}
      
      ACTION REQUIRED:
      ✓ Review all booking details above carefully
      ✓ Contact customer within 24 hours
      ✓ Confirm availability for selected options
      ✓ Update status in admin dashboard
      
      View in Admin Dashboard: http://localhost:5173/admin/bookings
    `;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'THE HURBERT'}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `🔔 NEW BOOKING: ${bookingNumber} - ${customerName} - ${serviceDisplay}`,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CONTACT FORM EMAILS
// ============================================

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
            
            <div class="contact-info">
              <p><strong>What's Next?</strong></p>
              <p>Our team will review your inquiry and get back to you within <strong>24 hours</strong> during business days.</p>
              <p>If you have any questions in the meantime, please don't hesitate to reach out:</p>
              <p>📞 <strong>Phone/WhatsApp:</strong> +250 782 169 162</p>
              <p>📧 <strong>Email:</strong> thehurbertltd@gmail.com</p>
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
      
      What's Next?
      Our team will review your inquiry and get back to you within 24 hours during business days.
      
      If you have any questions, please don't hesitate to reach out:
      📞 Phone/WhatsApp: +250 782 169 162
      📧 Email: thehurbertltd@gmail.com
      
      We look forward to assisting you!
      
      Best regards,
      The THE HURBERT Team
      
      ---
      1 KN 78 St, Kigali, Rwanda
      © ${new Date().getFullYear()} THE HURBERT. All rights reserved.
    `;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'THE HURBERT'}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Thank you for contacting THE HURBERT',
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact auto-reply sent to:', email);
    return { success: true, messageId: info.messageId };
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c9a86c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
          .label { font-weight: bold; color: #666; display: inline-block; width: 100px; }
          .value { color: #333; }
          .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #c9a86c; }
          .admin-note { background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .admin-note p { margin: 5px 0; color: #856404; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 NEW CONTACT FORM SUBMISSION</h1>
          </div>
          <div class="content">
            <div class="details">
              <p><span class="label">Message ID:</span> <span class="value">${id || 'N/A'}</span></p>
              <p><span class="label">Name:</span> <span class="value">${name}</span></p>
              <p><span class="label">Email:</span> <span class="value">${email}</span></p>
              <p><span class="label">Phone:</span> <span class="value">${phone || 'Not provided'}</span></p>
              <p><span class="label">Subject:</span> <span class="value">${subject || 'No subject'}</span></p>
            </div>
            
            <h3>Message:</h3>
            <div class="message-box">
              <p>${message}</p>
            </div>
            
            <div class="admin-note">
              <p><strong>📋 ACTION REQUIRED:</strong></p>
              <p>✓ Review this message</p>
              <p>✓ Respond to the customer within 24 hours</p>
              <p>✓ Update status in admin dashboard</p>
            </div>
            
            <p style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:5173/admin/messages" style="background-color: #c9a86c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} THE HURBERT</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      📬 NEW CONTACT FORM SUBMISSION
      
      Message ID: ${id || 'N/A'}
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject || 'No subject'}
      
      Message:
      ${message}
      
      ACTION REQUIRED:
      ✓ Review this message
      ✓ Respond to the customer within 24 hours
      ✓ Update status in admin dashboard
      
      View in Admin Dashboard: http://localhost:5173/admin/messages
    `;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'THE HURBERT'}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `📧 New Contact: ${name} - ${subject || 'No subject'}`,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification sent to admin');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    return { success: false, error: error.message };
  }
};