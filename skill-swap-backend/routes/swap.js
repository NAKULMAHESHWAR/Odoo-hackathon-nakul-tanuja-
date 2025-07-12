const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

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

// Create new swap request
router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, offeredSkill, wantedSkill, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO swaps (requester_id, receiver_id, offered_skill, wanted_skill, message) VALUES ($1, $2, $3, $4, $5)`,
      [req.user.userId, receiverId, offeredSkill, wantedSkill, message]
    );
    res.json({ msg: 'Swap request sent' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all swaps for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM swaps WHERE requester_id = $1 OR receiver_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update swap status
router.put('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query(
      `UPDATE swaps SET status = $1 WHERE id = $2 AND receiver_id = $3`,
      [status, req.params.id, req.user.userId]
    );
    res.json({ msg: `Swap request ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete swap request
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM swaps WHERE id = $1 AND requester_id = $2 AND status = 'Pending'`,
      [req.params.id, req.user.userId]
    );
    res.json({ msg: 'Swap request deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
