/*
Author: Akanksha Misha
 */

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { Op } = require('sequelize');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, imageUrl } = req.body;

        if (!name || !price || !stock || !categoryId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const product = await Product.create({ name, description, price, stock, categoryId, imageUrl });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, categoryId, imageUrl } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({ name, description, price, stock, categoryId, imageUrl });

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        await product.update({ categoryId });

        res.json({ message: 'Product category updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getFilteredProducts = async (req, res) => {
    try {
        const { minPrice, maxPrice, categoryId, search, page, limit } = req.query;

        // Pagination defaults
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * pageSize;

        // Build filtering conditions
        let filterConditions = {};

        // Price Range Filter
        if (minPrice || maxPrice) {
            filterConditions.price = {};
            if (minPrice) filterConditions.price[Op.gte] = parseFloat(minPrice); // Greater than or equal
            if (maxPrice) filterConditions.price[Op.lte] = parseFloat(maxPrice); // Less than or equal
        }

        // Category Filter
        if (categoryId) {
            filterConditions.categoryId = categoryId;
        }

        // Search by Name (Partial Match)
        if (search) {
            filterConditions.name = { [Op.like]: `%${search}%` }; // Case-insensitive search
        }

        // Fetch products with filters and pagination
        const { count, rows: products } = await Product.findAndCountAll({
            where: filterConditions,
            include: [{ model: Category, attributes: ['name'] }], // Include category name
            limit: pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']], // Sort by latest created product
        });

        res.json({
            totalProducts: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: pageNumber,
            products,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductCategory, getFilteredProducts };
