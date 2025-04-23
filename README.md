<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Auth Module - NestJS</h1>

<p align="center">
  🔐 Módulo de autenticação plug-and-play com <strong>NestJS</strong> e <strong>Prisma ORM</strong>.
</p>

---

## 📌 Descrição

Este é um módulo de autenticação plug-and-play desenvolvido com o framework [NestJS](https://nestjs.com/) e utilizando o [Prisma ORM](https://www.prisma.io/).  
O objetivo deste projeto é fornecer uma solução simples e reutilizável para autenticação em aplicações NestJS.  
Ele pode ser facilmente integrado a outros projetos, permitindo autenticação de usuários com suporte a banco de dados.

---

## 🚀 Recursos

- ✅ **NestJS Framework**: Estrutura modular e escalável para desenvolvimento backend.
- ✅ **Prisma ORM**: ORM moderno com suporte a migrações e consultas eficientes.
- ✅ **JWT Authentication**: Autenticação baseada em tokens JWT.
- ✅ **Plug-and-Play**: Integração simples em outros projetos NestJS.
- ✅ **Código Modular**: Estrutura organizada e de fácil manutenção.

---

## ⚙️ Pré-requisitos

Certifique-se de ter os seguintes itens instalados no seu ambiente:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Banco de dados compatível com Prisma (MySQL, PostgreSQL, SQLite, etc.)

---

## 📦 Instalação

### 1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/auth-module-nestjs.git
cd auth-module-nestjs
```

### 2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

### 3. Configure o arquivo .env com as variáveis do seu banco de dados.
Crie um arquivo .env na raiz do projeto, copie e preencha as informações presentes no arquivo example.env

### 4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

## 🧪 Uso

### Desenvolvimento
Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

A aplicação estará disponível em: http://localhost:3000

### Produção
Para compilar e executar o projeto em produção:

```bash
npm run build
npm run start:prod
```

## 📁 Estrutura do Projeto
```bash
src/
│
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── main.ts
├── app.module.ts
```

### 🔌 Integração com Outros Projetos

Para integrar este módulo em outro projeto NestJS:

1. Copie o diretório auth/ para o seu projeto.

1. Importe o AuthModule no AppModule do seu projeto:
```ts
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```
3. Configure as variáveis de ambiente no .env do seu projeto.

### 🤝 Contribuição
Contribuições são bem-vindas!
Sinta-se à vontade para abrir issues ou enviar pull requests.

### 📄 Licença
Este projeto está licenciado sob a MIT License.

### 📚 Recursos Adicionais
- Documentação NestJS

- Documentação Prisma

- JWT.io – Ferramenta para decodificar e validar tokens JWT

### 📬 Contato
- Autor: Igor Donatti
- Email: igordonatti.id@gmail.com
- GitHub: https://github.com/igordonatti

