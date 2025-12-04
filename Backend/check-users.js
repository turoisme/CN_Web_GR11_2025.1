require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log('\n=== All Users in Database ===');
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Active: ${user.isActive}\n`);
    });
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
