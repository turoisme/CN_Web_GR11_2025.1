require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const admins = [
      {
        username: 'admin1',
        email: 'admin1@filmrate.com',
        password: 'Admin123@',
        role: 'admin'
      },
      {
        username: 'admin2',
        email: 'admin2@filmrate.com',
        password: 'Admin123@',
        role: 'admin'
      }
    ];

    for (const adminData of admins) {
      // Check if admin already exists
      const existingUser = await User.findOne({ 
        $or: [{ email: adminData.email }, { username: adminData.username }] 
      });

      if (existingUser) {
        console.log(`⚠️  User ${adminData.username} already exists, skipping...`);
        continue;
      }

      // Create admin
      const admin = await User.create(adminData);
      console.log(`✅ Created admin: ${admin.username} (${admin.email})`);
      console.log(`   ID: ${admin._id}`);
      console.log(`   Role: ${admin.role}\n`);
    }

    console.log('✅ Admin accounts creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmins();
