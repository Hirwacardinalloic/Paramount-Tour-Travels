import express from 'express';
import db from '../db.js';

const router = express.Router();

const stringifyJsonField = (field) => {
  if (field === undefined || field === null) return null;
  if (Array.isArray(field)) return JSON.stringify(field);
  if (typeof field === 'string') {
    const trimmed = field.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) return field;
    return JSON.stringify(trimmed.split(',').map((value) => value.trim()).filter(Boolean));
  }
  return JSON.stringify(field);
};

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM destinations';
    const params = [];

    if (status || category) {
      sql += ' WHERE';
      if (status) {
        sql += ' status = ?';
        params.push(status);
      }
      if (category) {
        if (status) sql += ' AND';
        sql += ' category = ?';
        params.push(category);
      }
    }

    sql += ' ORDER BY created_at DESC';
    const destinations = await db.allAsync(sql, params);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await db.getAsync(
      'SELECT * FROM destinations WHERE id = ?',
      [req.params.id]
    );
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create destination
router.post('/', async (req, res) => {
  try {
    const {
      name, category, location, duration, bestTime, bestSeason, description,
      activities, itinerary, included, excluded, price, images, image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO destinations (
        name, category, location, duration, bestTime, bestSeason, description,
        activities, itinerary, included, excluded, price, images, image, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        name, category, location, duration, bestTime, bestSeason, description,
        stringifyJsonField(activities),
        stringifyJsonField(itinerary),
        stringifyJsonField(included),
        stringifyJsonField(excluded),
        price,
        stringifyJsonField(images),
        image,
        status || 'active'
      ]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Destination added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update destination
router.put('/:id', async (req, res) => {
  try {
    const {
      name, category, location, duration, bestTime, bestSeason, description,
      activities, itinerary, included, excluded, price, images, image, status
    } = req.body;

    await db.runAsync(
      `UPDATE destinations SET
        name = ?, category = ?, location = ?, duration = ?, bestTime = ?, bestSeason = ?, description = ?,
        activities = ?, itinerary = ?, included = ?, excluded = ?, price = ?, images = ?, image = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name, category, location, duration, bestTime, bestSeason, description,
        stringifyJsonField(activities),
        stringifyJsonField(itinerary),
        stringifyJsonField(included),
        stringifyJsonField(excluded),
        price,
        stringifyJsonField(images),
        image,
        status,
        req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Destination updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE destination
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM destinations WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
