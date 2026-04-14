import db from './db.js';

async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  
  try {
    await db.runAsync('DELETE FROM events');
    await db.runAsync('DELETE FROM cars');
    await db.runAsync('DELETE FROM tourism');
    await db.runAsync('DELETE FROM partners');
    await db.runAsync('DELETE FROM staff');
    await db.runAsync('DELETE FROM admin_users');
    await db.runAsync('DELETE FROM customers');
    await db.runAsync('DELETE FROM services');
    await db.runAsync('DELETE FROM bookings');
    await db.runAsync('DELETE FROM contact_messages');
    
    // Reset auto-increment counters
    await db.runAsync('DELETE FROM sqlite_sequence WHERE name IN ("events", "cars", "tourism", "partners", "staff", "admin_users", "customers", "services", "bookings", "contact_messages")');
    
    console.log('✅ Database cleared successfully!');
    console.log('Now run migrate-hardcoded.js again to add fresh data.');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    process.exit();
  }
}

clearDatabase();