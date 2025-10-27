# Étape 1 : Build de l'application
# Utiliser node:lts-alpine (plus stable et plus petit pour le build que node:18)
FROM node:lts-alpine AS build

# Définition du répertoire de travail
WORKDIR /app

# Copie et installation des dépendances
# Utilisez le stage de build pour la première fois pour télécharger les dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources et construction
COPY . .

# Exécution de la commande de build
# CORRECTION : On utilise 'npx' pour exécuter 'vite build' qui est nécessaire pour 
# que le shell trouve l'exécutable local 'vite'.
RUN CI=false npx vite build

# Étape 2 : Serveur Nginx
# Utiliser une image Nginx plus légère
FROM nginx:alpine

# Copie des fichiers statiques
# Le chemin /app/dist est utilisé car 'vite build' est censé y créer les fichiers.
COPY --from=build /app/dist /usr/share/nginx/html

# Port exposé et commande de lancement
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
