# Étape 1 : Construire le projet React
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Construire le projet pour la production
RUN npm run build


# Étape 2 : Servir les fichiers via NGINX
FROM nginx:alpine

# Copier les fichiers du build React dans le dossier de NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]
