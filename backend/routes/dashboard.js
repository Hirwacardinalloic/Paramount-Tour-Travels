import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET dashboard stats
router.get('/', async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get overview counts
    const [
      totalBookings,
      totalEvents,
      totalCars,
      totalTours,
      totalPartners,
      totalStaff,
      unreadMessages
    ] = await Promise.all([
      db.getAsync('SELECT COUNT(*) as count FROM bookings'),
      db.getAsync("SELECT COUNT(*) as count FROM events WHERE status = 'active'"),
      db.getAsync("SELECT COUNT(*) as count FROM cars WHERE status = 'available'"),
      db.getAsync("SELECT COUNT(*) as count FROM tourism WHERE status = 'active'"),
      db.getAsync("SELECT COUNT(*) as count FROM partners WHERE status = 'active'"),
      db.getAsync("SELECT COUNT(*) as count FROM staff WHERE status = 'active'"),
      db.getAsync("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'")
    ]);

    // Get booking status counts
    const bookingStats = await db.getAsync(`
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);

    // Get recent bookings
    const recentBookings = await db.allAsync(`
      SELECT 
        b.id,
        b.bookingNumber,
        c.name as customerName,
        s.name as serviceName,
        s.type as serviceType,
        b.status,
        b.createdAt as date
      FROM bookings b
      LEFT JOIN customers c ON b.customerId = c.id
      LEFT JOIN services s ON b.serviceId = s.id
      ORDER BY b.createdAt DESC
      LIMIT 5
    `);

    // Get recent messages
    const recentMessages = await db.allAsync(`
      SELECT 
        id,
        name,
        email,
        subject,
        status,
        created_at as date
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Get revenue stats
    const revenueStats = await db.getAsync(`
      SELECT 
        SUM(CASE WHEN status IN ('confirmed', 'completed') AND paymentStatus = 'paid' THEN totalPrice ELSE 0 END) as total,
        SUM(CASE WHEN status = 'pending' THEN totalPrice ELSE 0 END) as pending
      FROM bookings
      WHERE createdAt >= ?
    `, [startDate.toISOString()]);

    // Calculate growth (compare with previous period)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 7);
    
    const previousRevenue = await db.getAsync(`
      SELECT SUM(totalPrice) as total
      FROM bookings
      WHERE createdAt >= ? AND createdAt < ?
        AND status IN ('confirmed', 'completed') 
        AND paymentStatus = 'paid'
    `, [previousStartDate.toISOString(), startDate.toISOString()]);

    const growth = previousRevenue.total 
      ? ((revenueStats.total - previousRevenue.total) / previousRevenue.total) * 100 
      : 0;

    res.json({
      overview: {
        totalBookings: totalBookings.count || 0,
        totalEvents: totalEvents.count || 0,
        totalCars: totalCars.count || 0,
        totalTours: totalTours.count || 0,
        totalPartners: totalPartners.count || 0,
        totalStaff: totalStaff.count || 0,
        unreadMessages: unreadMessages.count || 0
      },
      bookings: {
        pending: bookingStats.pending || 0,
        confirmed: bookingStats.confirmed || 0,
        completed: bookingStats.completed || 0,
        cancelled: bookingStats.cancelled || 0
      },
      recentBookings,
      recentMessages,
      revenue: {
        total: revenueStats.total || 0,
        pending: revenueStats.pending || 0,
        growth: Math.round(growth * 100) / 100
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;