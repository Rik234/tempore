// ============================================
// routes/orders.js — заказы + трекер + расчёт цены
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');

// ============================================
// ТАРИФЫ
// ============================================
const SERVICE_PRICES = {
  'документы': 250, 'посылки': 350, 'продукты': 300,
  'подарки': 400, 'бизнесу': 500, 'срочно': 600, 'стандарт': 300
};
const URGENCY_PRICES = { 'asap': 200, '2hours': 100, 'today': 0, 'tomorrow': -50 };
const ZONE_PRICES = { 'центр': 0, 'стандарт': 100, 'окраина': 200, 'за город': 400 };

const SERVICE_KEYWORDS = {
  'документы': ['документ', 'бумаг', 'договор', 'паспорт', 'справк', 'визитк'],
  'продукты':  ['продукт', 'еда', 'магазин', 'пить', 'хлеб', 'молок', 'овощ'],
  'подарки':   ['подарок', 'цвет', 'букет', 'сюрприз', 'торт'],
  'посылки':   ['посылк', 'коробк', 'пакет', 'груз', 'товар'],
  'бизнесу':   ['бизнес', 'компан', 'офис', 'корпоратив']
};
const ZONE_KEYWORDS = {
  'за город':  ['область', 'мкад', 'подмосков', 'обл'],
  'окраина':   ['черёмуш', 'черемуш', 'химки', 'митино', 'бутово', 'солнцево', 'новокосин', 'люберц'],
  'центр':     ['ленина', 'тверск', 'красн', 'арбат', 'лубянк', 'пушкинск', 'неглинн', 'петровк', 'мясницк']
};

function detectServiceType(description) {
  if (!description) return 'стандарт';
  const text = description.toLowerCase();
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return service;
  }
  return 'стандарт';
}

function detectZone(fromAddress, toAddress) {
  const text = (fromAddress + ' ' + toAddress).toLowerCase();
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return zone;
  }
  return 'стандарт';
}

function getTimeMultiplier() {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 9) return 1.3;
  if (hour >= 18) return 1.1;
  return 1.0;
}

function calculatePrice({ from_address, to_address, description, urgency, payment_method }) {
  const service_type = detectServiceType(description);
  const zone = detectZone(from_address, to_address);

  const basePrice = SERVICE_PRICES[service_type] || SERVICE_PRICES['стандарт'];
  const urgencyPrice = URGENCY_PRICES[urgency] !== undefined ? URGENCY_PRICES[urgency] : 0;
  const zonePrice = ZONE_PRICES[zone] || 0;

  let total = basePrice + urgencyPrice + zonePrice;
  const timeMultiplier = getTimeMultiplier();
  total = total * timeMultiplier;

  if (payment_method === 'карта' || payment_method === 'онлайн') total = total * 0.95;

  total = Math.round(total / 10) * 10;
  if (total < 250) total = 250;

  return {
    service_type, zone, urgency,
    base_price: basePrice, urgency_price: urgencyPrice, zone_price: zonePrice,
    time_multiplier: timeMultiplier, total
  };
}

