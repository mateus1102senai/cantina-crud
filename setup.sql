-- =====================================================
-- SETUP BANCO DE DADOS - SISTEMA CANTINA CRUD
-- =====================================================
-- Este arquivo contém a estrutura completa do banco
-- de dados para o sistema de gerenciamento da cantina
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS cantina_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cantina_db;

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'operador', 'vendedor') DEFAULT 'operador',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE CATEGORIAS
-- =====================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE PRODUTOS
-- =====================================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    codigo_barras VARCHAR(50) UNIQUE,
    categoria_id INT,
    preco DECIMAL(10,2) NOT NULL,
    custo DECIMAL(10,2),
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 5,
    estoque_maximo INT,
    unidade_medida ENUM('UN', 'KG', 'L', 'CX') DEFAULT 'UN',
    perecivel BOOLEAN DEFAULT FALSE,
    data_validade DATE,
    imagem_url VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_nome (nome),
    INDEX idx_codigo_barras (codigo_barras)
);

-- =====================================================
-- TABELA DE MOVIMENTAÇÃO DE ESTOQUE
-- =====================================================
CREATE TABLE movimentacao_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    tipo_movimentacao ENUM('entrada', 'saida', 'ajuste', 'venda') NOT NULL,
    quantidade INT NOT NULL,
    estoque_anterior INT NOT NULL,
    estoque_novo INT NOT NULL,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    observacoes TEXT,
    usuario_id INT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_produto (produto_id),
    INDEX idx_data (data_movimentacao),
    INDEX idx_tipo (tipo_movimentacao)
);

-- =====================================================
-- TABELA DE VENDAS
-- =====================================================
CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_venda VARCHAR(20) UNIQUE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0,
    valor_final DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('dinheiro', 'cartao', 'pix', 'fiado') NOT NULL,
    status_venda ENUM('concluida', 'cancelada', 'pendente') DEFAULT 'concluida',
    observacoes TEXT,
    usuario_id INT,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_numero_venda (numero_venda),
    INDEX idx_data_venda (data_venda),
    INDEX idx_status (status_venda)
);

-- =====================================================
-- TABELA DE ITENS DA VENDA
-- =====================================================
CREATE TABLE itens_venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_venda (venda_id),
    INDEX idx_produto (produto_id)
);

-- =====================================================
-- TABELA DE FORNECEDORES
-- =====================================================
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    contato VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE COMPRAS/ENTRADA DE PRODUTOS
-- =====================================================
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_nota VARCHAR(50),
    fornecedor_id INT,
    valor_total DECIMAL(10,2) NOT NULL,
    data_compra DATE NOT NULL,
    data_entrega DATE,
    status_compra ENUM('pendente', 'entregue', 'cancelada') DEFAULT 'pendente',
    observacoes TEXT,
    usuario_id INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_data_compra (data_compra),
    INDEX idx_fornecedor (fornecedor_id)
);

-- =====================================================
-- TABELA DE ITENS DA COMPRA
-- =====================================================
CREATE TABLE itens_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_compra (compra_id),
    INDEX idx_produto (produto_id)
);

-- =====================================================
-- INSERIR DADOS INICIAIS
-- =====================================================

-- Usuário administrador padrão
INSERT INTO usuarios (username, password_hash, nome_completo, email, role) VALUES
('admin', '$2b$10$8X9.KQJ1X9ZQQ9Q9Q9Q9Q9', 'Administrador Sistema', 'admin@cantina.com', 'admin'),
('operador', '$2b$10$8X9.KQJ1X9ZQQ9Q9Q9Q9Q9', 'Operador Cantina', 'operador@cantina.com', 'operador');

-- Categorias padrão
INSERT INTO categorias (nome, descricao) VALUES
('Lanches', 'Sanduíches, hamburgers, wraps'),
('Bebidas', 'Sucos, refrigerantes, água, café'),
('Salgados', 'Coxinha, pastel, esfirra, pão de açúcar'),
('Doces', 'Brigadeiros, pudins, tortas, bolos'),
('Frutas', 'Frutas frescas e saladas de frutas'),
('Outros', 'Itens diversos');

-- Produtos de exemplo
INSERT INTO produtos (nome, descricao, categoria_id, preco, custo, estoque_atual, estoque_minimo, estoque_maximo) VALUES
('Sanduíche Natural', 'Sanduíche com peito de peru, queijo, alface e tomate', 1, 6.00, 3.50, 25, 10, 50),
('Suco de Laranja 300ml', 'Suco natural de laranja', 2, 5.50, 3.00, 30, 15, 60),
('Pastel de Frango', 'Pastel assado com recheio de frango desfiado', 3, 6.50, 3.80, 20, 10, 40),
('Refrigerante Lata', 'Refrigerante diversos sabores 350ml', 2, 4.00, 2.50, 50, 20, 100),
('Brigadeiro', 'Brigadeiro tradicional', 4, 2.00, 1.00, 30, 12, 50),
('Água Mineral 500ml', 'Água mineral sem gás', 2, 2.50, 1.50, 40, 25, 80),
('Coxinha', 'Coxinha de frango tradicional', 3, 5.00, 2.80, 25, 15, 50),
('Bolo de Chocolate', 'Fatia de bolo de chocolate com cobertura', 4, 4.50, 2.20, 15, 8, 30);

