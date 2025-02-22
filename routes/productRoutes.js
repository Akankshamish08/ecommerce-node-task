/*
Author: Akanksha Misha
 */

const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductCategory,
    getFilteredProducts
} = require('../controller/productController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all available products.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       categoryId:
 *                         type: integer
 *                       imageUrl:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', getAllProducts);
router.get('/:id', getProductById);
/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Get filtered products
 *     description: Retrieve products based on search, category, price range, and pagination.
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search products by name
 *         schema:
 *           type: string
 *       - name: minPrice
 *         in: query
 *         description: Minimum price filter
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         description: Maximum price filter
 *         schema:
 *           type: number
 *       - name: categoryId
 *         in: query
 *         description: Category ID filter
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       500:
 *         description: Server error
 */
router.get('/filter', getFilteredProducts);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the inventory.
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
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update product details like name, price, stock, category, etc.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, updateProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deleteProduct);
/**
 * @swagger
 * /api/products/{id}/category:
 *   put:
 *     summary: Update product category
 *     description: Change the category of an existing product.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product category updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id/category', authMiddleware, updateProductCategory);

module.exports = router;
