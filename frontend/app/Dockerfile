# Dockerfile para Frontend Angular
# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npx ng build --configuration production

# Stage 2: Serve com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist/app/browser /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]

