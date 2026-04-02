import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'thehurbert.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to thehurbert.db');
    initializeDatabase();
  }
});

async function initializeDatabase() {
  try {
    // Enable foreign keys
    await db.runAsync('PRAGMA foreign_keys = ON');

    // ============================================
    // 1. ADMIN USERS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'admin',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin users table created');

    // ============================================
    // 2. EVENTS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        location TEXT,
        date TEXT,
        description TEXT,
        client TEXT,
        website TEXT,
        attendees TEXT,
        duration TEXT,
        servicesProvided TEXT,
        image TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Events table created');

    // ============================================
    // 3. CARS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        price TEXT,
        features TEXT,
        description TEXT,
        transmission TEXT,
        fuel TEXT,
        mileage TEXT,
        image TEXT,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Cars table created');

    // ============================================
    // 4. TOURISM TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS tourism (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        location TEXT,
        duration TEXT,
        bestTime TEXT,
        bestSeason TEXT,
        description TEXT,
        activities TEXT,
        highlights TEXT,
        image TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tourism table created');

    // ============================================
    // 5. PARTNERS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo TEXT,
        website TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Partners table created');

    // ============================================
    // 6. STAFF TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT,
        email TEXT,
        phone TEXT,
        bio TEXT,
        linkedin TEXT,
        image TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Staff table created');

    // ============================================
    // 7. CUSTOMERS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        country TEXT DEFAULT 'Rwanda',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created');

    // ============================================
    // 8. SERVICES TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('event', 'car', 'tour')),
        price DECIMAL(10,2),
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Services table created');

    // ============================================
    // 9. BOOKINGS TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookingNumber TEXT UNIQUE,
        customerId INTEGER,
        serviceId INTEGER,
        startDate DATE,
        endDate DATE,
        eventDate DATE,
        guests INTEGER DEFAULT 1,
        totalPrice DECIMAL(10,2) DEFAULT 0,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        paymentStatus TEXT DEFAULT 'unpaid' CHECK(paymentStatus IN ('paid', 'unpaid', 'refunded')),
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id),
        FOREIGN KEY (serviceId) REFERENCES services(id)
      )
    `);
    console.log('✅ Bookings table created');

    // ============================================
    // 10. CONTACT MESSAGES TABLE
    // ============================================
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact messages table created');

    // ============================================
    // CREATE DEFAULT ADMIN USER
    // ============================================
    const adminEmail = 'admin@thehurbert.com';
    const existingAdmin = await db.getAsync(
      'SELECT id FROM admin_users WHERE email = ?',
      [adminEmail]
    );

    if (!existingAdmin) {
      const passwordHash = bcrypt.hashSync('Hurb3rt@2026!', 10);
      await db.runAsync(
        `INSERT INTO admin_users (username, email, password_hash, full_name, role)
         VALUES (?, ?, ?, ?, ?)`,
        ['admin', adminEmail, passwordHash, 'Administrator', 'admin']
      );
      console.log('✅ Default admin user created');
    }

    // ============================================
    // INSERT SAMPLE SERVICES
    // ============================================
    const servicesCount = await db.getAsync('SELECT COUNT(*) as count FROM services');
    if (servicesCount.count === 0) {
      const sampleServices = [
        ['Wedding Package', 'event', 5000.00, 'Complete wedding planning'],
        ['Toyota RAV4', 'car', 85.00, 'Luxury SUV'],
        ['Kigali City Tour', 'tour', 65.00, 'Explore the capital']
      ];

      for (const service of sampleServices) {
        await db.runAsync(
          'INSERT INTO services (name, type, price, description) VALUES (?, ?, ?, ?)',
          service
        );
      }
      console.log('✅ Sample services added');
    }

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Promisify database methods
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default db;