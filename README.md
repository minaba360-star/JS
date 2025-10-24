# Frontend – Plateforme de candidatures (React + Vite + TS)

## Prérequis
- Node.js 18+

## Installation
```bash
npm install
```

## Lancer le frontend
```bash
npm run dev
```
Front accessible ensuite sur `http://localhost:5173`.

## API locale (JSON Server + Express)
L’application consomme des endpoints locaux:
- `GET http://localhost:3000/candidats`
- `PATCH http://localhost:3000/candidats/:id`

Assurez-vous que votre serveur JSON/Express est lancé sur le port 3000. Exemple avec json-server:
```bash
npx json-server --watch db.json --port 3000
```

## Authentification
- Connexion admin: emails autorisés dans `Login.tsx` et mot de passe `admin123`
- Connexion candidat: via les entrées `candidats` de `db.json`
- La session est stockée dans `localStorage` sous la clé `user`.

## Build
```bash
npm run build && npm run preview
```

## Lint
```bash
npm run lint
```
