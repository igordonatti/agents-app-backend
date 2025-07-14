# 📚 Exemplos de Uso da API - Config Chatbot

Este documento contém exemplos práticos de como usar a API do Config Chatbot.

## 🔗 Base URL
```
http://localhost:3000
```

## 📋 Swagger/OpenAPI
```
http://localhost:3000/api
```

---

## 🔐 Autenticação

### 1. Criar Usuário

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "id": "user_clr1234567890",
  "email": "joao@exemplo.com",
  "name": "João Silva",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": "User created successfully"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "id": "user_clr1234567890",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "created_at": "2024-01-15T10:30:00.000Z",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Validar Token

```bash
curl -X POST http://localhost:3000/validate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## 🏢 Gerenciamento de Tenants

**⚠️ Todas as requisições abaixo precisam do token de autenticação:**

```bash
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 1. Criar Tenant

```bash
curl -X POST http://localhost:3000/tenants \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa ABC Ltda"
  }'
```

### 2. Listar Tenants

```bash
curl -X GET http://localhost:3000/tenants \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Buscar Tenant por ID

```bash
curl -X GET http://localhost:3000/tenants/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Atualizar Nome do Tenant

```bash
curl -X PATCH http://localhost:3000/tenants/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "Novo Nome da Empresa"
```

### 5. Deletar Tenant

```bash
curl -X DELETE http://localhost:3000/tenants/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🤖 Gerenciamento de Agentes

### 1. Criar Agente

```bash
curl -X POST http://localhost:3000/agents \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agente de Suporte Técnico",
    "id_folder": "folder_support_tech_001",
    "id_tenant": 1,
    "prompt": "Você é um assistente especializado em suporte técnico. Seja educado, preciso e sempre tente resolver o problema do usuário.",
    "ice_breakers": [
      "Olá! Como posso ajudá-lo hoje?",
      "Está enfrentando algum problema técnico?"
    ]
  }'
```

### 2. Listar Todos os Agentes

```bash
curl -X GET http://localhost:3000/agents \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Buscar Agente por ID

```bash
curl -X GET http://localhost:3000/agents/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Listar Agentes por Tenant

```bash
curl -X GET http://localhost:3000/agents/tenant/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Atualizar Prompt do Agente

```bash
curl -X PATCH http://localhost:3000/agents/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "Você é um assistente especializado em vendas. Seja persuasivo mas não agressivo."
```

### 6. Atualizar Nome do Agente

```bash
curl -X PATCH http://localhost:3000/agents/update-name/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "Agente de Vendas"
```

### 7. Deletar Agente

```bash
curl -X DELETE http://localhost:3000/agents/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🧊 Gerenciamento de Quebra-gelos

### 1. Criar Quebra-gelo

```bash
curl -X POST http://localhost:3000/agents/ice-breaker \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Precisa de ajuda com alguma coisa específica?",
    "id_agent": 1
  }'
```

### 2. Atualizar Quebra-gelo

```bash
curl -X PATCH http://localhost:3000/agents/ice-breaker/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Olá! Posso te ajudar com alguma coisa hoje?",
    "index": 0
  }'
```

### 3. Deletar Quebra-gelo

```bash
curl -X DELETE http://localhost:3000/agents/ice-breaker/1/0 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📚 Base de Conhecimento

### 1. Atualizar Base de Conhecimento

```bash
curl -X POST http://localhost:3000/knowledge-base \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "folder_knowledge_base_001"
```

---

## 🧪 Exemplos com JavaScript/TypeScript

### Setup Básico

```typescript
const API_BASE_URL = 'http://localhost:3000';
let authToken = '';

// Função helper para requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` })
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

### Fluxo Completo de Uso

