const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
require('dotenv').config();

/**
 * Admin middleware to protect routes
 */
function adminMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Important: use "is_admin" from database field
    if (!decoded.is_admin) return res.status(403).json({ msg: 'Admin access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

/**
 * Get list of all users
 */
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, email, is_admin FROM users`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: err.message });
  }
});

/**
 * Delete (ban) a user by ID
 */
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ msg: err.message });
  }
});

/**
 * Get list of all swaps
 */
router.get('/swaps', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM swaps`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching swaps:', err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
