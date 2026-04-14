import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all accommodations
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    let sql = 'SELECT * FROM accommodations';
    const params = [];

    if (status || type) {
      sql += ' WHERE';
      if (status) {
        sql += ' status = ?';
        params.push(status);
      }
      if (type) {
        if (status) sql += ' AND';
        sql += ' type = ?';
        params.push(type);
      }
    }

    sql += ' ORDER BY created_at DESC';
    const accommodations = await db.allAsync(sql, params);
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single accommodation
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await db.getAsync(
      'SELECT * FROM accommodations WHERE id = ?',
      [req.params.id]
    );
    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create accommodation
router.post('/', async (req, res) => {
  try {
    const {
      name, type, location, pricePerNight, amenities, description, image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO accommodations (
        name, type, location, pricePerNight, amenities, description, image, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        name, type, location, pricePerNight, amenities, description, image, status || 'active'
      ]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Accommodation added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update accommodation
router.put('/:id', async (req, res) => {
  try {
    const {
      name, type, location, pricePerNight, amenities, description, image, status
    } = req.body;

    await db.runAsync(
      `UPDATE accommodations SET
        name = ?, type = ?, location = ?, pricePerNight = ?, amenities = ?, description = ?, image = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name, type, location, pricePerNight, amenities, description, image, status, req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Accommodation updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE accommodation
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM accommodations WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
