import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all tourism destinations
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM tourism';
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
      'SELECT * FROM tourism WHERE id = ?',
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
      title, category, location, duration, bestTime,
      bestSeason, description, activities, highlights,
      image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO tourism (
        title, category, location, duration, bestTime,
        bestSeason, description, activities, highlights,
        image, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        title, category, location, duration, bestTime,
        bestSeason, description, JSON.stringify(activities || []),
        JSON.stringify(highlights || []), image, status || 'active'
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
      title, category, location, duration, bestTime,
      bestSeason, description, activities, highlights,
      image, status
    } = req.body;

    await db.runAsync(
      `UPDATE tourism SET
        title = ?, category = ?, location = ?, duration = ?, bestTime = ?,
        bestSeason = ?, description = ?, activities = ?, highlights = ?,
        image = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title, category, location, duration, bestTime,
        bestSeason, description, JSON.stringify(activities || []),
        JSON.stringify(highlights || []), image, status, req.params.id
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
    await db.runAsync('DELETE FROM tourism WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET tourism stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM tourism');
    const nationalParks = await db.getAsync("SELECT COUNT(*) as count FROM tourism WHERE category = 'National Park'");
    const lakes = await db.getAsync("SELECT COUNT(*) as count FROM tourism WHERE category = 'Lake'");
    const museums = await db.getAsync("SELECT COUNT(*) as count FROM tourism WHERE category = 'Museum'");
    
    res.json({
      total: total.count,
      nationalParks: nationalParks.count,
      lakes: lakes.count,
      museums: museums.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;