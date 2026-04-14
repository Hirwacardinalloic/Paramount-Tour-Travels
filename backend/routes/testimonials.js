import express from 'express';
import db from '../db.js';

const router = express.Router();

// Submit a new testimonial
router.post('/', async (req, res) => {
  try {
    const { name, location, title, review, rating } = req.body;

    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: 'Name and review are required.'
      });
    }

    const sanitizedRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const result = await db.runAsync(
      `INSERT INTO testimonials (name, location, title, review, rating, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, location || '', title || '', review, sanitizedRating, 'approved']
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: {
        id: result.id,
        name,
        location: location || '',
        title: title || '',
        review,
        rating: sanitizedRating,
        status: 'approved'
      }
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting testimonial.'
    });
  }
});

// Get testimonial listings
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const testimonials = await db.allAsync(
      'SELECT id, name, location, title, review, rating, created_at FROM testimonials WHERE status = ? ORDER BY created_at DESC LIMIT ?;', 
      ['approved', limit]
    );

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials.'
    });
  }
});

export default router;
