# 📸 Prompts pour Générer les Photos - Chabaka Pro

## 🎯 Objectif
Générer 5-7 photos photoréalistes pour le slider hero de votre site IT à Casablanca.

---

## 🔧 Où les utiliser?

Les images sont déjà configurées dans:
- **Fichier:** `/frontend/src/components/common/ImageSlider.js`
- **Section:** Hero background (défile automatiquement toutes les 5 secondes)

---

## 📝 Prompts IA (Midjourney, DALL-E, Leonardo.ai)

### **Prompt 1 - Bureau IT Professionnel Casablanca**
```
Professional IT office workspace in Casablanca Morocco, modern tech company interior, 
multiple computer monitors displaying network diagrams and code, 
moroccan IT technician working on laptop, 
blue and cyan LED lighting, server racks in background, 
cable management on desk, professional atmosphere, 
photorealistic, wide angle shot, 8k quality, 
Hassan II Mosque visible through window, 
daytime natural lighting mixed with tech ambiance
```

**Style:** Photoréaliste, ambiance tech professionnelle  
**Résolution:** 1920x1080px minimum  
**Format:** JPG ou WebP optimisé

---

### **Prompt 2 - Technicien Réparation PC**
```
Moroccan IT technician repairing computer in modern repair shop Casablanca, 
hands working on open PC case with tools, 
motherboard visible, electronic components, 
focused professional wearing anti-static wrist strap, 
organized workspace with diagnostic equipment, 
blue and orange accent lighting, shallow depth of field, 
photorealistic, professional photography, 8k,
clean modern environment
```

**Style:** Close-up professionnel, focus sur expertise technique  
**Résolution:** 1920x1080px  
**Format:** JPG optimisé

---

### **Prompt 3 - Installation Réseau Wi-Fi**
```
Professional network installation in modern Casablanca office, 
IT technician mounting WiFi router on wall, 
ethernet cables organized with cable management, 
networking equipment rack, blinking LED lights, 
professional in company uniform, tools on table, 
modern moroccan office interior, 
cyan and blue color scheme, photorealistic, 
wide shot showing professional installation setup, 8k quality
```

**Style:** Action shot, professionnel au travail  
**Résolution:** 1920x1080px  
**Format:** WebP ou JPG

---

### **Prompt 4 - Serveur & Data Center**
```
Modern server room data center in Morocco, 
rows of server racks with blinking status LEDs, 
blue and green indicator lights, organized cable management, 
network switches and routers, cooling system visible, 
professional IT infrastructure, clean organized environment, 
depth of field showing servers extending into background, 
cinematic lighting, photorealistic, 8k quality, 
moroccan data center aesthetics
```

**Style:** Tech ambiance, atmosphère sécurisée  
**Résolution:** 1920x1080px  
**Format:** JPG avec compression

---

### **Prompt 5 - Cybersécurité & Surveillance**
```
Cybersecurity monitoring setup in Casablanca IT company, 
multiple monitors displaying security dashboards and network traffic, 
padlock icons and security visualizations on screens, 
moroccan security specialist at desk with dual monitors, 
blue and cyan interface lighting, professional command center, 
security camera feeds visible, modern tech aesthetic, 
photorealistic, cinematic composition, 8k quality, 
futuristic yet professional atmosphere
```

**Style:** Dashboard tech, sécurité professionnelle  
**Résolution:** 1920x1080px  
**Format:** WebP optimisé

---

### **Prompt 6 - Caméras IP Installation**
```
Professional installing IP security camera in modern Casablanca building, 
technician on ladder mounting outdoor surveillance camera, 
POE ethernet cable installation, professional tools, 
moroccan architecture in background, daytime shot, 
professional company uniform, safety equipment, 
wide angle showing installation context, 
photorealistic professional photography, 8k quality, 
blue sky, clean modern aesthetic
```

**Style:** Installation réaliste, professionnel  
**Résolution:** 1920x1080px  
**Format:** JPG

---

### **Prompt 7 - Support Client & Assistance**
```
Friendly moroccan IT support specialist at modern desk in Casablanca office, 
professional headset and dual monitors, 
video call support session on screen, happy customer interaction, 
organized workspace with company branding, 
natural lighting from windows, professional atmosphere, 
laptop and documentation visible, phone and tablet on desk, 
warm welcoming environment, photorealistic, 8k quality, 
modern moroccan office interior design
```

**Style:** Service client, ambiance chaleureuse  
**Résolution:** 1920x1080px  
**Format:** WebP ou JPG

---

## 🎨 Paramètres Recommandés

### Pour Midjourney:
```
--ar 16:9 --style raw --quality 2 --v 6
```

### Pour DALL-E 3:
- **Taille:** 1792x1024 (paysage)
- **Style:** Natural, photographic
- **Qualité:** HD

### Pour Leonardo.ai:
- **Model:** Leonardo Diffusion XL ou PhotoReal
- **Dimensions:** 1920x1088
- **Photoreal Strength:** High
- **Number of images:** 4

---

## 🔄 Où Placer les Images Générées

