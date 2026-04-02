import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all cars
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM cars';
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
    const cars = await db.allAsync(sql, params);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const car = await db.getAsync(
      'SELECT * FROM cars WHERE id = ?',
      [req.params.id]
    );
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create car
router.post('/', async (req, res) => {
  try {
    const {
      title, category, price, features, description,
      transmission, fuel, mileage, image, status
    } = req.body;

    const result = await db.runAsync(
      `INSERT INTO cars (
        title, category, price, features, description,
        transmission, fuel, mileage, image, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        title, category, price, features, description,
        transmission, fuel, mileage, image, status || 'available'
      ]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Car added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update car
router.put('/:id', async (req, res) => {
  try {
    const {
      title, category, price, features, description,
      transmission, fuel, mileage, image, status
    } = req.body;

    await db.runAsync(
      `UPDATE cars SET
        title = ?, category = ?, price = ?, features = ?, description = ?,
        transmission = ?, fuel = ?, mileage = ?, image = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title, category, price, features, description,
        transmission, fuel, mileage, image, status, req.params.id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Car updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE car
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM cars WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET cars stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await db.getAsync('SELECT COUNT(*) as count FROM cars');
    const available = await db.getAsync("SELECT COUNT(*) as count FROM cars WHERE status = 'available'");
    const booked = await db.getAsync("SELECT COUNT(*) as count FROM cars WHERE status = 'booked'");
    
    res.json({
      total: total.count,
      available: available.count,
      booked: booked.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;