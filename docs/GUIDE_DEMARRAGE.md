# Guide de Démarrage - ChabakaPro

## 🚀 Démarrage Rapide avec Docker

### 1. Configuration Initiale

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement
nano .env  # ou utilisez votre éditeur préféré
```

**Variables importantes à configurer dans `.env`:**
- `EMAIL_USER`: Votre adresse email Gmail
- `EMAIL_PASS`: Mot de passe d'application Gmail
- `REACT_APP_WHATSAPP_NUMBER`: Votre numéro WhatsApp
- `REACT_APP_PHONE_NUMBER`: Votre numéro de téléphone
- `REACT_APP_EMAIL`: Votre email de contact
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Votre ID Google Analytics

### 2. Démarrage avec le Script

```bash
# Rendre le script exécutable
chmod +x start.sh

# Lancer l'application
./start.sh
```

### 3. Démarrage Manuel

```bash
# Construction des conteneurs
docker-compose build

# Démarrage des services
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## 📍 Accès aux Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 🔧 Commandes Utiles

### Gestion des Conteneurs

```bash
# Voir les conteneurs en cours
docker-compose ps

# Arrêter les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart frontend
docker-compose restart backend

# Voir les logs d'un service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Accès aux Conteneurs

```bash
# Accéder au conteneur frontend
docker-compose exec frontend sh

# Accéder au conteneur backend
docker-compose exec backend sh

# Accéder à MongoDB
docker-compose exec mongodb mongosh -u admin -p chabakapro2025
```

### Base de Données

```bash
# Backup de la base de données
docker-compose exec mongodb mongodump --out=/data/backup

# Restaurer la base de données
docker-compose exec mongodb mongorestore /data/backup

# Voir les données
docker-compose exec mongodb mongosh -u admin -p chabakapro2025 chabakapro
```

## 🛠️ Développement Local (Sans Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 📧 Configuration Email Gmail

1. Activez la validation en 2 étapes sur votre compte Google
2. Créez un mot de passe d'application: https://myaccount.google.com/apppasswords
3. Utilisez ce mot de passe dans `EMAIL_PASS`

## 📊 Google Analytics

1. Créez une propriété GA4: https://analytics.google.com
2. Copiez votre ID de mesure (G-XXXXXXXXXX)
3. Ajoutez-le dans `REACT_APP_GOOGLE_ANALYTICS_ID`

## 🔒 Sécurité

### En Production

1. Changez tous les mots de passe par défaut
2. Utilisez HTTPS avec un certificat SSL
3. Configurez un firewall
4. Activez les backups automatiques
5. Utilisez des variables d'environnement sécurisées

## 📝 Structure du Projet

```
OurProject/
├── backend/          # API Node.js/Express
├── frontend/         # Application React
├── docker-compose.yml
├── .env.example
├── start.sh
├── stop.sh
└── README.md
```

## 🐛 Dépannage

### Le frontend ne se charge pas

```bash
# Vérifier les logs
docker-compose logs frontend

# Reconstruire le conteneur
docker-compose up -d --build frontend
```

### Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB est en cours
docker-compose ps mongodb

# Redémarrer MongoDB
docker-compose restart mongodb
```

### Erreur d'email

- Vérifiez que `EMAIL_USER` et `EMAIL_PASS` sont corrects
- Vérifiez que le mot de passe d'application est actif
- Vérifiez les logs backend: `docker-compose logs backend`

## 📚 Ressources

- Documentation React: https://react.dev
- Documentation Express: https://expressjs.com
- Documentation MongoDB: https://docs.mongodb.com
- Documentation Docker: https://docs.docker.com

## 🤝 Support

Pour toute question:
- Email: contact@chabakapro.ma
- WhatsApp: +212 6XX XXX XXX
