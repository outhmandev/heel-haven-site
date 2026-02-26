const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
require('dotenv').config();

const sendWhatsApp = require('./whatsapp');
const setupWebhook = require('./webhook');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Webhook Routes
setupWebhook(app, pool);

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    const { id, email, password, name } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
            [id, email, password, name, 'user']
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        // Strip password before returning
        delete user.password;

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Order
app.post('/api/orders', async (req, res) => {
    const { id, userId, shippingName, shippingAddress, shippingPhone, total, items, phone, product_name, size, address } = req.body;
    try {
        await pool.query(
            'INSERT INTO orders (id, user_id, phone, product_name, size, address, shipping_name, shipping_address, shipping_phone, total, items, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, userId, phone || null, product_name || null, size || null, address || null, shippingName, shippingAddress, shippingPhone, total, JSON.stringify(items), 'pending']
        );

        // Send WhatsApp confirmation
        sendWhatsApp(shippingPhone, shippingName, shippingAddress, items, id);

        res.status(201).json({ message: 'Order created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get All Orders (for Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        const orders = rows.map(row => ({
            ...row,
            userId: row.user_id,
            phone: row.phone,
            product_name: row.product_name,
            size: row.size,
            address: row.address,
            shippingName: row.shipping_name,
            shippingAddress: row.shipping_address,
            shippingPhone: row.shipping_phone,
            createdAt: row.created_at,
            status: row.status,
            // items is automatically parsed if fetched as JSON type, but need to be safe depending on driver config
        }));
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update Order Status
app.patch('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Order updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route to serve the React app for non-API requests (must be the LAST route!)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
