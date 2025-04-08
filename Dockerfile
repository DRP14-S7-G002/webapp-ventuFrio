# Usa uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta usada pelo Next.js
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
