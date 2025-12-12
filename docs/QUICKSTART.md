# ⚡ DÉMARRAGE RAPIDE - CHABAKAPRO

## 🎯 Commandes Essentielles

### Démarrage Initial

```bash
# 1. Configuration
cp .env.example .env
nano .env  # Éditer avec vos valeurs

# 2. Lancer l'application
./start.sh

# OU manuellement:
docker-compose up --build -d
```

### Accès Rapide

- **Site Web**: http://localhost:3000
- **API**: http://localhost:5000/api/health
- **MongoDB**: mongodb://localhost:27017

### Commandes Docker

```bash
# Voir l'état
docker-compose ps

# Logs en direct
docker-compose logs -f

# Logs d'un service
docker-compose logs -f frontend
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
./stop.sh
# OU
docker-compose down
```

### Base de Données

```bash
# Accéder à MongoDB
docker-compose exec mongodb mongosh -u admin -p chabakapro2025

# Voir les collections
docker-compose exec mongodb mongosh -u admin -p chabakapro2025 chabakapro --eval "show collections"

# Voir les témoignages
docker-compose exec mongodb mongosh -u admin -p chabakapro2025 chabakapro --eval "db.testimonials.find().pretty()"
```

### Développement

```bash
# Frontend seulement (dev mode)
cd frontend
npm install
npm start

# Backend seulement (dev mode)
cd backend
npm install
npm run dev
```

## 🔧 Configuration Minimale .env

```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb://admin:chabakapro2025@mongodb:27017/chabakapro?authSource=admin

# Email
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_NUMBER=212600000000
REACT_APP_PHONE_NUMBER=+212 6XX XXX XXX
REACT_APP_EMAIL=contact@chabakapro.ma
```

## ✅ Checklist Premier Lancement

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` créé et configuré
- [ ] Port 3000 disponible (frontend)
- [ ] Port 5000 disponible (backend)
- [ ] Port 27017 disponible (MongoDB)
- [ ] Email Gmail configuré avec mot de passe d'application
- [ ] Lancer `./start.sh`
- [ ] Vérifier http://localhost:3000
- [ ] Tester formulaire de contact

## 🚨 Dépannage Express

### Problème: Port déjà utilisé

```bash
# Linux/Mac
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Problème: Email ne fonctionne pas

1. Vérifier EMAIL_USER et EMAIL_PASS dans .env
2. Créer un mot de passe d'application Gmail
3. Voir les logs: `docker-compose logs backend`

### Problème: Frontend ne charge pas

```bash
# Reconstruire
docker-compose up -d --build frontend
```

## 📞 Contact Développeur

Pour support: contact@chabakapro.ma

---

**Bon développement ! 🚀**
