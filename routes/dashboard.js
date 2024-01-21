
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport-config');

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Dashboard');
});

module.exports = router;
