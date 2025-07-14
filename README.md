<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Config Chatbot API</h1>

<p align="center">
  🤖 Sistema completo para configuração e gerenciamento de chatbots inteligentes com arquitetura multi-tenant
</p>

<p align="center">
  <a href="#-descrição">Descrição</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-documentação-da-api">API</a> •
  <a href="#-uso">Uso</a>
</p>

---

## 📌 Descrição

O **Config Chatbot API** é uma solução backend robusta desenvolvida com [NestJS](https://nestjs.com/) para criação e gerenciamento de chatbots configuráveis. O sistema utiliza uma arquitetura multi-tenant que permite múltiplas organizações gerenciarem seus próprios agentes de conversação de forma independente.

### 🎯 Objetivo

Fornecer uma plataforma completa para:
- Criação e configuração de agentes de chatbot personalizados
- Gerenciamento de bases de conhecimento
- Sistema de autenticação seguro
- Integração com workflows de automação via N8N
- Configuração de quebra-gelos e prompts personalizados

---

## 🚀 Funcionalidades

### 🔐 **Sistema de Autenticação**
- ✅ Autenticação JWT com refresh tokens
- ✅ Middleware de validação
- ✅ Guards de proteção de rotas
- ✅ Decorators para rotas públicas

### 👥 **Gerenciamento de Usuários**
- ✅ Criação e validação de usuários
- ✅ Criptografia segura de senhas (bcrypt)
- ✅ Busca por email
- ✅ Validação de dados com class-validator

### 🏢 **Sistema Multi-Tenant**
- ✅ Isolamento completo de dados por tenant
- ✅ CRUD completo de tenants
- ✅ Associação automática de recursos

### 🤖 **Gerenciamento de Agentes**
- ✅ Criação de agentes personalizados
- ✅ Configuração de prompts específicos
- ✅ Sistema de quebra-gelos (até 4 por agente)
- ✅ Operações CRUD completas
- ✅ Filtragem por tenant

### 📚 **Base de Conhecimento**
- ✅ Upload e processamento de documentos
- ✅ Integração com sistemas de storage
- ✅ Atualização automática via workflows

### 🔄 **Integração N8N**
- ✅ Workflows automatizados
- ✅ Processamento de dados
- ✅ Sincronização com sistemas externos

### 🛠️ **Utilitários**
- ✅ Conversão automática de BigInt para JSON
- ✅ Validação global de dados
- ✅ Tratamento de erros padronizado

---

## ⚙️ Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Framework** | NestJS, Express |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Autenticação** | JWT, Passport.js, bcrypt |
| **Validação** | class-validator, class-transformer |
| **Documentação** | Swagger/OpenAPI |
| **Automação** | N8N Integration |
| **Arquitetura** | Multi-tenant, Microservices-ready |

---

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/config-chatbot-backend.git
cd config-chatbot-backend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/config_chatbot"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/config_chatbot"

# JWT
JWT_SECRET="sua_chave_secreta_super_segura"

# Server
PORT=3000

# N8N (opcional)
N8N_BASE_URL="http://localhost:5678"
N8N_API_KEY="sua_api_key_n8n"
```

### 4. Execute as migrações do banco

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Inicie a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

---

## 📚 Documentação da API

### 🎯 Swagger/OpenAPI

A documentação interativa da API está disponível em:

```
http://localhost:3000/api
```

### 📋 Principais Endpoints

#### **Autenticação**
```http
POST /login              # Login de usuário
POST /validate           # Validação de token JWT
```

#### **Usuários**
```http
GET  /user/findByEmail   # Buscar usuário por email
POST /user               # Criar novo usuário
```

#### **Tenants**
```http
GET    /tenants          # Listar todos os tenants
GET    /tenants/:id      # Buscar tenant por ID
POST   /tenants          # Criar novo tenant
PATCH  /tenants/:id      # Atualizar nome do tenant
DELETE /tenants/:id      # Deletar tenant
```

#### **Agentes**
```http
GET    /agents                    # Listar todos os agentes
GET    /agents/:id                # Buscar agente por ID
GET    /agents/tenant/:id_tenant  # Listar agentes por tenant
POST   /agents                    # Criar novo agente
PATCH  /agents/:id                # Atualizar prompt do agente
PATCH  /agents/update-name/:id    # Atualizar nome do agente
DELETE /agents/:id                # Deletar agente

# Quebra-gelos
POST   /agents/ice-breaker              # Criar quebra-gelo
PATCH  /agents/ice-breaker/:id          # Atualizar quebra-gelo
DELETE /agents/ice-breaker/:id/:index   # Deletar quebra-gelo
```

#### **Base de Conhecimento**
```http
POST /knowledge-base     # Atualizar base de conhecimento
```

### 🔒 Autenticação

A API usa autenticação JWT. Para acessar endpoints protegidos:

1. Faça login no endpoint `/login`
2. Use o token retornado no header `Authorization: Bearer <token>`

---

## 🧪 Uso

### Exemplo de Criação de Agente

```typescript
// 1. Criar um tenant
const tenant = await fetch('http://localhost:3000/tenants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu_token_aqui'
  },
  body: JSON.stringify({
    name: "Minha Empresa Ltda"
  })
});

