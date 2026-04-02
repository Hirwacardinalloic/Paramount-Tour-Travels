import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM events';
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
    const events = await db.allAsync(sql, params);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await db.getAsync(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const {
      title, category, location, date, description,
      client, website, attendees, duration, servicesProvided,
      image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO events (
        title, category, location, date, description,
        client, website, attendees, duration, servicesProvided,
        image, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        title, category, location, date, description,
        client, website, attendees, duration, JSON.stringify(servicesProvided || []),
        image, status || 'active'
      ]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const {
      title, category, location, date, description,
      client, website, attendees, duration, servicesProvided,
      image, status
    } = req.body;

    await db.runAsync(
      `UPDATE events SET
        title = ?, category = ?, location = ?, date = ?, description = ?,
        client = ?, website = ?, attendees = ?, duration = ?, servicesProvided = ?,
        image = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title, category, location, date, description,
        client, website, attendees, duration, JSON.stringify(servicesProvided || []),
        image, status, req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET events stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM events');
    const active = await db.getAsync("SELECT COUNT(*) as count FROM events WHERE status = 'active'");
    const upcoming = await db.getAsync(`
      SELECT COUNT(*) as count FROM events 
      WHERE date >= date('now') AND status = 'active'
    `);
    
    res.json({
      total: total.count,
      active: active.count,
      upcoming: upcoming.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;