-- Fornecedores de exemplo
INSERT INTO fornecedores (nome, cnpj, contato, telefone, email) VALUES
('Distribuidora Alimentar Ltda', '12.345.678/0001-90', 'João Silva', '(11) 98765-4321', 'joao@distribuidora.com'),
('Padaria Central', '98.765.432/0001-10', 'Maria Santos', '(11) 91234-5678', 'maria@padaria.com'),
('Hortifruti Fresh', '11.223.344/0001-55', 'Carlos Oliveira', '(11) 95555-6666', 'carlos@fresh.com');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View de produtos com status de estoque
CREATE VIEW vw_produtos_estoque AS
SELECT 
    p.id,
    p.nome,
    p.codigo_barras,
    c.nome AS categoria,
    p.preco,
    p.estoque_atual,
    p.estoque_minimo,
    p.estoque_maximo,
    CASE 
        WHEN p.estoque_atual <= (p.estoque_minimo * 0.5) THEN 'CRÍTICO'
        WHEN p.estoque_atual <= p.estoque_minimo THEN 'BAIXO'
        ELSE 'NORMAL'
    END AS status_estoque,
    p.ativo
FROM produtos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.ativo = TRUE;

-- View de vendas do dia
CREATE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) AS total_vendas,
    SUM(valor_final) AS total_faturamento,
    AVG(valor_final) AS ticket_medio
FROM vendas 
WHERE DATE(data_venda) = CURDATE() 
AND status_venda = 'concluida';

-- View de produtos mais vendidos
CREATE VIEW vw_produtos_mais_vendidos AS
SELECT 
    p.nome,
    SUM(iv.quantidade) AS total_vendido,
    SUM(iv.subtotal) AS total_faturamento
FROM produtos p
INNER JOIN itens_venda iv ON p.id = iv.produto_id
INNER JOIN vendas v ON iv.venda_id = v.id
WHERE v.status_venda = 'concluida'
GROUP BY p.id, p.nome
ORDER BY total_vendido DESC;

-- =====================================================
-- PROCEDURES ÚTEIS
-- =====================================================

-- Procedure para registrar movimentação de estoque
DELIMITER //
CREATE PROCEDURE sp_movimentar_estoque(
    IN p_produto_id INT,
    IN p_tipo ENUM('entrada', 'saida', 'ajuste', 'venda'),
    IN p_quantidade INT,
    IN p_valor_unitario DECIMAL(10,2),
    IN p_observacoes TEXT,
    IN p_usuario_id INT
)
BEGIN
    DECLARE v_estoque_atual INT;
    DECLARE v_novo_estoque INT;
    
    -- Buscar estoque atual
    SELECT estoque_atual INTO v_estoque_atual 
    FROM produtos 
    WHERE id = p_produto_id;
    
    -- Calcular novo estoque
    IF p_tipo IN ('entrada', 'ajuste') THEN
        SET v_novo_estoque = v_estoque_atual + p_quantidade;
    ELSE
        SET v_novo_estoque = v_estoque_atual - p_quantidade;
    END IF;
    
    -- Verificar se estoque não fica negativo
    IF v_novo_estoque < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente';
    END IF;
    
    -- Inserir movimentação
    INSERT INTO movimentacao_estoque 
    (produto_id, tipo_movimentacao, quantidade, estoque_anterior, estoque_novo, valor_unitario, valor_total, observacoes, usuario_id)
    VALUES 
    (p_produto_id, p_tipo, p_quantidade, v_estoque_atual, v_novo_estoque, p_valor_unitario, p_valor_unitario * p_quantidade, p_observacoes, p_usuario_id);
    
    -- Atualizar estoque do produto
    UPDATE produtos 
    SET estoque_atual = v_novo_estoque,
        ultima_alteracao = CURRENT_TIMESTAMP
    WHERE id = p_produto_id;
    
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para gerar número da venda automaticamente
DELIMITER //
CREATE TRIGGER tr_gerar_numero_venda 
BEFORE INSERT ON vendas
FOR EACH ROW
BEGIN
    IF NEW.numero_venda IS NULL OR NEW.numero_venda = '' THEN
        SET NEW.numero_venda = CONCAT('V', YEAR(NOW()), LPAD(MONTH(NOW()), 2, '0'), LPAD(DAY(NOW()), 2, '0'), LPAD((SELECT IFNULL(MAX(SUBSTRING(numero_venda, -4)), 0) + 1 FROM vendas WHERE DATE(data_venda) = CURDATE()), 4, '0'));
    END IF;
END //
DELIMITER ;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_movimentacao_data ON movimentacao_estoque(data_movimentacao DESC);
CREATE INDEX idx_vendas_data ON vendas(data_venda DESC);
CREATE INDEX idx_produtos_estoque ON produtos(estoque_atual, estoque_minimo);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

/*
INSTRUÇÕES DE USO:

1. Execute este script em seu MySQL/MariaDB
2. Configure as credenciais no arquivo .env
3. Ajuste o server.js para usar o banco real em vez do mock
4. Os dados de exemplo incluem:
   - Usuários: admin/admin, operador/operador  
   - 6 categorias de produtos
   - 8 produtos de exemplo
   - 3 fornecedores

PRÓXIMOS PASSOS:
- Implementar hash real de senhas
- Configurar conexão com banco no server.js
- Adicionar validações de negócio
- Implementar logs de auditoria
- Adicionar backup automático

SEGURANÇA:
- Alterar senhas padrão
- Configurar SSL
- Implementar rate limiting
- Validar todas as entradas
*/