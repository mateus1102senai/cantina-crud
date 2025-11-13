# 🍽️ Sistema Cantina CRUD

Sistema completo de gerenciamento para cantina escolar desenvolvido com **Next.js**, **TypeScript**, **Tailwind CSS** e **Node.js**.

## 🚀 Funcionalidades

### ✅ Implementado
- **Autenticação** - Login seguro com validação
- **Dashboard** - Estatísticas e indicadores em tempo real
- **Gestão de Produtos** - CRUD completo de produtos
- **Controle de Estoque** - Monitoramento e alertas de estoque baixo
- **Interface Responsiva** - Design moderno e adaptativo
- **API REST** - Backend completo com Express.js

### 📋 Principais Recursos
- 📊 Dashboard com métricas importantes
- 🛒 Cadastro e gestão de produtos
- 📦 Controle de estoque com alertas
- 💰 Sistema de vendas
- 📱 Interface responsiva
- 🔐 Autenticação e autorização
- 🗄️ Banco de dados estruturado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Hooks** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação

### DevTools
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
cantina-crud/
├── src/
│   └── app/
│       ├── globals.css          # Estilos globais
│       ├── layout.tsx           # Layout principal
│       ├── page.tsx             # Página inicial
│       ├── login/
│       │   └── page.tsx         # Página de login
│       ├── dashboard/
│       │   └── page.tsx         # Dashboard principal
│       ├── cadastro-produto/
│       │   └── page.tsx         # Cadastro de produtos
│       └── gestao-estoque/
│           └── page.tsx         # Gestão de estoque
├── public/                      # Arquivos estáticos
├── docs/                        # Documentação
├── server.js                    # Servidor Express
├── setup.sql                    # Script do banco de dados
├── package.json                 # Dependências
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── next.config.js              # Configuração Next.js
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- MySQL (opcional - projeto roda com mock)

### 1. Clonar o Repositório
```bash
git clone https://github.com/mateus1102senai/cantina-crud.git
cd cantina-crud
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar o Projeto

#### Frontend (Next.js)
```bash
npm run dev
```
Acesse: http://localhost:3000

#### Backend (Express)
```bash
npm run server
```
API disponível em: http://localhost:3001

### 4. Login de Teste
- **Usuário:** admin
- **Senha:** admin

## 🗄️ Banco de Dados

### Configuração MySQL (Opcional)
1. Execute o arquivo `setup.sql` no seu MySQL
2. Configure as credenciais no arquivo `.env`
3. Atualize o `server.js` para usar o banco real

### Mock Data
O projeto roda por padrão com dados mock em memória, não requer banco de dados para testes.

## 📊 Páginas Disponíveis

| Página | Rota | Descrição |
|--------|------|-----------|
| Home | `/` | Página inicial com navegação |
| Login | `/login` | Autenticação de usuários |
| Dashboard | `/dashboard` | Painel principal com estatísticas |
| Cadastro Produto | `/cadastro-produto` | Formulário de cadastro |
| Gestão Estoque | `/gestao-estoque` | Listagem e controle de estoque |

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Vendas
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Registrar venda

### Dashboard
- `GET /api/dashboard` - Dados do dashboard

### Utilidades
- `GET /api/health` - Health check da API

## 🎨 Design System

### Cores Principais
```css
--cantina-primary: #2563eb    /* Azul principal */
--cantina-secondary: #64748b  /* Cinza secundário */
--cantina-accent: #f59e0b     /* Amarelo destaque */
--cantina-success: #10b981    /* Verde sucesso */
--cantina-warning: #f59e0b    /* Amarelo aviso */
--cantina-error: #ef4444      /* Vermelho erro */
```

### Componentes
- Cards responsivos
- Botões com estados
- Tabelas estilizadas
- Formulários validados
- Indicadores de status

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Inicia frontend em modo desenvolvimento
npm run build      # Build de produção do frontend
npm run start      # Inicia frontend em produção
npm run server     # Inicia servidor backend
npm run lint       # Executa linting do código
```

## 📈 Funcionalidades do Sistema

### Dashboard
- Total de produtos cadastrados
- Vendas do dia
- Produtos com estoque baixo
- Últimas vendas realizadas
- Cards de acesso rápido

### Gestão de Produtos
- Cadastro com validação
- Categorização automática
- Controle de preço e custo
- Preview em tempo real
- Upload de imagens (preparado)

### Controle de Estoque
- Visualização em tempo real
- Alertas de estoque baixo/crítico
- Filtros por status e categoria
- Atualização inline
- Indicadores visuais

### Sistema de Vendas
- Registro de vendas
- Atualização automática de estoque
- Histórico completo
- Múltiplas formas de pagamento (preparado)

## 🔒 Segurança

- Autenticação baseada em tokens
- Validação de entrada de dados
- Sanitização de inputs
- Headers de segurança (preparado)
- Rate limiting (preparado)

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Componentes adaptativos
- Touch-friendly interface
- PWA ready (preparado)

## 🚀 Deploy

### Vercel (Recomendado para Frontend)
```bash
npm install -g vercel
vercel
```

### Heroku (Backend)
```bash
git push heroku main
```

### Docker (Opcional)
```dockerfile
# Dockerfile incluído no projeto
docker build -t cantina-crud .
docker run -p 3000:3000 cantina-crud
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Mateus Senai**
- GitHub: [@mateus1102senai](https://github.com/mateus1102senai)
- LinkedIn: [Mateus Senai](https://linkedin.com/in/mateussenai)

## 🙏 Agradecimentos

- SENAI pela oportunidade de aprendizado
- Comunidade Next.js e React
- Contribuidores open source

---

⭐ Se este projeto foi útil, considere deixar uma estrela no repositório!

🍽️ **Sistema Cantina CRUD** - Simplificando a gestão da sua cantina escolar!