// routes/chat.js — чат между клиентом и курьером
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');

// ОТПРАВИТЬ СООБЩЕНИЕ: POST /api/chat/:orderId
router.post('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order_id = req.params.orderId;
    const { text } = req.body;
    const role = req.client.role; // 'client' или 'courier'
    
    // Определяем ID отправителя в зависимости от роли
    const sender_id = role === 'client' ? req.client.client_id : req.client.courier_id;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Сообщение не может быть пустым' });
    }

    // Проверка: имеет ли этот пользователь отношение к заказу
    let checkQuery = '';
    let checkParams = [];
    
    if (role === 'client') {
      checkQuery = 'SELECT order_id FROM orders WHERE order_id = ? AND client_id = ?';
      checkParams = [order_id, sender_id];
    } else {
      checkQuery = 'SELECT order_id FROM deliveries WHERE order_id = ? AND courier_id = ?';
      checkParams = [order_id, sender_id];
    }

    const [check] = await db.pool.query(checkQuery, checkParams);
    if (check.length === 0) {
      return res.status(403).json({ success: false, message: 'У вас нет доступа к этому чату' });
    }

    // Сохраняем сообщение
    await db.pool.query(
      'INSERT INTO messages (order_id, sender_role, sender_id, text) VALUES (?, ?, ?, ?)',
      [order_id, role, sender_id, text.trim()]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ПОЛУЧИТЬ СООБЩЕНИЯ: GET /api/chat/:orderId
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order_id = req.params.orderId;
    const role = req.client.role;
    const sender_id = role === 'client' ? req.client.client_id : req.client.courier_id;

    // Проверка доступа (такая же, как выше)
    let checkQuery = role === 'client' 
      ? 'SELECT order_id FROM orders WHERE order_id = ? AND client_id = ?'
      : 'SELECT order_id FROM deliveries WHERE order_id = ? AND courier_id = ?';
    
    const [check] = await db.pool.query(checkQuery, [order_id, sender_id]);
    if (check.length === 0) {
      return res.status(403).json({ success: false, message: 'Нет доступа' });
    }

    const [messages] = await db.pool.query(
      'SELECT * FROM messages WHERE order_id = ? ORDER BY created_at ASC',
      [order_id]
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Ошибка при получении сообщений:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

module.exports = router;