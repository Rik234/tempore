// ============================================
// server.js — точка входа
// ============================================
const express = require('express');
const path = require('path');

// Подключение базы данных и роутов
const db = require('./db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const courierActionsRoutes = require('./routes/courier-actions');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON и раздачи статических файлов
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение роутов API
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/courier', courierActionsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Тестовый роут для проверки работы сервера
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

// Проверка подключения к БД при старте
db.testConnection();

// Запуск сервера
app.listen(PORT, () => {
  console.log('============================================');
  console.log('✅ Сервер запущен на порту ' + PORT);
  console.log('============================================');
});