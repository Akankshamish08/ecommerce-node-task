/*
Author: Akanksha Misha
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

// User Signup
const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, userType } = req.body;

        // Ensure email and password are strings
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid input types' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password (ensure password is a string)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            userType : userType
        });

        // Generate JWT
        const token = jwt.sign({ userId: user.id ,userType : user.userType}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            token,
            userId: user.id,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Ensure email and password are strings
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid input types' });
        }

        // Check if user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords (ensure password is a string)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id, userType : user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            userId: user.id,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login };
