import db from './db.js';

async function checkTourismImages() {
  try {
    const rows = await db.allAsync('SELECT id, name, image, images FROM tourism WHERE image IS NOT NULL OR images IS NOT NULL LIMIT 5');
    console.log('Tourism with images:', JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkTourismImages();