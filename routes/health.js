const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };
  
  res.status(200).json(healthCheck);
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version
  };
  
  res.status(200).json(detailedHealth);
});

module.exports = router; 