import db from './db.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  try {
    const newPassword = 'Hurb3rt@2026!'; // Change this to your desired password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    const result = await db.runAsync(
      `UPDATE admin_users SET password_hash = ? WHERE email = ?`,
      [hashedPassword, 'admin@thehurbert.com']
    );
    
    if (result.changes > 0) {
      console.log('✅ Password reset successfully!');
      console.log('📧 Email: admin@thehurbert.com');
      console.log(`🔑 New password: ${newPassword}`);
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit();
}

resetPassword();