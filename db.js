// ============================================
// db.js — подключение к MySQL (универсальный)
// Читает и DB_*, и MYSQL* переменные (для Railway)
// ============================================

require('dotenv').config();
const mysql = require('mysql2/promise');

// Универсальные переменные:
// Локально — DB_HOST, DB_USER...
// На Railway — MYSQLHOST, MYSQLUSER...
const DB_HOST = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const DB_PORT = process.env.DB_PORT || process.env.MYSQLPORT || 3306;
const DB_USER = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
const DB_NAME = process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'courier_db';

// Для отладки
console.log('🔌 DB Config:');
console.log('   Host:', DB_HOST);
console.log('   Port:', DB_PORT);
console.log('   User:', DB_USER);
console.log('   Database:', DB_NAME);

const pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Подключение к MySQL успешно!');
    console.log('📊 База данных:', DB_NAME);
    connection.release();
  } catch (error) {
    console.error('❌ Ошибка подключения к MySQL:', error.message);
  }
}

module.exports = { pool, testConnection };