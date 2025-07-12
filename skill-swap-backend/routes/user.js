const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

/**
 * Middleware: Auth
 */
function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

/**
 * Middleware: Admin
 */
function adminMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.is_admin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

/**
 * Get user profile by ID (protected)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!userId) return res.status(400).json({ msg: 'Invalid user ID' });

    const result = await pool.query(
      `SELECT id, name, location, email, skills_offered, skills_wanted, availability, profile_photo, profile_visibility FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ msg: err.message });
  }
});

/**
 * Update user profile (protected)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, location, skillsOffered, skillsWanted, availability, profileVisibility } = req.body;

  try {
    await pool.query(
      `UPDATE users SET name = $1, location = $2, skills_offered = $3, skills_wanted = $4, availability = $5, profile_visibility = $6 WHERE id = $7`,
      [
        name,
        location,
        skillsOffered ? skillsOffered.split(',') : [],
        skillsWanted ? skillsWanted.split(',') : [],
        availability,
        profileVisibility,
        req.params.id
      ]
    );
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * List all public users
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, skills_offered, skills_wanted, availability, profile_photo, location FROM users WHERE profile_visibility = 'Public'`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

