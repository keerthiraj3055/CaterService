const path = require('path');
const dotenv = require('dotenv');
// Load env from backend/.env if present
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`User with email ${email} not found`);
    process.exit(2);
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  console.log(`Password for ${email} updated successfully.`);
  process.exit(0);
}

if (require.main === module) {
  const [, , email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error('Usage: node resetAdminPassword.js <email> <newPassword>');
    process.exit(1);
  }
  resetPassword(email, newPassword).catch((err) => {
    console.error('Error resetting password:', err);
    process.exit(1);
  });
}

module.exports = resetPassword;
