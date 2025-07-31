const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { 
            status, 
            search, 
            page = 1, 
            limit = 20,
            start_date,
            end_date 
        } = req.query;

        let sql = `
            SELECT o.*, 
                   COUNT(oi.id) as item_count,
                   GROUP_CONCAT(oi.product_name SEPARATOR ', ') as items_summary
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE 1=1
        `;
        const params = [];

        // Filter by status
        if (status && status !== 'all') {
            sql += ' AND o.status = ?';
            params.push(status);
        }

        // Search by order number, customer name, or phone
        if (search) {
            sql += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Filter by date range
        if (start_date) {
            sql += ' AND DATE(o.created_at) >= ?';
            params.push(start_date);
        }
        if (end_date) {
            sql += ' AND DATE(o.created_at) <= ?';
            params.push(end_date);
        }

        sql += ' GROUP BY o.id ORDER BY o.created_at DESC';

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(sql, params);

        // Get total count for pagination
        let countSql = 'SELECT COUNT(DISTINCT o.id) as total FROM orders o WHERE 1=1';
        const countParams = [];

        if (status && status !== 'all') {
            countSql += ' AND o.status = ?';
            countParams.push(status);
        }
        if (search) {
            countSql += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)';
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        if (start_date) {
            countSql += ' AND DATE(o.created_at) >= ?';
            countParams.push(start_date);
        }
        if (end_date) {
            countSql += ' AND DATE(o.created_at) <= ?';
            countParams.push(end_date);
        }

        const [countRows] = await db.query(countSql, countParams);

        res.json({
            orders: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(countRows[0].total / limit),
                totalItems: countRows[0].total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders', detail: error.message });
    }
});

// GET order by ID with items
router.get('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;

        // Get order details
        const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orderRows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get order items
        const [itemRows] = await db.query(`
            SELECT oi.*, p.image 
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `, [orderId]);

        const order = orderRows[0];
        order.items = itemRows;

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// POST create new order
router.post('/', async (req, res) => {
    try {
        const {
            customer_name = '',
            customer_phone = '',
            table_number,
            items,
            payment_method = 'cash',
            notes = ''
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        // Generate order number
        const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insert order
            const [orderResult] = await connection.query(`
                INSERT INTO orders (order_number, customer_name, customer_phone, table_number, 
                                  subtotal, tax, total, payment_method, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [orderNumber, customer_name, customer_phone, table_number, 
                subtotal, tax, total, payment_method, notes]);

            const orderId = orderResult.insertId;

            // Insert order items
            for (const item of items) {
                await connection.query(`
                    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]);
            }

            await connection.commit();
            connection.release();

            // Get the created order
            const [newOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            res.status(201).json(newOrder[0]);

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order', detail: error.message });
    }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const validStatuses = ['pending', 'completed', 'cancelled', 'held'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [result] = await db.query(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const [updatedOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        res.json(updatedOrder[0]);

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// DELETE order (soft delete by setting status to cancelled)
router.delete('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;

        const [result] = await db.query(
            'UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

// GET order statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE DATE(created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(CASE WHEN status = 'held' THEN 1 ELSE 0 END) as held_orders,
                SUM(total) as total_revenue,
                AVG(total) as average_order_value
            FROM orders 
            ${dateFilter}
        `, params);

        res.json(stats[0]);

    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ error: 'Failed to fetch order statistics' });
    }
});

module.exports = router; 