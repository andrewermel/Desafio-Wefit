# Build stage - Compilar TypeScript
FROM node:18-alpine3.18 AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript com skipLibCheck para evitar erros de tipos
RUN npx tsc --skipLibCheck

# Production stage - Rodar aplicação
FROM node:18-alpine3.18

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar app compilado do builder
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)});"

# Iniciar aplicação
CMD ["node", "dist/index.js"]
