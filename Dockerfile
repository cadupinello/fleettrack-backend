FROM node:18-alpine

WORKDIR /app

# Instala dependências de build
RUN apk add --no-cache python3 make g++ openssl

# Configuração para módulos ES
RUN npm install -g tsx

# Copia arquivos de configuração
COPY package*.json ./
#COPY prisma ./prisma/

# Instala dependências
RUN npm install

# Copia o resto da aplicação
COPY . .

# Gera o cliente Prisma
# RUN npm run db:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]