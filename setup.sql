-- =====================================
-- SISTEMA DE CANTINA - BANCO DE DADOS
-- PostgreSQL
-- =====================================

-- Criar banco de dados (execute separadamente no PostgreSQL)
-- CREATE DATABASE cantina_crud;

-- Conecte ao banco cantina_crud antes de executar o restante

-- 1. Tabela PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    qtd INTEGER NOT NULL,          -- Quantidade
    price DECIMAL(10,2) NOT NULL,  -- Preço
    available BOOLEAN NOT NULL     -- Disponível (Sim/Não)
);

-- 2. Tabela USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    "user" VARCHAR(50) NOT NULL UNIQUE, -- Nome de usuário (único) - "user" é palavra reservada
    password VARCHAR(100) NOT NULL
);

-- 3. Tabela VENDAS
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    produto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================
-- INSERIR DADOS DE EXEMPLO
-- =====================================

-- Limpar dados existentes (se houver)
DELETE FROM vendas;
DELETE FROM produtos;
DELETE FROM usuarios;

-- Reset sequences
ALTER SEQUENCE produtos_id_seq RESTART WITH 1;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE vendas_id_seq RESTART WITH 1;

-- Usuários padrão (senha: "123456" hasheada)
INSERT INTO usuarios ("user", password) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('cantina', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('funcionario', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Produtos de exemplo
INSERT INTO produtos (name, qtd, price, available) VALUES
('Pão de Açúcar', 50, 3.00, true),
('Refrigerante Coca-Cola 350ml', 30, 5.00, true),
('Salgadinho Chips', 25, 3.00, true),
('Café Expresso', 100, 3.00, true),
('Sanduíche Natural', 15, 8.00, true),
('Água Mineral 500ml', 40, 2.50, true),
('Bolo de Chocolate', 10, 4.50, true),
('Suco de Laranja', 20, 4.00, true),
('Biscoito Recheado', 35, 2.00, true),
('Iogurte Natural', 25, 3.50, true);

-- Vendas de exemplo
INSERT INTO vendas (produto_id, usuario_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 1), (5, 2),
(6, 3), (7, 2), (8, 1), (1, 3), (2, 2);

-- =====================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================

-- View para produtos com baixo estoque
CREATE OR REPLACE VIEW produtos_baixo_estoque AS
SELECT 
    id,
    name,
    qtd,
    price,
    CASE 
        WHEN qtd <= 5 THEN 'Crítico'
        WHEN qtd <= 10 THEN 'Baixo'
        ELSE 'Normal'
    END as status_estoque
FROM produtos 
WHERE qtd <= 10 AND available = true;

-- View para relatório de vendas
CREATE OR REPLACE VIEW relatorio_vendas AS
SELECT 
    v.id,
    v.created_at,
    p.name as produto_nome,
    p.price as produto_preco,
    u."user" as usuario_nome
FROM vendas v
JOIN produtos p ON v.produto_id = p.id
JOIN usuarios u ON v.usuario_id = u.id
ORDER BY v.created_at DESC;

-- View para produtos mais vendidos
CREATE OR REPLACE VIEW produtos_mais_vendidos AS
SELECT 
    p.id,
    p.name,
    COUNT(v.id) as total_vendas,
    SUM(p.price) as receita_total
FROM produtos p
LEFT JOIN vendas v ON p.id = v.produto_id
GROUP BY p.id, p.name
HAVING COUNT(v.id) > 0
ORDER BY total_vendas DESC;

-- =====================================
-- FUNCTIONS (PostgreSQL equivale a procedures)
-- =====================================

-- Function para registrar venda e atualizar estoque
CREATE OR REPLACE FUNCTION registrar_venda(
    p_produto_id INTEGER,
    p_usuario_id INTEGER
) RETURNS JSON AS $$
DECLARE
    produto_qtd INTEGER;
    produto_disponivel BOOLEAN;
    nova_venda_id INTEGER;
    result JSON;
BEGIN
    -- Verificar se o produto existe e está disponível
    SELECT qtd, available INTO produto_qtd, produto_disponivel 
    FROM produtos WHERE id = p_produto_id;
    
    -- Verificar se há estoque suficiente
    IF produto_qtd > 0 AND produto_disponivel = true THEN
        -- Registrar a venda
        INSERT INTO vendas (produto_id, usuario_id) 
        VALUES (p_produto_id, p_usuario_id)
        RETURNING id INTO nova_venda_id;
        
        -- Reduzir o estoque
        UPDATE produtos SET qtd = qtd - 1 WHERE id = p_produto_id;
        
        result := json_build_object(
            'success', true,
            'message', 'Venda registrada com sucesso!',
            'venda_id', nova_venda_id
        );
    ELSE
        result := json_build_object(
            'success', false,
            'error', 'Produto indisponível ou sem estoque!'
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function para adicionar estoque
CREATE OR REPLACE FUNCTION adicionar_estoque(
    p_produto_id INTEGER,
    p_quantidade INTEGER
) RETURNS JSON AS $$
DECLARE
    nova_qtd INTEGER;
    result JSON;
BEGIN
    UPDATE produtos 
    SET qtd = qtd + p_quantidade 
    WHERE id = p_produto_id
    RETURNING qtd INTO nova_qtd;
    
    result := json_build_object(
        'success', true,
        'message', 'Estoque atualizado. Nova quantidade: ' || nova_qtd,
        'nova_quantidade', nova_qtd
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function para obter estatísticas do dashboard
CREATE OR REPLACE FUNCTION obter_estatisticas() 
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_produtos', (SELECT COUNT(*) FROM produtos WHERE available = true),
        'vendas_hoje', (SELECT COUNT(*) FROM vendas WHERE DATE(created_at) = CURRENT_DATE),
        'receita_hoje', (SELECT COALESCE(SUM(p.price), 0) FROM vendas v JOIN produtos p ON v.produto_id = p.id WHERE DATE(v.created_at) = CURRENT_DATE),
        'produtos_criticos', (SELECT COUNT(*) FROM produtos WHERE qtd <= 5 AND available = true)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================

CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(name);
CREATE INDEX IF NOT EXISTS idx_produtos_disponivel ON produtos(available);
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(created_at);
CREATE INDEX IF NOT EXISTS idx_vendas_produto ON vendas(produto_id);
CREATE INDEX IF NOT EXISTS idx_vendas_usuario ON vendas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_user ON usuarios("user");

-- =====================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================

COMMENT ON TABLE produtos IS 'Tabela de produtos da cantina';
COMMENT ON COLUMN produtos.name IS 'Nome do produto';
COMMENT ON COLUMN produtos.qtd IS 'Quantidade em estoque';
COMMENT ON COLUMN produtos.price IS 'Preço unitário do produto';
COMMENT ON COLUMN produtos.available IS 'Indica se o produto está disponível para venda';

COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN usuarios."user" IS 'Nome de usuário único para login';
COMMENT ON COLUMN usuarios.password IS 'Senha hasheada do usuário';

COMMENT ON TABLE vendas IS 'Tabela de registro de vendas';
COMMENT ON COLUMN vendas.created_at IS 'Data e hora da venda';

-- =====================================
-- SETUP CONCLUÍDO
-- =====================================
-- Execute este arquivo no seu PostgreSQL para criar
-- toda a estrutura necessária para o sistema.
-- 
-- Credenciais padrão:
-- - Usuário: admin, Senha: 123456
-- - Usuário: cantina, Senha: 123456
-- - Usuário: funcionario, Senha: 123456
-- 
-- Para executar:
-- 1. Crie o banco: CREATE DATABASE cantina_crud;
-- 2. Conecte ao banco: \c cantina_crud
-- 3. Execute este script: \i setup.sql
-- =====================================

-- =====================================
-- INSERIR DADOS DE EXEMPLO
-- =====================================

-- Usuários padrão (senha: "123456" hasheada)
INSERT INTO usuarios (user, password) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('cantina', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('funcionario', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Produtos de exemplo
INSERT INTO produtos (name, qtd, price, available) VALUES
('Pão de Açúcar', 50, 3.00, true),
('Refrigerante Coca-Cola 350ml', 30, 5.00, true),
('Salgadinho Chips', 25, 3.00, true),
('Café Expresso', 100, 3.00, true),
('Sanduíche Natural', 15, 8.00, true),
('Água Mineral 500ml', 40, 2.50, true),
('Bolo de Chocolate', 10, 4.50, true),
('Suco de Laranja', 20, 4.00, true),
('Biscoito Recheado', 35, 2.00, true),
('Iogurte Natural', 25, 3.50, true);

-- Vendas de exemplo
INSERT INTO vendas (produto_id, usuario_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 1), (5, 2),
(6, 3), (7, 2), (8, 1), (1, 3), (2, 2);

-- =====================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================

-- View para produtos com baixo estoque
CREATE VIEW produtos_baixo_estoque AS
SELECT 
    id,
    name,
    qtd,
    price,
    CASE 
        WHEN qtd <= 5 THEN 'Crítico'
        WHEN qtd <= 10 THEN 'Baixo'
        ELSE 'Normal'
    END as status_estoque
FROM produtos 
WHERE qtd <= 10 AND available = true;

-- View para relatório de vendas
CREATE VIEW relatorio_vendas AS
SELECT 
    v.id,
    v.createdAt,
    p.name as produto_nome,
    p.price as produto_preco,
    u.user as usuario_nome
FROM vendas v
JOIN produtos p ON v.produto_id = p.id
JOIN usuarios u ON v.usuario_id = u.id
ORDER BY v.createdAt DESC;

-- =====================================
-- PROCEDURES ÚTEIS
-- =====================================

DELIMITER //

-- Procedure para registrar venda e atualizar estoque
CREATE PROCEDURE RegistrarVenda(
    IN p_produto_id INT,
    IN p_usuario_id INT
)
BEGIN
    DECLARE produto_qtd INT;
    DECLARE produto_disponivel BOOLEAN;
    
    -- Verificar se o produto existe e está disponível
    SELECT qtd, available INTO produto_qtd, produto_disponivel 
    FROM produtos WHERE id = p_produto_id;
    
    -- Verificar se há estoque suficiente
    IF produto_qtd > 0 AND produto_disponivel = true THEN
        -- Registrar a venda
        INSERT INTO vendas (produto_id, usuario_id) VALUES (p_produto_id, p_usuario_id);
        
        -- Reduzir o estoque
        UPDATE produtos SET qtd = qtd - 1 WHERE id = p_produto_id;
        
        SELECT 'Venda registrada com sucesso!' as message, 
               LAST_INSERT_ID() as venda_id;
    ELSE
        SELECT 'Produto indisponível ou sem estoque!' as error;
    END IF;
END //

-- Procedure para adicionar estoque
CREATE PROCEDURE AdicionarEstoque(
    IN p_produto_id INT,
    IN p_quantidade INT
)
BEGIN
    UPDATE produtos 
    SET qtd = qtd + p_quantidade 
    WHERE id = p_produto_id;
    
    SELECT CONCAT('Estoque atualizado. Nova quantidade: ', qtd) as message
    FROM produtos WHERE id = p_produto_id;
END //

-- Procedure para obter estatísticas do dashboard
CREATE PROCEDURE ObterEstatisticas()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM produtos WHERE available = true) as total_produtos,
        (SELECT COUNT(*) FROM vendas WHERE DATE(createdAt) = CURDATE()) as vendas_hoje,
        (SELECT SUM(p.price) FROM vendas v JOIN produtos p ON v.produto_id = p.id WHERE DATE(v.createdAt) = CURDATE()) as receita_hoje,
        (SELECT COUNT(*) FROM produtos WHERE qtd <= 5 AND available = true) as produtos_criticos;
END //

DELIMITER ;

-- =====================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================

CREATE INDEX idx_produtos_nome ON produtos(name);
CREATE INDEX idx_produtos_disponivel ON produtos(available);
CREATE INDEX idx_vendas_data ON vendas(createdAt);
CREATE INDEX idx_vendas_produto ON vendas(produto_id);
CREATE INDEX idx_vendas_usuario ON vendas(usuario_id);
CREATE INDEX idx_usuarios_user ON usuarios(user);

-- =====================================
-- CONFIGURAÇÕES FINAIS
-- =====================================

-- Definir charset para tabelas existentes
ALTER TABLE produtos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE usuarios CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE vendas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =====================================
-- SETUP CONCLUÍDO
-- =====================================
-- Execute este arquivo no seu MySQL para criar
-- toda a estrutura necessária para o sistema.
-- 
-- Credenciais padrão:
-- - Usuário: admin, Senha: 123456
-- - Usuário: cantina, Senha: 123456
-- - Usuário: funcionario, Senha: 123456
-- =====================================