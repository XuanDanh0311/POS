const express = require('express');
const router = express.Router();
const db = require('../db');

// GET sales analytics by time period
router.get('/sales', async (req, res) => {
    try {
        const { period = 'day', start_date, end_date } = req.query;
        
        let dateFormat, groupBy;
        switch (period) {
            case 'day':
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(created_at)';
                break;
            case 'week':
                dateFormat = '%Y-%u';
                groupBy = 'YEARWEEK(created_at)';
                break;
            case 'month':
                dateFormat = '%Y-%m';
                groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
                break;
            default:
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(created_at)';
        }

        let whereClause = 'WHERE status = "completed"';
        const params = [];

        if (start_date && end_date) {
            whereClause += ' AND DATE(created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const sql = `
            SELECT 
                DATE_FORMAT(created_at, ?) as period,
                COUNT(*) as order_count,
                SUM(total) as total_revenue,
                AVG(total) as average_order_value,
                COUNT(DISTINCT customer_name) as unique_customers
            FROM orders 
            ${whereClause}
            GROUP BY ${groupBy}
            ORDER BY period DESC
            LIMIT 30
        `;

        params.unshift(dateFormat);
        const [rows] = await db.query(sql, params);

        res.json({
            period: period,
            data: rows
        });

    } catch (error) {
        console.error('Error fetching sales analytics:', error);
        res.status(500).json({ error: 'Failed to fetch sales analytics' });
    }
});

// GET top selling products
router.get('/top-products', async (req, res) => {
    try {
        const { limit = 10, start_date, end_date } = req.query;
        
        let whereClause = 'WHERE o.status = "completed"';
        const params = [];

        if (start_date && end_date) {
            whereClause += ' AND DATE(o.created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const sql = `
            SELECT 
                oi.product_name,
                oi.product_id,
                SUM(oi.quantity) as total_quantity,
                SUM(oi.total_price) as total_revenue,
                COUNT(DISTINCT o.id) as order_count
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            ${whereClause}
            GROUP BY oi.product_id, oi.product_name
            ORDER BY total_quantity DESC
            LIMIT ?
        `;

        params.push(parseInt(limit));
        const [rows] = await db.query(sql, params);

        res.json({
            products: rows
        });

    } catch (error) {
        console.error('Error fetching top products:', error);
        res.status(500).json({ error: 'Failed to fetch top products' });
    }
});

// GET customer analytics
router.get('/customers', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        let whereClause = 'WHERE status = "completed"';
        const params = [];

        if (start_date && end_date) {
            whereClause += ' AND DATE(created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const sql = `
            SELECT 
                customer_name,
                customer_phone,
                COUNT(*) as order_count,
                SUM(total) as total_spent,
                AVG(total) as average_order_value,
                MIN(created_at) as first_order,
                MAX(created_at) as last_order
            FROM orders 
            ${whereClause}
            AND customer_name IS NOT NULL
            AND customer_name != ''
            GROUP BY customer_name, customer_phone
            ORDER BY total_spent DESC
        `;

        const [rows] = await db.query(sql, params);

        res.json({
            customers: rows
        });

    } catch (error) {
        console.error('Error fetching customer analytics:', error);
        res.status(500).json({ error: 'Failed to fetch customer analytics' });
    }
});

// GET category analytics
router.get('/categories', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        let whereClause = 'WHERE o.status = "completed"';
        const params = [];

        if (start_date && end_date) {
            whereClause += ' AND DATE(o.created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const sql = `
            SELECT 
                p.category,
                SUM(oi.quantity) as total_quantity,
                SUM(oi.total_price) as total_revenue,
                COUNT(DISTINCT o.id) as order_count,
                AVG(oi.unit_price) as average_price
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            LEFT JOIN products p ON oi.product_id = p.id
            ${whereClause}
            GROUP BY p.category
            ORDER BY total_revenue DESC
        `;

        const [rows] = await db.query(sql, params);

        res.json({
            categories: rows
        });

    } catch (error) {
        console.error('Error fetching category analytics:', error);
        res.status(500).json({ error: 'Failed to fetch category analytics' });
    }
});

// GET dashboard summary
router.get('/dashboard', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        let whereClause = '';
        const params = [];

        if (start_date && end_date) {
            whereClause = 'WHERE DATE(created_at) BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        // Get basic stats
        const statsSql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(CASE WHEN status = 'held' THEN 1 ELSE 0 END) as held_orders,
                SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as total_revenue,
                AVG(CASE WHEN status = 'completed' THEN total ELSE NULL END) as average_order_value,
                COUNT(DISTINCT customer_name) as unique_customers
            FROM orders 
            ${whereClause}
        `;

        const [statsRows] = await db.query(statsSql, params);

        // Get today's stats
        const todaySql = `
            SELECT 
                COUNT(*) as today_orders,
                SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as today_revenue
            FROM orders 
            WHERE DATE(created_at) = CURDATE()
        `;

        const [todayRows] = await db.query(todaySql);

        // Get this week's stats
        const weekSql = `
            SELECT 
                COUNT(*) as week_orders,
                SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as week_revenue
            FROM orders 
            WHERE YEARWEEK(created_at) = YEARWEEK(NOW())
        `;

        const [weekRows] = await db.query(weekSql);

        // Get this month's stats
        const monthSql = `
            SELECT 
                COUNT(*) as month_orders,
                SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as month_revenue
            FROM orders 
            WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
        `;

        const [monthRows] = await db.query(monthSql);

        res.json({
            overall: statsRows[0],
            today: todayRows[0],
            week: weekRows[0],
            month: monthRows[0]
        });

    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
    }
});

// GET revenue trends
router.get('/revenue-trends', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        const sql = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as order_count,
                SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as revenue,
                AVG(CASE WHEN status = 'completed' THEN total ELSE NULL END) as average_order
            FROM orders 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;

        const [rows] = await db.query(sql, [parseInt(days)]);

        res.json({
            trends: rows
        });

    } catch (error) {
        console.error('Error fetching revenue trends:', error);
        res.status(500).json({ error: 'Failed to fetch revenue trends' });
    }
});

module.exports = router; 