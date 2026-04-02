import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt for:', email);

    // Check in admin_users table
    const admin = await db.getAsync(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (!admin) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', admin.email);

    // Compare password with password_hash
    const isValid = bcrypt.compareSync(password, admin.password_hash);

    if (!isValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password valid');

    // Update last login
    await db.runAsync(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    res.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET current user
router.get('/me', async (req, res) => {
  try {
    // For simplicity, you can add token auth later
    res.json({ user: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;