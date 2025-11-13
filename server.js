const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Simulação de banco de dados em memória
let produtos = [
  { id: 1, nome: 'Sanduíche Natural', categoria: 'lanches', preco: 6.00, estoque: 25, estoqueMinimo: 10 },
  { id: 2, nome: 'Suco de Laranja', categoria: 'bebidas', preco: 5.50, estoque: 8, estoqueMinimo: 15 },
  { id: 3, nome: 'Pastel de Frango', categoria: 'salgados', preco: 6.50, estoque: 2, estoqueMinimo: 10 },
  { id: 4, nome: 'Refrigerante Coca', categoria: 'bebidas', preco: 4.00, estoque: 30, estoqueMinimo: 20 },
  { id: 5, nome: 'Brigadeiro', categoria: 'doces', preco: 2.00, estoque: 15, estoqueMinimo: 12 }
];

let vendas = [
  { id: 1, produtoId: 1, produto: 'Sanduíche Natural', quantidade: 2, valor: 12.00, data: new Date().toISOString() },
  { id: 2, produtoId: 2, produto: 'Suco de Laranja', quantidade: 1, valor: 5.50, data: new Date().toISOString() }
];

let nextId = produtos.length + 1;
let nextVendaId = vendas.length + 1;

// Usuário padrão para demonstração
const usuario = {
  username: 'admin',
  password: 'admin', // Em produção, use hash da senha
  role: 'admin'
};

// ===== ROTAS DE AUTENTICAÇÃO =====
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Tentativa de login:', { username, password });
  
  if (username === usuario.username && password === usuario.password) {
    // Em produção, gerar JWT token real
    const token = 'fake-jwt-token-' + Date.now();
    res.json({
      success: true,
      token,
      user: {
        username: usuario.username,
        role: usuario.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// ===== ROTAS DE PRODUTOS =====
// Listar todos os produtos
app.get('/api/produtos', (req, res) => {
  const produtosComStatus = produtos.map(produto => ({
    ...produto,
    status: produto.estoque <= produto.estoqueMinimo * 0.5 ? 'critico'
           : produto.estoque <= produto.estoqueMinimo ? 'baixo'
           : 'ok'
  }));
  
  res.json(produtosComStatus);
});

// Buscar produto por ID
app.get('/api/produtos/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Criar novo produto
app.post('/api/produtos', (req, res) => {
  const { nome, descricao, preco, categoria, estoque, estoqueMinimo } = req.body;
  
  if (!nome || !preco || !categoria || estoque === undefined || estoqueMinimo === undefined) {
    return res.status(400).json({ message: 'Campos obrigatórios: nome, preco, categoria, estoque, estoqueMinimo' });
  }
  
  const novoProduto = {
    id: nextId++,
    nome,
    descricao: descricao || '',
    preco: parseFloat(preco),
    categoria,
    estoque: parseInt(estoque),
    estoqueMinimo: parseInt(estoqueMinimo)
  };
  
  produtos.push(novoProduto);
  
  console.log('Produto criado:', novoProduto);
  
  res.status(201).json({
    success: true,
    message: 'Produto criado com sucesso',
    produto: novoProduto
  });
});

// Atualizar produto
app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = produtos.findIndex(p => p.id === id);
  
  if (produtoIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  
  const { nome, descricao, preco, categoria, estoque, estoqueMinimo } = req.body;
  
  produtos[produtoIndex] = {
    ...produtos[produtoIndex],
    ...(nome && { nome }),
    ...(descricao !== undefined && { descricao }),
    ...(preco && { preco: parseFloat(preco) }),
    ...(categoria && { categoria }),
    ...(estoque !== undefined && { estoque: parseInt(estoque) }),
    ...(estoqueMinimo !== undefined && { estoqueMinimo: parseInt(estoqueMinimo) })
  };
  
  console.log('Produto atualizado:', produtos[produtoIndex]);
  
  res.json({
    success: true,
    message: 'Produto atualizado com sucesso',
    produto: produtos[produtoIndex]
  });
});

// Deletar produto
app.delete('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = produtos.findIndex(p => p.id === id);
  
  if (produtoIndex === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  
  produtos.splice(produtoIndex, 1);
  
  console.log('Produto deletado, ID:', id);
  
  res.json({
    success: true,
    message: 'Produto deletado com sucesso'
  });
});

// ===== ROTAS DE VENDAS =====
// Listar vendas
app.get('/api/vendas', (req, res) => {
  res.json(vendas);
});

// Registrar venda
app.post('/api/vendas', (req, res) => {
  const { produtoId, quantidade } = req.body;
  
  const produto = produtos.find(p => p.id === parseInt(produtoId));
  if (!produto) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  
  if (produto.estoque < quantidade) {
    return res.status(400).json({ message: 'Estoque insuficiente' });
  }
  
  // Atualizar estoque
  produto.estoque -= quantidade;
  
  // Registrar venda
  const novaVenda = {
    id: nextVendaId++,
    produtoId: produto.id,
    produto: produto.nome,
    quantidade,
    valor: produto.preco * quantidade,
    data: new Date().toISOString()
  };
  
  vendas.unshift(novaVenda); // Adiciona no início da lista
  
  console.log('Venda registrada:', novaVenda);
  
  res.status(201).json({
    success: true,
    message: 'Venda registrada com sucesso',
    venda: novaVenda
  });
});

// ===== ROTA DO DASHBOARD =====
app.get('/api/dashboard', (req, res) => {
  const totalProdutos = produtos.length;
  const totalVendas = vendas.length;
  const estoqueBaixo = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
  
  // Vendas de hoje
  const hoje = new Date().toDateString();
  const vendasHoje = vendas.filter(v => new Date(v.data).toDateString() === hoje);
  const vendaHoje = vendasHoje.reduce((total, venda) => total + venda.valor, 0);
  
  // Últimas vendas (5 mais recentes)
  const ultimasVendas = vendas.slice(0, 5).map(venda => ({
    ...venda,
    data: new Date(venda.data).toLocaleString('pt-BR')
  }));
  
  res.json({
    totalProdutos,
    totalVendas,
    estoqueBaixo,
    vendaHoje,
    ultimasVendas
  });
});

// ===== ROTA DE HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor da Cantina funcionando!'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicializar servidor
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
  `);
});