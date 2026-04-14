import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all flights
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM flight_tickets';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    const flights = await db.allAsync(sql, params);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await db.getAsync(
      'SELECT * FROM flight_tickets WHERE id = ?',
      [req.params.id]
    );
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create flight
router.post('/', async (req, res) => {
  try {
    const {
      airline, route, flightClass, price, description, image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO flight_tickets (
        airline, route, flightClass, price, description, image, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        airline, route, flightClass, price, description, image, status || 'active'
      ]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Flight added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update flight
router.put('/:id', async (req, res) => {
  try {
    const {
      airline, route, flightClass, price, description, image, status
    } = req.body;

    await db.runAsync(
      `UPDATE flight_tickets SET
        airline = ?, route = ?, flightClass = ?, price = ?, description = ?, image = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        airline, route, flightClass, price, description, image, status, req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Flight updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE flight
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM flight_tickets WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
