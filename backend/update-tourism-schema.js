import db from './db.js';

async function updateTourismSchema() {
  console.log('🚀 Updating tourism table schema for TourDetail compatibility...');

  try {
    // Add new columns to tourism table
    const alterations = [
      'ALTER TABLE tourism ADD COLUMN name TEXT',
      'ALTER TABLE tourism ADD COLUMN price REAL',
      'ALTER TABLE tourism ADD COLUMN longDescription TEXT',
      'ALTER TABLE tourism ADD COLUMN itinerary TEXT', // JSON string
      'ALTER TABLE tourism ADD COLUMN included TEXT', // JSON string
      'ALTER TABLE tourism ADD COLUMN excluded TEXT', // JSON string
      'ALTER TABLE tourism ADD COLUMN importantInfo TEXT', // JSON string
      'ALTER TABLE tourism ADD COLUMN images TEXT', // JSON string
      'ALTER TABLE tourism ADD COLUMN groupSize TEXT'
    ];

    for (const alteration of alterations) {
      try {
        await db.runAsync(alteration);
        console.log(`✅ Added column: ${alteration.split('ADD COLUMN ')[1]}`);
      } catch (error) {
        // Column might already exist, continue
        console.log(`⚠️  Column might already exist: ${alteration.split('ADD COLUMN ')[1]}`);
      }
    }

    console.log('✅ Tourism table schema updated successfully');

  } catch (error) {
    console.error('❌ Error updating tourism schema:', error);
  }
}

updateTourismSchema().then(() => {
  console.log('🎉 Schema update completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Schema update failed:', error);
  process.exit(1);
});