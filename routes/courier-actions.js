// ============================================
// routes/courier-actions.js — действия курьера
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');

// ============================================
// СМЕНИТЬ СТАТУС ЗАКАЗА: PUT /api/courier/orders/:id/status
// Тело: { "status": "в пути" | "доставлен" }
// ============================================
router.put('/orders/:id/status', authMiddleware, async (req, res) => {
  const connection = await db.pool.getConnection();

  try {
    if (req.client.role !== 'courier') {
      connection.release();
      return res.status(403).json({ success: false, message: 'Доступ только для курьеров' });
    }

    const courier_id = req.client.courier_id;
    const order_id = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ['в пути', 'доставлен'];
    if (!allowedStatuses.includes(status)) {
      connection.release();
      return res.status(400).json({ 
        success: false, 
        message: 'Курьер может установить только "в пути" или "доставлен"' 
      });
    }

    const [delivery] = await connection.query(
      `SELECT d.delivery_id, o.status AS current_status 
       FROM deliveries d
       JOIN orders o ON o.order_id = d.order_id
       WHERE d.order_id = ? AND d.courier_id = ?`,
      [order_id, courier_id]
    );

    if (delivery.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Заказ не найден или не ваш' });
    }

    const currentStatus = delivery[0].current_status;

    if (status === 'в пути' && currentStatus !== 'принят') {
      connection.release();
      return res.status(400).json({ 
        success: false, 
        message: 'Можно выехать только по заказу со статусом "принят"' 
      });
    }

    if (status === 'доставлен' && currentStatus !== 'в пути') {
      connection.release();
      return res.status(400).json({ 
        success: false, 
        message: 'Можно доставить только заказ со статусом "в пути"' 
      });
    }

    await connection.beginTransaction();

    await connection.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, order_id]
    );

    if (status === 'доставлен') {
      await connection.query(
        "UPDATE couriers SET work_status = 'свободен' WHERE courier_id = ?",
        [courier_id]
      );

      await connection.query(
        "UPDATE payments SET status = 'оплачено' WHERE order_id = ?",
        [order_id]
      );
    }

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      message: status === 'доставлен' 
        ? 'Заказ доставлен! Оплата отмечена как полученная.' 
        : 'Статус обновлён: ' + status
    });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Ошибка при смене статуса заказа:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// СМЕНИТЬ СТАТУС РАБОТЫ: PUT /api/courier/work-status
// ============================================
router.put('/work-status', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'courier') {
      return res.status(403).json({ success: false, message: 'Доступ только для курьеров' });
    }

    const courier_id = req.client.courier_id;
    const { work_status } = req.body;

    const allowed = ['свободен', 'занят', 'неактивен'];
    if (!allowed.includes(work_status)) {
      return res.status(400).json({ success: false, message: 'Недопустимый статус' });
    }

    if (work_status === 'свободен') {
      const [active] = await db.pool.query(
        `SELECT COUNT(*) AS cnt 
         FROM deliveries d
         JOIN orders o ON o.order_id = d.order_id
         WHERE d.courier_id = ? AND o.status IN ('принят', 'в пути')`,
        [courier_id]
      );

      if (active[0].cnt > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'У вас есть активные заказы. Сначала завершите их.' 
        });
      }
    }

    await db.pool.query(
      'UPDATE couriers SET work_status = ? WHERE courier_id = ?',
      [work_status, courier_id]
    );

    res.json({ 
      success: true, 
      message: 'Статус работы обновлён: ' + work_status 
    });

  } catch (error) {
    console.error('Ошибка при смене статуса работы:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ТЕСТ
// ============================================
router.get('/test', (req, res) => {
  res.json({
    message: 'Модуль courier-actions работает!',
    endpoints: [
      'PUT /api/courier/orders/:id/status',
      'PUT /api/courier/work-status'
    ]
  });
});

module.exports = router;