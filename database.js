const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cantina_crud',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  // Configurações de pool
  max: 20,           // máximo de clientes no pool
  idleTimeoutMillis: 30000, // tempo para fechar clientes inativos
  connectionTimeoutMillis: 2000, // tempo limite para conectar
});

// Evento de conexão bem-sucedida
pool.on('connect', () => {
  console.log('🐘 Conectado ao PostgreSQL');
});

// Evento de erro
pool.on('error', (err) => {
  console.error('❌ Erro no PostgreSQL:', err);
});

// Função para testar conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Teste de conexão PostgreSQL bem-sucedido:', result.rows[0].current_time);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Falha no teste de conexão PostgreSQL:', err.message);
    return false;
  }
};

// Função helper para executar queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('❌ Erro na query:', { text, error: err.message });
    throw err;
  }
};

// Função para obter um cliente do pool (para transações)
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};