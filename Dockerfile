# Imagem base oficial do Bun
FROM oven/bun:1.1.13

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos
COPY . .

# Instala as dependências
RUN bun install

# Gera o client do Prisma
RUN bunx prisma generate

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["bun", "run", "dev"]
