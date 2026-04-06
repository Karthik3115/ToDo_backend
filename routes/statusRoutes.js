const { Router } = require('express');

const router = Router();

// @GET /api/status
router.get('/', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    status: 'ok',
    database: dbStatus,
    message: dbStatus === 'connected' 
      ? 'Todo App API is running and DB is connected 🚀' 
      : 'API is running but DB is disconnected. Check Atlas IP Whitelist ⚠️',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
