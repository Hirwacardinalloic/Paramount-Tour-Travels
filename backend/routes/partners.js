import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all partners
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM partners';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY name ASC';
    const partners = await db.allAsync(sql, params);
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single partner
router.get('/:id', async (req, res) => {
  try {
    const partner = await db.getAsync(
      'SELECT * FROM partners WHERE id = ?',
      [req.params.id]
    );
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create partner
router.post('/', async (req, res) => {
  try {
    const { name, logo, website, status } = req.body;

    const result = await db.runAsync(
      `INSERT INTO partners (name, logo, website, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [name, logo, website, status || 'active']
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Partner added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update partner
router.put('/:id', async (req, res) => {
  try {
    const { name, logo, website, status } = req.body;

    await db.runAsync(
      `UPDATE partners SET
        name = ?, logo = ?, website = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, logo, website, status, req.params.id]
    );

    res.json({ 
      success: true, 
      message: 'Partner updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE partner
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM partners WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET partners stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM partners');
    const active = await db.getAsync("SELECT COUNT(*) as count FROM partners WHERE status = 'active'");
    
    res.json({
      total: total.count,
      active: active.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;