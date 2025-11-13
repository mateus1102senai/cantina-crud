const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar módulo do banco
const { query, testConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticação JWT (opcional para algumas rotas)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// =====================================================
// ROTAS DE AUTENTICAÇÃO
// =====================================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    // Buscar usuário no banco
    const userResult = await query(
      'SELECT id, "user" as username, password FROM usuarios WHERE "user" = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = userResult.rows[0];

    // Para demonstração, aceita senha "123456" ou verifica hash
    const validPassword = password === '123456' || await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// ROTAS DE PRODUTOS
// =====================================================

// Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, qtd, price, available FROM produtos WHERE available = true ORDER BY name'
    );

    const produtos = result.rows.map(row => ({
      id: row.id,
      nome: row.name,
      estoque: row.qtd,
      preco: parseFloat(row.price),
      disponivel: row.available,
      status: row.qtd <= 5 ? 'critico' : row.qtd <= 10 ? 'baixo' : 'normal'
    }));

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, qtd, price, available FROM produtos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const produto = result.rows[0];
    res.json({
      id: produto.id,
      nome: produto.name,
      estoque: produto.qtd,
      preco: parseFloat(produto.price),
      disponivel: produto.available
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preco, estoque = 0 } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    const result = await query(
      'INSERT INTO produtos (name, qtd, price, available) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, estoque, preco, true]
    );

    const produto = result.rows[0];
    res.status(201).json({
      id: produto.id,
      nome: produto.name,
      estoque: produto.qtd,
      preco: parseFloat(produto.price),
      disponivel: produto.available
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, estoque, disponivel } = req.body;

    const result = await query(
      'UPDATE produtos SET name = $1, price = $2, qtd = $3, available = $4 WHERE id = $5 RETURNING *',
      [nome, preco, estoque, disponivel, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const produto = result.rows[0];
    res.json({
      id: produto.id,
      nome: produto.name,
      estoque: produto.qtd,
      preco: parseFloat(produto.price),
      disponivel: produto.available
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Deletar produto (soft delete)
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'UPDATE produtos SET available = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

// =====================================================
// ROTAS DE VENDAS
// =====================================================

// Listar todas as vendas
app.get('/api/vendas', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        v.id,
        v.created_at,
        p.name as produto_nome,
        p.price as produto_preco,
        u."user" as usuario_nome
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      JOIN usuarios u ON v.usuario_id = u.id
      ORDER BY v.created_at DESC
      LIMIT 50
    `);

    const vendas = result.rows.map(row => ({
      id: row.id,
      data: row.created_at,
      produto: row.produto_nome,
      preco: parseFloat(row.produto_preco),
      usuario: row.usuario_nome
    }));

    res.json(vendas);
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
});

// Registrar nova venda
app.post('/api/vendas', async (req, res) => {
  try {
    const { produto_id, usuario_id = 1 } = req.body;

    if (!produto_id) {
      return res.status(400).json({ error: 'ID do produto é obrigatório' });
    }

    // Usar function do PostgreSQL para registrar venda
    const result = await query(
      'SELECT registrar_venda($1, $2) as resultado',
      [produto_id, usuario_id]
    );

    const resultado = result.rows[0].resultado;

    if (resultado.success) {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

// =====================================================
// ROTA DO DASHBOARD
// =====================================================

app.get('/api/dashboard', async (req, res) => {
  try {
    // Usar function do PostgreSQL para obter estatísticas
    const result = await query('SELECT obter_estatisticas() as stats');
    const stats = result.rows[0].stats;

    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    // Fallback com dados mock se houver erro
    res.json({
      total_produtos: 0,
      vendas_hoje: 0,
      receita_hoje: 0,
      produtos_criticos: 0
    });
  }
});

// =====================================================
// ROTA DE SAÚDE
// =====================================================

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================================
// ROTA 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Rota não encontrada',
    availableRoutes: [
      'POST /api/auth/login',
      'GET /api/produtos',
      'POST /api/produtos',
      'PUT /api/produtos/:id',
      'DELETE /api/produtos/:id',
      'GET /api/vendas',
      'POST /api/vendas',
      'GET /api/dashboard',
      'GET /api/health'
    ]
  });
});

// =====================================================
// INICIALIZAR SERVIDOR
// =====================================================

const startServer = async () => {
  try {
    // Testar conexão com banco
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Falha ao conectar com PostgreSQL');
      console.log('📝 Verifique se:');
      console.log('   - PostgreSQL está rodando');
      console.log('   - Banco "cantina_crud" existe');
      console.log('   - Credenciais no .env estão corretas');
      console.log('   - Execute o arquivo setup.sql no PostgreSQL');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
🍽️  Servidor da Cantina rodando!
📡  Porta: ${PORT}
🌐  URL: http://localhost:${PORT}
📊  Health Check: http://localhost:${PORT}/api/health
⏰  Iniciado em: ${new Date().toLocaleString('pt-BR')}

📝  Rotas disponíveis:
   POST /api/auth/login
   GET  /api/produtos
   POST /api/produtos
   PUT  /api/produtos/:id
   DELETE /api/produtos/:id
   GET  /api/vendas
   POST /api/vendas
   GET  /api/dashboard
   GET  /api/health

🔗  Banco: PostgreSQL (${process.env.DB_NAME})
🔑  Usuário padrão: admin / senha: 123456
      `);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratar erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Iniciar servidor
startServer();