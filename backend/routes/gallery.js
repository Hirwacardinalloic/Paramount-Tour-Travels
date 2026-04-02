import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all gallery images for an item
router.get('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    const images = await db.allAsync(
      `SELECT * FROM portfolio_gallery 
       WHERE item_type = ? AND item_id = ? 
       ORDER BY sort_order ASC, created_at ASC`,
      [type, itemId]
    );
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add image to gallery
router.post('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const { image_url } = req.body;

    // Get current max sort order
    const maxOrder = await db.getAsync(
      `SELECT MAX(sort_order) as maxOrder 
       FROM portfolio_gallery 
       WHERE item_type = ? AND item_id = ?`,
      [type, itemId]
    );

    const nextOrder = (maxOrder?.maxOrder || 0) + 1;

    const result = await db.runAsync(
      `INSERT INTO portfolio_gallery (item_type, item_id, image_url, sort_order)
       VALUES (?, ?, ?, ?)`,
      [type, itemId, image_url, nextOrder]
    );

    res.status(201).json({ 
      id: result.lastID, 
      message: 'Image added to gallery successfully' 
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.runAsync('DELETE FROM portfolio_gallery WHERE id = ?', [id]);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reorder gallery images
router.put('/reorder', async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, sort_order }

    for (const update of updates) {
      await db.runAsync(
        'UPDATE portfolio_gallery SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [update.sort_order, update.id]
      );
    }

    res.json({ message: 'Gallery reordered successfully' });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;