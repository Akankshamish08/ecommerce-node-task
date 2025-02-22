/*
Author: Akanksha Misha
 */

const Category = require('../models/categoryModel');

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = await Category.create({ name, description });

        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCategory, getAllCategories };
