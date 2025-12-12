# ChabakaPro - Services IT Casablanca 🌐

Site web professionnel pour services informatiques à Casablanca. Dépannage, maintenance, réseaux et sécurité pour particuliers et PME.

**Version 2.0 - Dark Mode & Enhanced Footer Edition** 🌓

## ✨ Nouvelles Fonctionnalités (v2.0)

### 🌓 Mode Sombre
- Toggle élégant (☀️/🌙) dans la navbar
- Persistance du choix utilisateur (localStorage)
- Auto-détection de la préférence système
- Transitions fluides et douces
- Support complet sur tout le site

### 🎨 Footer Redesigné
- Section newsletter avec formulaire d'abonnement
- Animations de fond avec cercles pulsants
- Badges de confiance colorés (✓Certifié ⚡Rapide 🏆+500 Clients)
- Contact cards avec icônes colorées
- WhatsApp CTA proéminent avec gradient
- Barre gradient de séparation
- Message "Fait avec ❤️ à Casablanca"

### 📱 Interface Améliorée
- Design moderne et créatif
- Gradients sophistiqués
- Animations performantes
- Responsive design optimisé

## 🚀 Technologies

- **Frontend**: React 18.2.0 + React Router 6 + Tailwind CSS 3.4.0
- **Backend**: Node.js 18 + Express 4 + MongoDB 7.0
- **State Management**: React Context API (Theme)
- **Styling**: Tailwind CSS avec dark mode
- **Icons**: React Icons 4.12.0
- **Containerization**: Docker + Docker Compose
- **Email**: Nodemailer
- **SEO**: React Helmet, Sitemap

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js 18+ (pour développement local sans Docker)
- Git

## 🛠️ Installation et Démarrage

### Avec Docker (Recommandé)

1. Cloner le projet:
```bash
git clone <repository-url>
cd OurProject
```

2. Configurer les variables d'environnement:
```bash
cp .env.example .env
# Éditer .env avec vos vraies valeurs
```

3. Lancer tous les services:
```bash
docker-compose up --build
```

4. Accéder à l'application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017
- Admin Dashboard: http://localhost:3000/admin-dashboard-chabakapro

### Déploiement Rapide (Dark Mode)

```bash
# Utiliser le script automatique
./deploy-dark-mode.sh

# Ou manuellement
cd frontend && npm run build
sudo docker cp frontend/build/. chabakapro_frontend:/usr/share/nginx/html/
```

### Sans Docker (Développement Local)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Structure du Projet

```
OurProject/
├── backend/
│   ├── src/
│   │   ├── models/        # Modèles MongoDB
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Logique métier
│   │   ├── middleware/    # Middleware Express
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utilitaires
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages
│   │   ├── services/      # Services API
│   │   ├── assets/        # Images, CSS
│   │   └── utils/         # Utilitaires
│   ├── public/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🎨 Fonctionnalités

- ✅ Page d'accueil avec hero section
- ✅ Services pour particuliers et entreprises
- ✅ Portfolio/Cas clients
- ✅ Formulaires de contact et devis
- ✅ Blog avec système CRUD
- ✅ Intégration Google Maps
- ✅ Bouton WhatsApp
- ✅ Témoignages clients
- ✅ Design responsive (mobile-first)
- ✅ SEO optimisé
- ✅ Google Analytics
- ✅ Notifications email

## 📧 Configuration Email

Pour activer les notifications par email, configurez dans `.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

**Note**: Pour Gmail, créez un mot de passe d'application: https://myaccount.google.com/apppasswords

## 🔒 Sécurité

- HTTPS recommandé en production
- Variables d'environnement sécurisées
- Protection CSRF
- Rate limiting sur les API
- Validation des entrées
- Sanitization des données

## 📊 SEO

- Meta tags optimisés
- Sitemap.xml généré automatiquement
- Robots.txt configuré
- Structured data (Schema.org)
- Images optimisées
- Performance optimisée

## 🚢 Déploiement en Production

1. Configurez un serveur avec Docker
2. Configurez un nom de domaine (ex: techsolutions-casa.ma)
3. Obtenez un certificat SSL (Let's Encrypt)
4. Configurez les variables d'environnement de production
5. Déployez avec Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 API Endpoints

### Contact
- `POST /api/contact` - Envoyer un message de contact

### Devis
- `POST /api/devis` - Demander un devis

### Blog
- `GET /api/blog` - Liste des articles
- `GET /api/blog/:id` - Article spécifique
- `POST /api/blog` - Créer un article (admin)
- `PUT /api/blog/:id` - Modifier un article (admin)
- `DELETE /api/blog/:id` - Supprimer un article (admin)

### Portfolio
- `GET /api/portfolio` - Liste des cas clients
- `GET /api/portfolio/:id` - Cas client spécifique

### Témoignages
- `GET /api/testimonials` - Liste des témoignages

## 🤝 Support

Pour toute question ou problème:
- Email: contact@techsolutions-casa.ma
- WhatsApp: +212 6XX XXX XXX

## 📄 Licence

© 2025 ChabakaPro - Tech Solutions Casablanca. Tous droits réservés.
