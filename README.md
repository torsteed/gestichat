# Gestichat - Application de suivi des repas de chats

## 📋 Description

**Gestichat** est une application web complète permettant à plusieurs utilisateurs (famille/colocataires) d'enregistrer les repas donnés à leurs chats. L'application évite les doublons de nourriture et gère automatiquement le stock de sachets (le "Gestiroir").

## 🏗️ Architecture

- **Frontend** : Angular 18 + TypeScript + Bootstrap 5 + Font Awesome
- **Backend** : Node.js + Express + Sequelize ORM
- **Base de données** : MySQL
- **Structure** : Monorepo avec `/frontend` et `/backend` séparés

## 🚀 Installation et lancement

### Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- MySQL (v8 ou supérieur)
- Angular CLI (v18 ou supérieur)

### 1. Cloner et configurer

```bash
# Cloner le dépôt (si applicable)
git clone <votre-repo>
cd gestichat

# Installer les dépendances
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configurer la base de données

#### Créer la base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE gestichat;

# Exécuter le script d'initialisation
mysql -u root -p gestichat < ../database/init.sql
```

Ou utiliser le fichier SQL fourni :

```bash
mysql -u <votre_utilisateur> -p gestichat < database/init.sql
```

#### Configurer l'accès à la base de données

Créer un fichier `.env` dans le dossier `/backend` :

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gestichat

# Server Configuration
PORT=3000

# Stock Alert Threshold
STOCK_THRESHOLD=10
```

### 3. Démarrer les serveurs

#### Backend (dans un terminal)

```bash
cd backend
npm run dev  # ou npm start pour la production
```

Le serveur backend sera disponible sur `http://localhost:3000`

#### Frontend (dans un autre terminal)

```bash
cd frontend
ng serve
```

L'application frontend sera disponible sur `http://localhost:4200`

## 📁 Structure du projet

```
gestichat/
├── backend/
│   ├── server.js          # Point d'entrée Express
│   ├── package.json
│   ├── .env.example
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/      # Dashboard principal
│   │   │   │   ├── cat-list/       # Liste des chats
│   │   │   │   ├── cat-detail/     # Détails d'un chat
│   │   │   │   ├── user-list/      # Liste des utilisateurs
│   │   │   │   ├── meal-list/      # Liste des repas
│   │   │   │   ├── stock/          # Gestion du stock
│   │   │   │   └── api-doc/        # Documentation API
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts  # Service API
│   │   │   │   └── user.service.ts # Gestion des utilisateurs
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── cat.model.ts
│   │   │   │   ├── meal.model.ts
│   │   │   │   └── stock.model.ts
│   │   │   ├── guards/
│   │   │   │   └── user-selected.guard.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.module.ts
│   │   ├── styles.scss
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── environments/
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
├── database/
│   └── init.sql           # Script SQL + données de test
└── README.md
```

## 🌐 Endpoints API

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `POST /api/users` - Crée un nouvel utilisateur

### Chats
- `GET /api/cats` - Liste tous les chats
- `POST /api/cats` - Crée un nouveau chat
- `PUT /api/cats/:id` - Met à jour un chat

### Repas
- `GET /api/meals` - Liste les repas (avec filtres optionnels)
- `POST /api/meals` - Crée un nouveau repas
- `DELETE /api/meals/:id` - Supprime un repas
- `GET /api/cats/:id/meals` - Liste les repas d'un chat

### Stock (Gestiroir)
- `GET /api/stock/current` - Stock actuel calculé
- `GET /api/stock/history` - Historique des réapprovisionnements
- `POST /api/stock` - Ajoute un réapprovisionnement

### Dashboard
- `GET /api/dashboard/latest-meals-by-cat` - Derniers repas par chat
- `GET /api/dashboard/recent-meals` - Repas récents

## ✨ Fonctionnalités

### 🎯 Dashboard
- Affichage du stock actuel avec alerte visuelle (rouge si < 10, vert sinon)
- Liste des derniers repas par chat avec mise en évidence des repas récents (< 6h)
- Bouton "+" pour ajouter rapidement un repas
- Historique complet des repas avec pagination

### 🐱 Gestion des chats
- CRUD complet (Créer, Lire, Mettre à jour, Désactiver)
- Vue détaillée par chat avec historique des repas
- Statut actif/inactif

### 👥 Gestion des utilisateurs
- CRUD des utilisateurs
- Sélection d'utilisateur persistante (localStorage)
- Toutes les actions d'écriture nécessitent un utilisateur sélectionné

