import db from './db.js';

async function addGalleryTable() {
  console.log('📸 Creating portfolio gallery table...');

  try {
    // Create gallery table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS portfolio_gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_type TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Portfolio gallery table created successfully!');

    // Add indexes for faster queries
    await db.runAsync(`
      CREATE INDEX IF NOT EXISTS idx_gallery_lookup 
      ON portfolio_gallery (item_type, item_id, sort_order)
    `);

    console.log('✅ Indexes created successfully!');
    console.log('\n📊 Next steps:');
    console.log('   1. Update your admin forms to include gallery image upload');
    console.log('   2. Add gallery display to portfolio modals');
    console.log('   3. Create API endpoints for gallery management');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit();
  }
}

addGalleryTable();