### Étape 1: Optimisation
```bash
# Convertir en WebP (meilleure compression)
cwebp -q 80 image.jpg -o image.webp

# Ou compresser JPG
jpegoptim --max=85 --strip-all image.jpg
```

### Étape 2: Nommage
Renommez vos images:
```
hero-slide-1.jpg  (Bureau IT)
hero-slide-2.jpg  (Réparation PC)
hero-slide-3.jpg  (Wi-Fi)
hero-slide-4.jpg  (Serveur)
hero-slide-5.jpg  (Cybersécurité)
hero-slide-6.jpg  (Caméras)
hero-slide-7.jpg  (Support)
```

### Étape 3: Upload
Placez dans:
```
/home/abdo/Desktop/WithTaha/OurProject/frontend/public/images/slider/
```

### Étape 4: Configuration
Les URLs sont déjà dans `/frontend/src/components/common/ImageSlider.js`:
```javascript
const images = [
  {
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=800',
    alt: 'Réseau informatique et câblage',
    title: 'Infrastructure Réseau',
    description: 'Solutions réseau professionnelles'
  },
  // ... autres images
];
```

**Remplacez les URLs Unsplash par vos images locales:**
```javascript
{
  url: '/images/slider/hero-slide-1.jpg',
  alt: 'Bureau IT professionnel à Casablanca',
  title: 'Expertise IT Locale',
  description: 'Services professionnels à Casablanca'
}
```

---

## 🎯 Alternatives Gratuites

### Stock Photos Gratuites (si pas d'IA)

**Unsplash** (déjà configuré):
- https://unsplash.com/s/photos/it-support
- https://unsplash.com/s/photos/network-engineer
- https://unsplash.com/s/photos/data-center

**Pexels**:
- https://www.pexels.com/search/it%20technician/
- https://www.pexels.com/search/computer%20repair/
- https://www.pexels.com/search/server%20room/

**Pixabay**:
- https://pixabay.com/images/search/cybersecurity/
- https://pixabay.com/images/search/network/

### Modification Requise
Si vous utilisez stock photos, ajoutez overlay Casablanca:
- Logo Chabaka Pro en watermark subtil
- Texte "Casablanca, Maroc" en bas
- Filtres couleur cyan/blue pour cohérence

---

## ✅ Checklist Validation Images

Avant d'uploader, vérifiez:

- [ ] **Résolution:** Min 1920x1080px
- [ ] **Format:** JPG ou WebP optimisé
- [ ] **Poids:** < 200KB par image (compression)
- [ ] **Aspect ratio:** 16:9 (paysage)
- [ ] **Qualité:** Nette, professionnelle
- [ ] **Thème:** IT, tech, Casablanca
- [ ] **Ambiance:** Professionnelle mais accessible
- [ ] **Cohérence:** Palette cyan/blue/orange
- [ ] **Droits:** Libre de droits ou générée par IA
- [ ] **Visages:** Eviter visages reconnaissables (RGPD)

---

## 🚀 Test Slider

Après upload des images:

1. **Rebuild frontend:**
```bash
cd /home/abdo/Desktop/WithTaha/OurProject/frontend
npm run build
```

2. **Restart containers:**
```bash
cd /home/abdo/Desktop/WithTaha/OurProject
sudo docker-compose restart
```

3. **Vérifier:**
```
http://localhost:3000
```

Le slider doit défiler automatiquement toutes les 5 secondes avec vos nouvelles images!

---

## 🎨 Exemples de Services IA

### Gratuits (limités):
- **Bing Image Creator** (DALL-E gratuit): https://www.bing.com/create
- **Leonardo.ai** (150 crédits/jour gratuits): https://leonardo.ai
- **Playground AI** (500 images/jour): https://playgroundai.com

### Payants (meilleure qualité):
- **Midjourney** (~$10/mois): https://midjourney.com
- **DALL-E 3** (ChatGPT Plus $20/mois): https://chat.openai.com
- **Ideogram** (meilleur texte): https://ideogram.ai

---

## 💡 Tips Créatifs

### Variété Recommandée:
1. **Wide shot** - Bureau/environnement complet
2. **Close-up** - Mains travaillant sur équipement
3. **Medium shot** - Technicien au travail
4. **Tech focus** - Équipement/écrans en détail
5. **Team shot** - Equipe professionnelle (optionnel)

### Cohérence Visuelle:
- **Palette:** Dominante bleue/cyan + accents orange
- **Style:** Photoréaliste professionnel
- **Ambiance:** Moderne, propre, organisé
- **Local:** Références Casablanca quand possible

### Performance Web:
- Compressez agressivement (80-85% qualité)
- Utilisez WebP si supporté (30% plus léger)
- Lazy load images hors hero
- CDN si possible pour delivery rapide

---

**🎯 Objectif Final:**  
Slider automatique de 5-7 photos professionnelles qui montrent l'expertise IT de Chabaka Pro à Casablanca, rassurent les clients, et maintiennent une performance web optimale.

**Bon courage! 🚀**
