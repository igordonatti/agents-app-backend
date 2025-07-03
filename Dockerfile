# Dockerfile

# ---- Estágio 1: Build ----
# Usamos uma imagem Node.js completa para instalar dependências e construir o projeto.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de gerenciamento de pacotes
COPY package*.json ./

# Instala as dependências de produção
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Constrói a aplicação para produção
RUN npm run build

# ---- Estágio 2: Produção ----
# Usamos uma imagem Node.js mais leve para a execução.
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia as dependências de produção do estágio de build
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia os artefatos da construção (a pasta 'dist')
COPY --from=builder /usr/src/app/dist ./dist

# Copia o schema do Prisma para poder rodar migrações em produção
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

# Expõe a porta que sua aplicação NestJS usa (padrão é 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]