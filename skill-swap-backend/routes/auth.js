const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const pool = require('../db');
dotenv.config();

const router = express.Router();

// Multer setup for profile photos
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/**
 * Register
 */
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  const { name, email, password, location, skillsOffered, skillsWanted, availability, profileVisibility } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, location, skills_offered, skills_wanted, availability, profile_visibility, profile_photo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, is_admin`,
      [
        name,
        email,
        hashedPassword,
        location,
        skillsOffered ? skillsOffered.split(',') : [],
        skillsWanted ? skillsWanted.split(',') : [],
        availability,
        profileVisibility || 'Public',
        req.file ? req.file.filename : null
      ]
    );

    res.status(201).json({ msg: "User registered successfully", userId: result.rows[0].id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: err.message });
  }
});

/**
 * Login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return res.status(400).json({ msg: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // ✅ Use field name matching DB and adminMiddleware
    const payload = {
      id: user.id,
      is_admin: user.is_admin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, userId: user.id, is_admin: user.is_admin });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