// ============================================
// РАСЧЁТ ЦЕНЫ: POST /api/orders/calculate
// ============================================
router.post('/calculate', async (req, res) => {
  try {
    const { from_address, to_address, description, urgency, payment_method } = req.body;
    const result = calculatePrice({ from_address, to_address, description, urgency, payment_method });
    res.json({ success: true, calculation: result });
  } catch (error) {
    console.error('Ошибка при расчёте цены:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ТРЕКЕР ЗАКАЗА (публичный): GET /api/orders/track/:orderId
// ============================================
router.get('/track/:orderId', async (req, res) => {
  try {
    const order_id = parseInt(req.params.orderId);

    if (isNaN(order_id)) {
      return res.status(400).json({ success: false, message: 'Неверный номер заказа' });
    }

    const [orders] = await db.pool.query(
      `SELECT 
        o.order_id, o.from_address, o.to_address, o.description,
        o.delivery_price, o.status, o.order_date,
        o.service_type, o.zone,
        c.full_name AS courier_name
       FROM orders o
       LEFT JOIN deliveries d ON d.order_id = o.order_id
       LEFT JOIN couriers c ON c.courier_id = d.courier_id
       WHERE o.order_id = ?`,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Заказ #' + order_id + ' не найден' });
    }

    res.json({ success: true, order: orders[0] });

  } catch (error) {
    console.error('Ошибка трекера:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
  }
});

// ============================================
// СОЗДАТЬ ЗАКАЗ: POST /api/orders
// ============================================
router.post('/', authMiddleware, async (req, res) => {
  const connection = await db.pool.getConnection();
  try {
    const { from_address, to_address, description, urgency, payment_method } = req.body;
    const client_id = req.client.client_id;

    if (!from_address || !to_address) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Укажите адреса' });
    }

    const calc = calculatePrice({ from_address, to_address, description, urgency, payment_method });
    const delivery_price = calc.total;

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (client_id, from_address, to_address, description, delivery_price, 
         service_type, zone, urgency, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'принят')`,
      [client_id, from_address, to_address, description || null, delivery_price,
       calc.service_type, calc.zone, calc.urgency || 'today']
    );

    const order_id = orderResult.insertId;

    await connection.query(
      `INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, 'ожидает')`,
      [order_id, delivery_price, payment_method || 'карта']
    );

    const [freeCouriers] = await connection.query(
      `SELECT courier_id, full_name FROM couriers WHERE work_status = 'свободен' ORDER BY courier_id ASC LIMIT 1`
    );

    let assignedCourier = null;
    if (freeCouriers.length > 0) {
      assignedCourier = freeCouriers[0];
      await connection.query(
        `INSERT INTO deliveries (order_id, courier_id) VALUES (?, ?)`,
        [order_id, assignedCourier.courier_id]
      );
      await connection.query(
        `UPDATE couriers SET work_status = 'занят' WHERE courier_id = ?`,
        [assignedCourier.courier_id]
      );
    } else {
      await connection.query(
        `INSERT INTO deliveries (order_id, courier_id) VALUES (?, NULL)`,
        [order_id]
      );
    }

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: assignedCourier 
        ? 'Заказ создан! Назначен курьер: ' + assignedCourier.full_name
        : 'Заказ создан! Свободных курьеров нет',
      order_id: order_id,
      delivery_price: delivery_price,
      calculation: calc,
      courier: assignedCourier
    });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// МОИ ЗАКАЗЫ (клиент)
// ============================================
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'client') {
      return res.status(403).json({ success: false, message: 'Доступ только для клиентов' });
    }
    const client_id = req.client.client_id;

    const [orders] = await db.pool.query(
      `SELECT 
        o.order_id, o.from_address, o.to_address, o.description,
        o.delivery_price, o.status, o.order_date,
        o.service_type, o.zone, o.urgency,
        p.method AS payment_method, p.status AS payment_status,
        c.full_name AS courier_name, c.photo AS courier_photo,
        c.transport AS courier_transport, c.phone AS courier_phone
       FROM orders o
       LEFT JOIN payments p ON p.order_id = o.order_id
       LEFT JOIN deliveries d ON d.order_id = o.order_id
       LEFT JOIN couriers c ON c.courier_id = d.courier_id
       WHERE o.client_id = ?
       ORDER BY o.order_date DESC`,
      [client_id]
    );

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Ошибка при получении заказов клиента:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// МОИ ЗАКАЗЫ (курьер)
// ============================================
router.get('/courier', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'courier') {
      return res.status(403).json({ success: false, message: 'Доступ только для курьеров' });
    }
    const courier_id = req.client.courier_id;

    const [orders] = await db.pool.query(
      `SELECT 
        o.order_id, o.from_address, o.to_address, o.description,
        o.delivery_price, o.status, o.order_date,
        o.service_type, o.zone, o.urgency,
        p.method AS payment_method, p.status AS payment_status,
        cl.full_name AS client_name, cl.phone AS client_phone, cl.city AS client_city
       FROM deliveries d
       JOIN orders o ON o.order_id = d.order_id
       JOIN clients cl ON cl.client_id = o.client_id
       LEFT JOIN payments p ON p.order_id = o.order_id
       WHERE d.courier_id = ? AND o.status IN ('принят', 'в пути', 'доставлен')
       ORDER BY 
         CASE o.status 
           WHEN 'в пути' THEN 1
           WHEN 'принят' THEN 2
           WHEN 'доставлен' THEN 3
         END,
         o.order_date DESC`,
      [courier_id]
    );

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Ошибка при получении заказов курьера:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ОТМЕНИТЬ ЗАКАЗ
// ============================================
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'client') {
      return res.status(403).json({ success: false, message: 'Доступ только для клиентов' });
    }
    const order_id = req.params.id;
    const client_id = req.client.client_id;

    const [rows] = await db.pool.query(
      'SELECT status FROM orders WHERE order_id = ? AND client_id = ?',
      [order_id, client_id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Заказ не найден' });

    const currentStatus = rows[0].status;
    if (currentStatus === 'отменён') return res.status(400).json({ success: false, message: 'Заказ уже отменён' });
    if (currentStatus === 'доставлен') return res.status(400).json({ success: false, message: 'Доставленный заказ нельзя отменить' });
    if (currentStatus === 'в пути') return res.status(400).json({ success: false, message: 'Заказ уже в пути' });

    await db.pool.query("UPDATE orders SET status = 'отменён' WHERE order_id = ?", [order_id]);

    const [delivery] = await db.pool.query('SELECT courier_id FROM deliveries WHERE order_id = ?', [order_id]);
    if (delivery.length > 0 && delivery[0].courier_id) {
      await db.pool.query("UPDATE couriers SET work_status = 'свободен' WHERE courier_id = ?", [delivery[0].courier_id]);
    }

    await db.pool.query(
      "UPDATE payments SET status = CASE WHEN status = 'оплачено' THEN 'возврат' ELSE 'ожидает' END WHERE order_id = ?",
      [order_id]
    );

    res.json({ success: true, message: 'Заказ отменён' });
  } catch (error) {
    console.error('Ошибка при отмене заказа:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ============================================
// ТЕСТ
// ============================================
router.get('/test', (req, res) => {
  res.json({
    message: 'Модуль orders работает!',
    endpoints: [
      'POST /api/orders',
      'POST /api/orders/calculate',
      'GET  /api/orders/track/:orderId',
      'GET  /api/orders/my',
      'GET  /api/orders/courier',
      'PUT  /api/orders/:id/cancel'
    ]
  });
});

module.exports = router;