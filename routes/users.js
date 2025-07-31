const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// GET all users
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let filteredUsers = [...users];
    
    // Search functionality
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      users: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalItems: filteredUsers.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role = 'user' } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user
router.put('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, role } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email already exists (excluding current user)
    if (email && users.find(u => u.email === email && u.id !== userId)) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      updatedAt: new Date().toISOString()
    };
    
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router; 