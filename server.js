require('dotenv').config();
const express = require('express');
const cors = require('cors');
const User = require('./models/user');

// Test database connection on startup
const db = require('./db_sqlite');
db.get('SELECT 1', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Successfully connected to SQLite database');
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, firstName, lastName, role } = req.body;
    
    if (!email || !password || !firstName || !lastName || !role) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Attempting to create user in database...');
    const userId = await User.create({
      email,
      password,
      firstName,
      lastName,
      role
    });
    console.log('User created with ID:', userId);

    // Verify the user was actually created
    const createdUser = await User.findByEmail(email);
    if (!createdUser) {
      console.error('User creation verification failed - no user found');
      return res.status(500).json({ error: 'User creation failed' });
    }
    console.log('User verification successful:', createdUser);

    res.status(201).json({ 
      message: 'User created successfully',
      userId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    console.log('User found:', user);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await User.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});