const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        if (category && category !== 'all') {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (search) {
            sql += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }
        sql += ' ORDER BY id DESC';
        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        const [rows] = await db.query(sql, params);
        // Lấy tổng số sản phẩm
        const [countRows] = await db.query('SELECT COUNT(*) as total FROM products');
        res.json({
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(countRows[0].total / limit),
                totalItems: countRows[0].total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', detail: error.message });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST create new product
router.post('/', async (req, res) => {
    try {
        const { name, price, category, image, stock = 0 } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ error: 'Name, price, and category are required' });
        }
        // Chỉ cho phép ảnh JPG, PNG, GIF, WEBP (base64)
        let imageData = null;
        if (image) {
            if (
                image.startsWith('data:image/jpeg') ||
                image.startsWith('data:image/png') ||
                image.startsWith('data:image/gif') ||
                image.startsWith('data:image/webp')
            ) {
                imageData = image;
            } else {
                return res.status(400).json({ error: 'Only JPG, PNG, GIF, WEBP images are allowed. SVG or icon images are not supported.' });
            }
        }
        const [result] = await db.query(
            'INSERT INTO products (name, price, category, image, stock) VALUES (?, ?, ?, ?, ?)',
            [name, price, category, imageData, stock]
        );
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        const { name, price, category, image, stock } = req.body;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        // Chỉ cho phép update ảnh JPG, PNG, GIF, WEBP (base64)
        let imageData = rows[0].image; // Giữ nguyên hình ảnh cũ
        if (image) {
            if (
                image.startsWith('data:image/jpeg') ||
                image.startsWith('data:image/png') ||
                image.startsWith('data:image/gif') ||
                image.startsWith('data:image/webp')
            ) {
                imageData = image;
            } // Nếu không hợp lệ, giữ nguyên ảnh cũ
        }
        await db.query(
            'UPDATE products SET name=?, price=?, category=?, image=?, stock=? WHERE id=?',
            [name || rows[0].name, price || rows[0].price, category || rows[0].category, imageData, stock !== undefined ? stock : rows[0].stock, req.params.id]
        );
        const [updatedRows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(updatedRows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully', product: rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// GET categories
router.get('/categories/list', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT category FROM products');
        const categories = rows.map(row => row.category);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Update stock
router.patch('/:id/stock', async (req, res) => {
    try {
        const { quantity } = req.body;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        const newStock = Math.max(0, rows[0].stock + parseInt(quantity));
        await db.query('UPDATE products SET stock=? WHERE id=?', [newStock, req.params.id]);
        const [updatedRows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(updatedRows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// GET product image by ID
router.get('/:id/image', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = rows[0];
        if (!product.image) {
            return res.status(404).json({ error: 'No image found for this product' });
        }
        
        // Kiểm tra xem image có phải là base64 không
        if (product.image.startsWith('data:image')) {
            // Nếu là base64, trả về trực tiếp
            const base64Data = product.image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const mimeType = product.image.match(/data:([^;]+)/)[1];
            
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 năm
            res.send(buffer);
        } else {
            // Nếu là URL, redirect hoặc trả về URL
            res.json({ imageUrl: product.image });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product image' });
    }
});

module.exports = router; 