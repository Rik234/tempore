// routes/admin.js — панель администратора
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');

const isAdmin = (req, res, next) => {
  if (req.client.email === 'admin@tempore.ru') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Доступ запрещен' });
  }
};

// 1. СТАТИСТИКА
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [clients] = await db.pool.query('SELECT COUNT(*) as count FROM clients');
    const [couriers] = await db.pool.query('SELECT COUNT(*) as count FROM couriers');
    const [orders] = await db.pool.query('SELECT COUNT(*) as count FROM orders');
    const [revenue] = await db.pool.query("SELECT SUM(delivery_price) as total FROM orders WHERE status = 'доставлен'");
    res.json({ success: true, stats: { clients: clients[0].count, couriers: couriers[0].count, orders: orders[0].count, revenue: revenue[0].total || 0 } });
  } catch (error) { res.status(500).json({ success: false, message: 'Ошибка сервера' }); }
});

// 2. ВСЕ ЗАКАЗЫ
router.get('/orders', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.pool.query(`
      SELECT o.order_id, o.client_id, o.from_address, o.to_address, o.delivery_price, o.status, o.order_date,
             c.full_name AS client_name, cr.full_name AS courier_name
      FROM orders o
      JOIN clients c ON c.client_id = o.client_id
      LEFT JOIN deliveries d ON d.order_id = o.order_id
      LEFT JOIN couriers cr ON cr.courier_id = d.courier_id
      ORDER BY o.order_date DESC
    `);
    res.json({ success: true, orders });
  } catch (error) { res.status(500).json({ success: false, message: 'Ошибка сервера' }); }
});

// 3. ВСЕ КУРЬЕРЫ
router.get('/couriers', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [couriers] = await db.pool.query('SELECT courier_id, full_name, email, phone, transport, work_status FROM couriers ORDER BY courier_id DESC');
    res.json({ success: true, couriers });
  } catch (error) { res.status(500).json({ success: false, message: 'Ошибка сервера' }); }
});

// 4. ИНФО КЛИЕНТА (БЕЗ ПАРОЛЯ)
router.get('/clients/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [client] = await db.pool.query('SELECT client_id, full_name, phone, email, city, address FROM clients WHERE client_id = ?', [req.params.id]);
    if (client.length === 0) return res.status(404).json({ success: false, message: 'Клиент не найден' });
    res.json({ success: true, client: client[0] });
  } catch (error) { res.status(500).json({ success: false, message: 'Ошибка сервера' }); }
});

// 5. ИСТОРИЯ ЧАТА ЗАКАЗА
router.get('/chat/:orderId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [messages] = await db.pool.query('SELECT sender_role, text, created_at FROM messages WHERE order_id = ? ORDER BY created_at ASC', [req.params.orderId]);
    res.json({ success: true, messages });
  } catch (error) { res.status(500).json({ success: false, message: 'Ошибка сервера' }); }
});

module.exports = router;