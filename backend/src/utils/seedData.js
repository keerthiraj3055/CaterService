const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@foodserve.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@foodserve.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890',
      });
      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Note: 
    // - Employee and Corporate accounts must be created by Admin through the dashboard
    // - Regular Users can register themselves through /register endpoint
    // - Only Admin account is seeded as it's required for system management

    console.log('✨ Database seeding completed!');
    console.log('\n📋 Default Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@foodserve.com');
    console.log('   Password: admin123');
    console.log('\n📝 Notes:');
    console.log('   • Regular Users can register themselves at /register');
    console.log('   • Employee accounts must be created by Admin');
    console.log('   • Corporate accounts must be created by Admin');
    console.log('   • Admin Dashboard → Accounts section to create accounts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
