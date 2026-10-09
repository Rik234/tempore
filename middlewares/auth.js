// ============================================
// middlewares/auth.js — проверка JWT-токена
// ============================================

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Достаём токен из заголовка Authorization
  const authHeader = req.headers['authorization'];
  
  // Формат: "Bearer eyJhbGciOi..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Требуется авторизация' 
    });
  }

  try {
    // 2. Проверяем и расшифровываем токен
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'super-secret-key-change-me'
    );

    // 3. Кладём данные клиента в req (доступно дальше)
    req.client = decoded;
    
    // 4. Пропускаем дальше
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Недействительный токен' 
    });
  }
};