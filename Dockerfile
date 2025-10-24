# Étape 1 : Build de l'application
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx pour servir le build
FROM nginx:alpine

# Copier le build dans le dossier par défaut de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]

