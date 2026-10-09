// ============================================
// routes/reviews.js — отзывы и оценки курьеров
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');

// ============================================
// ОСТАВИТЬ ОТЗЫВ: POST /api/reviews/order/:orderId
// ============================================
router.post('/order/:orderId', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'client') {
      return res.status(403).json({ success: false, message: 'Только клиенты могут оставлять отзывы' });
    }

    const client_id = req.client.client_id;
    const order_id = req.params.orderId;
    const { rating, comment } = req.body;

    const ratingNum = parseInt(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Оценка должна быть от 1 до 5' });
    }

    const [orders] = await db.pool.query(
      `SELECT o.order_id, o.status, d.courier_id 
       FROM orders o
       LEFT JOIN deliveries d ON d.order_id = o.order_id
       WHERE o.order_id = ? AND o.client_id = ?`,
      [order_id, client_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Заказ не найден' });
    }

    const order = orders[0];

    if (order.status !== 'доставлен') {
      return res.status(400).json({ success: false, message: 'Отзыв можно оставить только после доставки' });
    }

    if (!order.courier_id) {
      return res.status(400).json({ success: false, message: 'У заказа нет курьера' });
    }

    const [existing] = await db.pool.query(
      'SELECT review_id FROM reviews WHERE order_id = ?',
      [order_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Отзыв по этому заказу уже оставлен' });
    }

    const [result] = await db.pool.query(
      `INSERT INTO reviews (order_id, client_id, courier_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [order_id, client_id, order.courier_id, ratingNum, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Спасибо за отзыв!',
      review_id: result.insertId
    });

  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ОТЗЫВЫ КУРЬЕРА: GET /api/reviews/courier/:courierId
// ============================================
router.get('/courier/:courierId', async (req, res) => {
  try {
    const courier_id = req.params.courierId;

    const [ratingInfo] = await db.pool.query(
      `SELECT 
        COUNT(*) AS total_reviews,
        COALESCE(AVG(rating), 0) AS avg_rating
       FROM reviews WHERE courier_id = ?`,
      [courier_id]
    );

    const [reviews] = await db.pool.query(
      `SELECT 
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        c.full_name AS client_name,
        o.from_address,
        o.to_address
       FROM reviews r
       JOIN clients c ON c.client_id = r.client_id
       JOIN orders o ON o.order_id = r.order_id
       WHERE r.courier_id = ?
       ORDER BY r.created_at DESC`,
      [courier_id]
    );

    res.json({
      success: true,
      avg_rating: parseFloat(ratingInfo[0].avg_rating).toFixed(1),
      total_reviews: ratingInfo[0].total_reviews,
      reviews: reviews
    });

  } catch (error) {
    console.error('Ошибка при получении отзывов курьера:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ТЕСТ
// ============================================
router.get('/test', (req, res) => {
  res.json({
    message: 'Модуль reviews работает!',
    endpoints: [
      'POST /api/reviews/order/:orderId',
      'GET  /api/reviews/courier/:courierId'
    ]
  });
});

module.exports = router;