const express = require('express');
const path = require('path');

const db = require('./db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const courierActionsRoutes = require('./routes/courier-actions');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const app = express();
const PORT = 3000;
const adminRoutes = require('./routes/admin');
// ...
app.use('/api/admin', adminRoutes);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/courier', courierActionsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

db.testConnection();

app.listen(PORT, () => {
  console.log('=================================');
  console.log('✅ Сервер запущен на порту ' + PORT);
  console.log('=================================');
});