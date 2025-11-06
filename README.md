
# 🎯 Application B - Compétences Managériales Adaepro

Application Next.js pour l'évaluation des compétences managériales.

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte GitHub
- Compte Vercel (connecté avec GitHub)
- Base de données PostgreSQL (Vercel Postgres ou externe)

### Étapes de déploiement

1. **Push sur GitHub** (déjà fait ✅)
   
2. **Configuration Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Import Project"
   - Sélectionnez votre repo GitHub
   - **IMPORTANT**: Configurez les paramètres suivants

3. **Root Directory** ⚠️
   - Laissez vide (`.` par défaut)
   - Ne mettez PAS `app` comme root directory

4. **Framework Preset**
   - Next.js (détecté automatiquement)

5. **Build Settings**
   - Build Command: `yarn build` (par défaut)
   - Output Directory: `.next` (par défaut)
   - Install Command: `yarn install` (par défaut)

6. **Variables d'environnement** 🔐
   Ajoutez ces variables dans Vercel :
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
   ```

7. **Base de données**
   - Option A: Utilisez Vercel Postgres (recommandé)
   - Option B: Connectez votre propre PostgreSQL

### 📋 Commandes utiles

```bash
# Installation locale
yarn install

# Lancer en dev
yarn dev

# Build production
yarn build

# Lancer en production
yarn start

# Générer le client Prisma
yarn prisma generate

# Créer les tables
yarn prisma db push
```

## 🐛 Problèmes courants

### Erreur "routes-manifest.json not found"
✅ **Résolu** : Cette structure corrigée fonctionne avec Next.js 14.2+

### Erreur de build Vercel
- Vérifiez que **Root Directory** est vide ou `.`
- Vérifiez que `DATABASE_URL` est configurée
- Consultez les logs de build dans Vercel

### Erreur Prisma
```bash
# Régénérer le client Prisma
yarn prisma generate
yarn prisma db push
```

## 📁 Structure du projet

```
/
├── app/              # Routes Next.js (App Router)
│   ├── api/         # API routes
│   ├── identification/
│   ├── payment/
│   ├── results/
│   ├── test/
│   ├── layout.tsx
│   └── page.tsx
├── components/       # Composants React
├── lib/             # Utilitaires et config
├── prisma/          # Schéma base de données
├── public/          # Assets statiques
└── scripts/         # Scripts utilitaires
```

## 🎨 Fonctionnalités

- ✅ Test de compétences managériales
- ✅ Identification candidat
- ✅ Sauvegarde progression
- ✅ Résultats détaillés
- ✅ Intégration paiement (Stripe ready)
- ✅ Base de données PostgreSQL

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)

---

**Note**: Ce projet utilise le App Router de Next.js 14.2+ avec une structure optimisée pour Vercel.

<!-- Version 1.1 - Thème anthracite -->
