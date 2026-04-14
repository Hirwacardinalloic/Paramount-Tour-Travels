import db from './db.js';

async function checkGallery() {
  try {
    const rows = await db.allAsync('SELECT * FROM portfolio_gallery WHERE item_type = "tourism" LIMIT 5');
    console.log('Gallery images for tourism:', JSON.stringify(rows, null, 2));
    
    const count = await db.getAsync('SELECT COUNT(*) as count FROM portfolio_gallery WHERE item_type = "tourism"');
    console.log('Total tourism gallery images:', count.count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkGallery();