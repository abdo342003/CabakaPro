# ChabakaPro - Guide de Déploiement

## 📦 Contenu de l'Export

Cette archive contient l'application complète ChabakaPro v2.0 avec :
- Frontend React (avec dark mode et slider d'images)
- Backend Node.js/Express
- Configuration Docker
- Base de données MongoDB

## 🚀 Installation Rapide

### 1. Extraire l'Archive
```bash
tar -xzf ChabakaPro-Export-*.tar.gz
cd OurProject
```

### 2. Installation des Dépendances

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### 3. Configuration des Variables d'Environnement

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PHONE_NUMBER=+212 6XX XXX XXX
REACT_APP_EMAIL=contact@chabakapro.ma
REACT_APP_WHATSAPP_NUMBER=212600000000
```

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chabakapro
JWT_SECRET=votre_secret_jwt_ici
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe
```

### 4. Déploiement avec Docker

**Option 1 - Démarrage Complet:**
```bash
docker-compose up -d
```

**Option 2 - Démarrage Manuel:**
```bash
# MongoDB
docker run -d --name chabakapro_mongodb -p 27017:27017 mongo:latest

# Backend
cd backend
docker build -t chabakapro-backend .
docker run -d --name chabakapro_backend -p 5000:5000 --link chabakapro_mongodb:mongodb chabakapro-backend

# Frontend
cd ../frontend
npm run build
docker run -d --name chabakapro_frontend -p 3000:80 -v $(pwd)/build:/usr/share/nginx/html nginx:alpine
```

### 5. Déploiement Sans Docker

**Backend:**
```bash
cd backend
npm start
```

**Frontend (Développement):**
```bash
cd frontend
npm start
```

**Frontend (Production):**
```bash
cd frontend
npm run build
# Servir avec un serveur web (nginx, apache, etc.)
```

## 🛠️ Scripts Disponibles

### Frontend
- `npm start` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm test` - Exécution des tests

### Backend
- `npm start` - Démarrage du serveur
- `npm run dev` - Démarrage avec nodemon
- `npm test` - Exécution des tests

## 📋 Vérification de l'Installation

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:5000/api/health
3. **MongoDB:** mongodb://localhost:27017

## 🎨 Fonctionnalités Incluses

### Frontend:
- ✅ Page d'accueil avec slider d'images IT dynamique
- ✅ Dark mode complet sur toutes les pages
- ✅ Thème neutre (charcoal gray) pour meilleure visualisation des photos
- ✅ Pages: Accueil, Services (Particuliers/Entreprises), Portfolio, Blog, À Propos, Contact
- ✅ Formulaires de contact et demande de devis
- ✅ Design responsive
- ✅ SEO optimisé
- ✅ Footer amélioré avec newsletter

### Backend:
- ✅ API REST complète
- ✅ Gestion des contacts et devis
- ✅ Blog et portfolio
- ✅ Témoignages clients
- ✅ Rate limiting (20 soumissions/heure pour formulaires)
- ✅ Validation des données
- ✅ Gestion d'erreurs

## 🔧 Configuration Nginx pour Production

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/chabakapro/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Ports Utilisés

- **Frontend:** 3000 (dev) / 80 (production)
- **Backend:** 5000
- **MongoDB:** 27017

## 🎨 Personnalisation du Thème

Les couleurs principales sont dans:
- `frontend/src/index.css` - Variables CSS
- `frontend/tailwind.config.js` - Configuration Tailwind

Thème actuel:
- Primary: #2D3748 (charcoal gray)
- Secondary: #00AA55 (green)
- Background: #F7FAFC (light) / #111827 (dark)

## 📝 Notes Importantes

1. **Images du Slider:** Actuellement chargées depuis Unsplash. Pour production, hébergez vos propres images.
2. **Rate Limiting:** Configuré à 20 soumissions/heure pour les formulaires.
3. **Email:** Configurez vos credentials SMTP dans le backend .env
4. **MongoDB:** Assurez-vous que MongoDB est démarré avant le backend

## 🐛 Dépannage

**Erreur CORS:**
- Vérifiez `CORS_ORIGIN` dans backend/.env

**404 sur les routes:**
- Nginx: Ajoutez `try_files $uri $uri/ /index.html`

**Rate Limit 429:**
- Augmentez la valeur dans `backend/src/server.js`

**Images du slider ne s'affichent pas:**
- Vérifiez la connexion internet (images Unsplash)
- Ou remplacez par des images locales

## 📞 Support

Pour toute question ou assistance:
- Email: contact@chabakapro.ma
- Téléphone: +212 6XX XXX XXX

## 📄 Licence

© 2024 ChabakaPro - Tous droits réservés

---

**Version:** 2.0  
**Date d'Export:** $(date +"%d/%m/%Y")  
**Statut:** Production Ready ✅
