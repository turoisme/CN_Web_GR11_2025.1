const axios = require('axios');

const testRegister = async () => {
  try {
    console.log('Testing user registration...\n');
    
    const newUser = {
      username: 'testuser' + Date.now(),
      email: `testuser${Date.now()}@test.com`,
      password: 'test123456'
    };
    
    console.log('Registering user:');
    console.log(`Username: ${newUser.username}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Password: ${newUser.password}\n`);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', newUser);
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return newUser;
  } catch (error) {
    console.error('❌ Registration failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

testRegister();
