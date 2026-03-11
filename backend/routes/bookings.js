import express from 'express';
import db from '../db.js';
import { sendBookingConfirmation } from '../utils/email.js';

const router = express.Router();

// GET all bookings with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, startDate, endDate, customerId } = req.query;
    let sql = `
      SELECT 
        b.*,
        c.name as customerName,
        c.email as customerEmail,
        c.phone as customerPhone,
        s.name as serviceName,
        s.type as serviceType
      FROM bookings b
      LEFT JOIN customers c ON b.customerId = c.id
      LEFT JOIN services s ON b.serviceId = s.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND b.status = ?';
      params.push(status);
    }
    if (type) {
      sql += ' AND s.type = ?';
      params.push(type);
    }
    if (startDate) {
      sql += ' AND b.createdAt >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND b.createdAt <= ?';
      params.push(endDate);
    }
    if (customerId) {
      sql += ' AND b.customerId = ?';
      params.push(customerId);
    }

    sql += ' ORDER BY b.createdAt DESC';
    const bookings = await db.allAsync(sql, params);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await db.getAsync(`
      SELECT 
        b.*,
        c.name as customerName,
        c.email as customerEmail,
        c.phone as customerPhone,
        s.name as serviceName,
        s.type as serviceType,
        s.price as servicePrice
      FROM bookings b
      LEFT JOIN customers c ON b.customerId = c.id
      LEFT JOIN services s ON b.serviceId = s.id
      WHERE b.id = ?
    `, [req.params.id]);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create booking - WITH AUTO-REPLY EMAIL
router.post('/', async (req, res) => {
  try {
    const {
      customerId, serviceId, startDate, endDate,
      eventDate, guests, totalPrice, status,
      paymentStatus, notes
    } = req.body;

    // Generate booking number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await db.getAsync(
      "SELECT COUNT(*) as count FROM bookings WHERE strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now')"
    );
    const bookingNumber = `BK-${year}${month}-${(count.count + 1).toString().padStart(4, '0')}`;

    const result = await db.runAsync(
      `INSERT INTO bookings (
        bookingNumber, customerId, serviceId, startDate, endDate,
        eventDate, guests, totalPrice, status, paymentStatus,
        notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        bookingNumber, customerId, serviceId, startDate, endDate,
        eventDate, guests || 1, totalPrice || 0, status || 'pending',
        paymentStatus || 'unpaid', notes
      ]
    );

    // ============================================
    // AUTO-REPLY EMAIL TO CLIENT
    // ============================================
    try {
      // Get customer details for email
      const customer = await db.getAsync(
        'SELECT name, email FROM customers WHERE id = ?',
        [customerId]
      );

      // Get service details
      const service = await db.getAsync(
        'SELECT name, type FROM services WHERE id = ?',
        [serviceId]
      );

      // Send confirmation email (don't await - let it run in background)
      sendBookingConfirmation({
        customerName: customer.name,
        customerEmail: customer.email,
        bookingNumber,
        serviceId,
        serviceName: service.name,
        serviceType: service.type,
        startDate: startDate || eventDate,
        endDate,
        guests: guests || 1,
        totalPrice: totalPrice || 0
      }).catch(err => console.error('Background email error:', err));

      console.log(`✅ Auto-reply email triggered for booking ${bookingNumber}`);
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error('❌ Failed to trigger auto-reply email:', emailError);
    }

    res.json({ 
      success: true, 
      id: result.id,
      bookingNumber,
      message: 'Booking created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const {
      customerId, serviceId, startDate, endDate,
      eventDate, guests, totalPrice, status,
      paymentStatus, notes
    } = req.body;

    await db.runAsync(
      `UPDATE bookings SET
        customerId = ?, serviceId = ?, startDate = ?, endDate = ?, eventDate = ?,
        guests = ?, totalPrice = ?, status = ?, paymentStatus = ?, notes = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        customerId, serviceId, startDate, endDate, eventDate,
        guests, totalPrice, status, paymentStatus, notes,
        req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Booking updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    await db.runAsync(
      'UPDATE bookings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ 
      success: true, 
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    await db.runAsync(
      'UPDATE bookings SET paymentStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [paymentStatus, req.params.id]
    );

    res.json({ 
      success: true, 
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET bookings stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM bookings');
    const pending = await db.getAsync("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    const confirmed = await db.getAsync("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'");
    const completed = await db.getAsync("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'");
    const cancelled = await db.getAsync("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'");
    
    const revenue = await db.getAsync(`
      SELECT SUM(totalPrice) as total FROM bookings 
      WHERE status IN ('confirmed', 'completed') AND paymentStatus = 'paid'
    `);
    
    const pendingRevenue = await db.getAsync(`
      SELECT SUM(totalPrice) as total FROM bookings 
      WHERE status = 'pending'
    `);

    res.json({
      counts: {
        total: total.count,
        pending: pending.count,
        confirmed: confirmed.count,
        completed: completed.count,
        cancelled: cancelled.count
      },
      revenue: revenue.total || 0,
      pendingRevenue: pendingRevenue.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;