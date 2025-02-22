const express = require('express');
const { createCategory, getAllCategories } = require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all product categories.
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *       500:
 *         description: Server error
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new product category (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                  type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createCategory);

module.exports = router;