// 2. Criar um agente
const agent = await fetch('http://localhost:3000/agents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu_token_aqui'
  },
  body: JSON.stringify({
    name: "Agente de Suporte",
    id_folder: "folder_unique_id",
    id_tenant: 1,
    prompt: "Você é um assistente especializado em suporte técnico...",
    ice_breakers: [
      "Olá! Como posso ajudá-lo hoje?",
      "Precisa de suporte técnico?"
    ]
  })
});

// 3. Adicionar quebra-gelo
const iceBreaker = await fetch('http://localhost:3000/agents/ice-breaker', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu_token_aqui'
  },
  body: JSON.stringify({
    text: "Tem alguma dúvida específica?",
    id_agent: 1
  })
});
```

---

## 📁 Estrutura do Projeto

```
src/
├── agents/              # Módulo de agentes de chatbot
│   ├── dto/             # Data Transfer Objects
│   ├── agents.controller.ts
│   ├── agents.service.ts
│   └── agents.module.ts
├── auth/                # Sistema de autenticação
│   ├── decorators/      # Decorators customizados
│   ├── guards/          # Guards de proteção
│   ├── strategies/      # Estratégias Passport
│   ├── middlewares/     # Middlewares de validação
│   └── models/          # Interfaces e tipos
├── databases/           # Configuração do banco
├── knowledge-base/      # Base de conhecimento
├── n8n/                # Integração N8N
├── tenants/            # Sistema multi-tenant
├── user/               # Gerenciamento de usuários
├── utils/              # Utilitários compartilhados
└── main.ts             # Ponto de entrada
```

---

## 🧬 Arquitetura

### Diagrama de Relacionamentos

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        datetime created_at
    }
    
    tenants {
        bigint id PK
        string name
        datetime created_at
        string id_original
    }
    
    folders {
        bigint id PK
        string id_folder UK
        bigint id_tenant FK
        datetime created_at
        string prompt
        string[] ice_breakers
        string name
    }
    
    documents_info {
        bigint id PK
        string id_original
        datetime created_at
        bigint folder_id FK
        string file_name
    }
    
    tenants ||--o{ folders : "tem"
    folders ||--o{ documents_info : "contém"
```

### Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as Auth Controller
    participant S as Auth Service
    participant DB as Database
    
    C->>A: POST /login (email, password)
    A->>S: validateUser(email, password)
    S->>DB: findUser(email)
    DB-->>S: userData
    S->>S: comparePassword()
    S-->>A: userValidated
    A->>S: login(user)
    S->>S: generateJWT()
    S-->>A: tokenData
    A-->>C: { access_token, user }
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia em modo desenvolvimento
npm run start:debug      # Inicia em modo debug

# Produção
npm run build           # Compila o projeto
npm run start:prod      # Inicia em modo produção

# Testes
npm run test            # Executa testes unitários
npm run test:e2e        # Executa testes end-to-end
npm run test:cov        # Executa testes com coverage

# Utilitários
npm run format          # Formata código com Prettier
npm run lint            # Executa ESLint
npm run migrate:deploy  # Deploy de migrações Prisma
```

---

## 🚢 Deploy

### Docker

```dockerfile
# Dockerfile incluído no projeto
docker build -t config-chatbot-api .
docker run -p 3000:3000 config-chatbot-api
```

### Variáveis de Ambiente de Produção

```env
DATABASE_URL="postgresql://user:pass@prod-host:5432/db"
JWT_SECRET="chave_super_secreta_producao"
NODE_ENV="production"
PORT=3000
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Contato e Suporte

- **Autor**: Igor Donatti
- **Email**: igordonatti.id@gmail.com
- **GitHub**: [@igordonatti](https://github.com/igordonatti)
- **Documentação da API**: `http://localhost:3000/api`

---

## 🔗 Links Úteis

- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação Prisma](https://www.prisma.io/docs/)
- [Documentação JWT](https://jwt.io/)
- [Documentação N8N](https://docs.n8n.io/)

---

<p align="center">
  Desenvolvido com ❤️ usando NestJS
</p>

