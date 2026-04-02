import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all staff
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM staff';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY name ASC';
    const staff = await db.allAsync(sql, params);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single staff member
router.get('/:id', async (req, res) => {
  try {
    const member = await db.getAsync(
      'SELECT * FROM staff WHERE id = ?',
      [req.params.id]
    );
    if (!member) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create staff member
router.post('/', async (req, res) => {
  try {
    const {
      name, role, email, phone, bio,
      linkedin, image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO staff (
        name, role, email, phone, bio,
        linkedin, image, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [name, role, email, phone, bio, linkedin, image, status || 'active']
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Staff member added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update staff member
router.put('/:id', async (req, res) => {
  try {
    const {
      name, role, email, phone, bio,
      linkedin, image, status
    } = req.body;

    await db.runAsync(
      `UPDATE staff SET
        name = ?, role = ?, email = ?, phone = ?, bio = ?,
        linkedin = ?, image = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, role, email, phone, bio, linkedin, image, status, req.params.id]
    );

    res.json({ 
      success: true, 
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE staff member
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM staff WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET staff stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM staff');
    const active = await db.getAsync("SELECT COUNT(*) as count FROM staff WHERE status = 'active'");
    
    res.json({
      total: total.count,
      active: active.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;