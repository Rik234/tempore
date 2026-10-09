// ============================================
// routes/auth.js
// ============================================
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const db = require('../db');
const authMiddleware = require('../middlewares/auth');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'couriers');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'courier-' + Date.now() + '-' + Math.round(Math.random() * 1E6) + ext);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Разрешены только JPG, PNG или WEBP'));
};
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

// РЕГИСТРАЦИЯ КЛИЕНТА
router.post('/register', async (req, res) => {
  try {
    const { full_name, phone, email, password, city, address } = req.body;
    if (!full_name || !phone || !email || !password) {
      return res.status(400).json({ success: false, message: 'Заполните все поля' });
    }
    const [ex] = await db.pool.query('SELECT client_id FROM clients WHERE email = ?', [email]);
    if (ex.length > 0) return res.status(409).json({ success: false, message: 'Email уже занят' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.pool.query(
      `INSERT INTO clients (full_name, phone, email, password_hash, city, address) VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, phone, email, password_hash, city || null, address || null]
    );
    res.status(201).json({ success: true, message: 'Регистрация успешна!', client_id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ВХОД
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Введите email и пароль' });

    const [clients] = await db.pool.query('SELECT * FROM clients WHERE email = ?', [email]);
    if (clients.length > 0 && await bcrypt.compare(password, clients[0].password_hash)) {
      const c = clients[0];
      const token = jwt.sign(
        { client_id: c.client_id, email: c.email, role: 'client' },
        process.env.JWT_SECRET || 'super-secret-key-change-me',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true, message: 'Вход выполнен!', role: 'client', token,
        user: { id: c.client_id, full_name: c.full_name, email: c.email, city: c.city }
      });
    }

    const [couriers] = await db.pool.query('SELECT * FROM couriers WHERE email = ?', [email]);
    if (couriers.length > 0 && await bcrypt.compare(password, couriers[0].password_hash)) {
      const c = couriers[0];
      const token = jwt.sign(
        { courier_id: c.courier_id, email: c.email, role: 'courier' },
        process.env.JWT_SECRET || 'super-secret-key-change-me',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true, message: 'Вход выполнен!', role: 'courier', token,
        user: { id: c.courier_id, full_name: c.full_name, email: c.email, transport: c.transport, photo: c.photo }
      });
    }

    return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ПРОФИЛЬ КЛИЕНТА
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'client') return res.status(403).json({ success: false, message: 'Только для клиентов' });

    const [rows] = await db.pool.query(
      `SELECT client_id, full_name, phone, email, city, address, created_at FROM clients WHERE client_id = ?`,
      [req.client.client_id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Не найден' });

    const [stats] = await db.pool.query(
      `SELECT COUNT(*) AS total_orders,
              COALESCE(SUM(delivery_price), 0) AS total_spent,
              SUM(CASE WHEN status IN ('новый','принят','в пути') THEN 1 ELSE 0 END) AS active_orders
       FROM orders WHERE client_id = ?`,
      [req.client.client_id]
    );

    res.json({ success: true, client: rows[0], stats: stats[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ОБНОВИТЬ ПРОФИЛЬ КЛИЕНТА
router.put('/me', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'client') return res.status(403).json({ success: false, message: 'Только для клиентов' });

    const { full_name, phone, city, address } = req.body;
    if (!full_name || !phone) return res.status(400).json({ success: false, message: 'ФИО и телефон обязательны' });

    await db.pool.query(
      `UPDATE clients SET full_name = ?, phone = ?, city = ?, address = ? WHERE client_id = ?`,
      [full_name, phone, city || null, address || null, req.client.client_id]
    );

    const [rows] = await db.pool.query(
      `SELECT client_id, full_name, phone, email, city, address, created_at FROM clients WHERE client_id = ?`,
      [req.client.client_id]
    );
    res.json({ success: true, message: 'Профиль обновлён!', client: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ПРОФИЛЬ КУРЬЕРА + РЕЙТИНГ
router.get('/courier-me', authMiddleware, async (req, res) => {
  try {
    if (req.client.role !== 'courier') return res.status(403).json({ success: false, message: 'Только для курьеров' });

    const [rows] = await db.pool.query(
      `SELECT courier_id, full_name, phone, email, photo, transport, work_status, created_at
       FROM couriers WHERE courier_id = ?`,
      [req.client.courier_id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Не найден' });

    const [stats] = await db.pool.query(
      `SELECT COUNT(d.delivery_id) AS total_orders,
              SUM(CASE WHEN o.status IN ('принят','в пути') THEN 1 ELSE 0 END) AS active_orders,
              SUM(CASE WHEN o.status = 'доставлен' THEN 1 ELSE 0 END) AS completed_orders,
              COALESCE(SUM(CASE WHEN o.status = 'доставлен' THEN o.delivery_price ELSE 0 END), 0) AS total_earned
       FROM deliveries d JOIN orders o ON o.order_id = d.order_id
       WHERE d.courier_id = ?`,
      [req.client.courier_id]
    );

    const [ratingInfo] = await db.pool.query(
      `SELECT COUNT(*) AS total_reviews, COALESCE(AVG(rating), 0) AS avg_rating
       FROM reviews WHERE courier_id = ?`,
      [req.client.courier_id]
    );

    res.json({
      success: true,
      courier: rows[0],
      stats: stats[0] || { total_orders: 0, active_orders: 0, completed_orders: 0, total_earned: 0 },
      rating: {
        avg: parseFloat(ratingInfo[0].avg_rating).toFixed(1),
        count: ratingInfo[0].total_reviews
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// РЕГИСТРАЦИЯ КУРЬЕРА
router.post('/register-courier', upload.single('photo'), async (req, res) => {
  try {
    const { full_name, phone, email, password, transport } = req.body;
    if (!full_name || !phone || !email || !password) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Заполните поля' });
    }
    const [ex] = await db.pool.query('SELECT courier_id FROM couriers WHERE email = ?', [email]);
    if (ex.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ success: false, message: 'Email уже занят' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const photoName = req.file ? req.file.filename : null;

    const [result] = await db.pool.query(
      `INSERT INTO couriers (full_name, phone, email, password_hash, photo, transport, work_status)
       VALUES (?, ?, ?, ?, ?, ?, 'свободен')`,
      [full_name, phone, email, password_hash, photoName, transport || 'Пеший']
    );

    res.status(201).json({ success: true, message: 'Курьер зарегистрирован!', courier_id: result.insertId, photo: photoName });
  } catch (e) {
    if (req.file) { try { fs.unlinkSync(req.file.path); } catch(x) {} }
    console.error(e);
    res.status(500).json({ success: false, message: e.message || 'Ошибка сервера' });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'auth OK' });
});

module.exports = router;