### 🍽️ Gestion des repas
- Formulaire d'ajout manuel avec choix du chat, utilisateur, date/heure, nombre de sachets
- Filtres par chat, utilisateur, date
- Suppression des repas

### 📦 Gestion du stock (Gestiroir)
- Affichage du stock actuel (calcul automatique)
- Ajout de réapprovisionnements
- Historique des ajouts de stock
- Seuil d'alerte configurable

### 📚 Documentation API
- Page complète avec tous les endpoints
- Exemples d'utilisation
- Documentation des modèles de données

## 🎨 Design / UX

- **Bandeau bleu** en haut avec logo "Gestichat"
- **Menu horizontal** : Accueil, Repas ▾, Chats, Humains, Stock, API
- **Sélecteur d'utilisateur** en haut à droite
- **Tables sobres** avec en-têtes en gras
- **Lignes alternées** ou surlignage conditionnel (jaune pâle pour repas récents)
- **Boutons ronds bleus** "+" pour actions rapides
- **Boutons rouges** avec icône poubelle pour suppression
- **Interface en français** avec dates au format long français
- **Responsive** (utilisable sur mobile)

## 📊 Modèle de données

### Table `users`
- `id` (PK, auto-increment)
- `name` (varchar, unique)

### Table `cats`
- `id` (PK, auto-increment)
- `name` (varchar, unique)
- `active` (boolean, default true)

### Table `meals`
- `id` (PK, auto-increment)
- `cat_id` (FK -> cats)
- `user_id` (FK -> users)
- `fed_at` (datetime)
- `sachets_used` (int, default 1)
- `created_at` (datetime, auto)

### Table `stock`
- `id` (PK, auto-increment)
- `sachets_added` (int)
- `added_at` (datetime)
- `user_id` (FK -> users)
- `note` (varchar, nullable)

**Stock actuel = SOMME(stock.sachets_added) - SOMME(meals.sachets_used)**

## 🛡️ Sécurité et bonnes pratiques

- **Gestion des fuseaux horaires** : Dates stockées en UTC, affichées en heure locale française
- **Validation des formulaires** côté front et back
- **Gestion des erreurs API** : Messages utilisateur clairs
- **Pas d'authentification** : Sélection d'utilisateur via localStorage

## 🐛 Résolution des problèmes

### Le backend ne démarre pas

1. Vérifiez que MySQL est en cours d'exécution
2. Vérifiez les informations d'identification dans `.env`
3. Vérifiez que la base de données existe

```bash
# Tester la connexion MySQL
mysql -u <votre_utilisateur> -p -e "USE gestichat;"
```

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est en cours d'exécution (`http://localhost:3000`)
2. Vérifiez l'URL de l'API dans `frontend/src/environments/environment.ts`
3. Vérifiez les erreurs dans la console du navigateur

### Problèmes CORS

Si vous obtenez des erreurs CORS, assurez-vous que le middleware CORS est activé dans le backend :

```javascript
// Dans server.js
app.use(cors());
```

## 📝 Données de test

Le script `database/init.sql` inclut des données de test :

- **Utilisateurs** : Alice, Bob, Charlie, Diana
- **Chats** : Whiskers, Mittens, Shadow, Luna (inactif), Simba
- **Repas** : Plusieurs repas récents et historiques
- **Stock** : Réapprovisionnements initiaux

## 🔄 Migrations et seeds

Pour l'instant, le projet utilise Sequelize avec `sync: { alter: true }` qui crée automatiquement les tables.

Pour une production, il est recommandé d'utiliser des migrations :

```bash
# Installer Sequelize CLI
npm install -g sequelize-cli

# Initialiser les migrations
cd backend
npx sequelize-cli init

# Créer une migration
npx sequelize-cli migration:generate --name create-users-table

# Exécuter les migrations
npx sequelize-cli db:migrate
```

## 🎯 Améliorations possibles

- [ ] Ajouter l'authentification JWT
- [ ] Implémenter les migrations Sequelize
- [ ] Ajouter des tests unitaires
- [ ] Implémenter la pagination côté serveur
- [ ] Ajouter des graphiques statistiques
- [ ] Implémenter les notifications en temps réel
- [ ] Ajouter la recherche en temps réel
- [ ] Implémenter l'export des données

## 📄 Licence

MIT License

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une pull request avec vos améliorations.

---

**Gestichat** - Parce que chaque chat mérite d'être nourri au bon moment ! 🐾