```typescript
async function exemploCompletoDeUso() {
  try {
    // 1. Criar usuário
    const usuario = await apiRequest('/user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maria Santos',
        email: 'maria@empresa.com',
        password: 'senha123'
      })
    });
    console.log('Usuário criado:', usuario);

    // 2. Fazer login
    const loginResponse = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'maria@empresa.com',
        password: 'senha123'
      })
    });
    
    // Armazenar token para próximas requisições
    authToken = loginResponse.access_token;
    console.log('Login realizado com sucesso');

    // 3. Criar tenant
    const tenant = await apiRequest('/tenants', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Empresa XYZ Ltda'
      })
    });
    console.log('Tenant criado:', tenant);

    // 4. Criar agente
    const agente = await apiRequest('/agents', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Assistente Virtual',
        id_folder: 'folder_assistant_001',
        id_tenant: tenant.id || 1, // Usar ID real do tenant criado
        prompt: 'Você é um assistente virtual amigável e prestativo.',
        ice_breakers: [
          'Olá! Em que posso ajudá-lo?',
          'Bem-vindo! Como posso te auxiliar hoje?'
        ]
      })
    });
    console.log('Agente criado:', agente);

    // 5. Adicionar quebra-gelo
    const quebragelo = await apiRequest('/agents/ice-breaker', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Tem alguma dúvida específica?',
        id_agent: agente.id || 1 // Usar ID real do agente criado
      })
    });
    console.log('Quebra-gelo adicionado:', quebragelo);

    // 6. Listar agentes do tenant
    const agentesDoTenant = await apiRequest(`/agents/tenant/${tenant.id || 1}`);
    console.log('Agentes do tenant:', agentesDoTenant);

  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar exemplo
exemploCompletoDeUso();
```

---

## 🐍 Exemplos com Python

### Setup Básico

```python
import requests
import json

API_BASE_URL = 'http://localhost:3000'
auth_token = ''

def api_request(endpoint, method='GET', data=None):
    url = f"{API_BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    
    if auth_token:
        headers['Authorization'] = f'Bearer {auth_token}'
    
    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif method == 'PATCH':
        response = requests.patch(url, headers=headers, json=data)
    elif method == 'DELETE':
        response = requests.delete(url, headers=headers)
    
    response.raise_for_status()
    return response.json()
```

### Exemplo de Uso

```python
def exemplo_uso_python():
    global auth_token
    
    try:
        # 1. Criar usuário
        usuario = api_request('/user', 'POST', {
            'name': 'Pedro Oliveira',
            'email': 'pedro@empresa.com',
            'password': 'senha123'
        })
        print('Usuário criado:', usuario)
        
        # 2. Login
        login_response = api_request('/login', 'POST', {
            'email': 'pedro@empresa.com',
            'password': 'senha123'
        })
        auth_token = login_response['access_token']
        print('Login realizado com sucesso')
        
        # 3. Criar tenant
        tenant = api_request('/tenants', 'POST', {
            'name': 'Startup Inovadora'
        })
        print('Tenant criado:', tenant)
        
        # 4. Listar todos os tenants
        tenants = api_request('/tenants')
        print('Tenants disponíveis:', tenants)
        
    except requests.exceptions.RequestException as e:
        print(f'Erro na requisição: {e}')

# Executar exemplo
exemplo_uso_python()
```

---

## 🚨 Tratamento de Erros

### Códigos de Status Comuns

| Código | Significado | Ação |
|--------|-------------|------|
| `200` | Sucesso | Requisição processada com sucesso |
| `201` | Criado | Recurso criado com sucesso |
| `400` | Bad Request | Verificar dados enviados |
| `401` | Unauthorized | Token inválido ou ausente |
| `404` | Not Found | Recurso não encontrado |
| `500` | Server Error | Erro interno do servidor |

### Exemplos de Respostas de Erro

```json
// 400 - Bad Request
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be an email"
  ],
  "error": "Bad Request"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 404 - Not Found
{
  "statusCode": 404,
  "message": "Agente não encontrado"
}
```

---

## 🔍 Dicas de Depuração

### 1. Verificar Status da API

```bash
curl -X GET http://localhost:3000 \
  -H "Content-Type: application/json"
```

### 2. Verificar Token JWT

Use o site [jwt.io](https://jwt.io) para decodificar e verificar tokens JWT.

### 3. Logs da Aplicação

Verifique os logs da aplicação para detalhes de erros:

```bash
npm run start:dev
# Os logs aparecerão no terminal
```

### 4. Swagger para Testes

Use a interface Swagger em `http://localhost:3000/api` para testar endpoints interativamente.

---

## 📝 Coleção do Postman

Para facilitar os testes, você pode importar esta coleção no Postman:

```json
{
  "info": {
    "name": "Config Chatbot API",
    "description": "Coleção completa da API do Config Chatbot"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "authToken",
      "value": ""
    }
  ]
}
```

**Como usar:**
1. Importe a coleção no Postman
2. Execute o endpoint de login
3. Copie o `access_token` para a variável `authToken`
4. Use nos demais endpoints

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se a aplicação está rodando: `npm run start:dev`
2. Confirme se o banco de dados está configurado corretamente
3. Verifique os logs para erros específicos
4. Consulte a documentação Swagger em `/api`

**Contato:** igordonatti.id@gmail.com 