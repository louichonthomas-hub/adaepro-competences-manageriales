
# Configuration de l'application Compétences Managériales sur Vercel

## 1. Configuration de la base de données Supabase

### Étape 1.1 : Créer une nouvelle base de données Supabase
1. Aller sur https://supabase.com/dashboard/projects
2. Cliquer sur "New Project"
3. Nom du projet : `competences-manageriales-db` (ou autre nom de votre choix)
4. Choisir une région proche (par exemple : `Europe West`)
5. Définir un mot de passe fort pour la base de données
6. Cliquer sur "Create new project"

### Étape 1.2 : Récupérer la connection string
1. Une fois le projet créé, aller dans "Project Settings" (icône ⚙️)
2. Cliquer sur "Database" dans le menu latéral
3. Dans la section "Connection string", **copier la valeur de "URI" (Connection pooling désactivé)**
4. Le format devrait ressembler à : 
   ```
   postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
5. **IMPORTANT** : Remplacer `[YOUR-PASSWORD]` par le mot de passe que vous avez défini à l'étape 1.1

### Étape 1.3 : Exécuter les migrations Prisma
1. Ouvrir un terminal
2. Se positionner dans le dossier du projet : `cd adaepro_competences_vercel/app`
3. Créer un fichier `.env` avec votre connection string :
   ```
   DATABASE_URL="postgresql://postgres.xxxxxxxxx:MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
   ```
4. Exécuter la migration :
   ```bash
   yarn prisma migrate deploy
   ```
   ou
   ```bash
   npx prisma migrate deploy
   ```

---

## 2. Configuration des variables d'environnement sur Vercel

### Étape 2.1 : Aller sur le dashboard Vercel
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet `comp-tences-manager` (https://comp-tences-manager.vercel.app/)
3. Aller dans "Settings" → "Environment Variables"

### Étape 2.2 : Configurer DATABASE_URL
1. Vérifier si `DATABASE_URL` existe déjà
2. **Si elle existe**, cliquer sur les `...` → "Edit"
3. **Si elle n'existe pas**, cliquer sur "Add New"
4. Définir :
   - **Key** : `DATABASE_URL`
   - **Value** : La connection string Supabase obtenue à l'étape 1.2
     ```
     postgresql://postgres.xxxxxxxxx:MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
     ```
   - **Environments** : Cocher `Production`, `Preview`, et `Development`
5. Cliquer sur "Save"

### Étape 2.3 : Configurer GOOGLE_DRIVE_ACCESS_TOKEN
1. **Obtenir un token d'accès Google Drive** :
   - Option 1 : Utiliser le même token que pour l'application Styles Managériaux si vous l'avez déjà configuré
   - Option 2 : Générer un nouveau token via Google Cloud Console :
     - Aller sur https://console.cloud.google.com/
     - Créer ou sélectionner un projet
     - Activer l'API Google Drive
     - Créer des credentials OAuth 2.0
     - Obtenir un access token

2. Dans Vercel, ajouter la variable :
   - Cliquer sur "Add New" dans Environment Variables
   - **Key** : `GOOGLE_DRIVE_ACCESS_TOKEN`
   - **Value** : Votre token d'accès Google Drive
   - **Environments** : Cocher `Production`, `Preview`, et `Development`
   - Cliquer sur "Save"

---

## 3. Redéployer l'application

### Option 1 : Pousser les changements sur GitHub
Si le projet est connecté à un repository GitHub :
```bash
cd /home/ubuntu/adaepro_competences_vercel
git add .
git commit -m "Add Google Drive integration and database configuration"
git push origin main
```
Vercel déploiera automatiquement les changements.

### Option 2 : Redéploiement manuel sur Vercel
1. Aller sur le dashboard Vercel
2. Sélectionner le projet `comp-tences-manager`
3. Aller dans "Deployments"
4. Cliquer sur les `...` du dernier déploiement
5. Cliquer sur "Redeploy"

---

## 4. Vérification après déploiement

### Étape 4.1 : Tester la création de candidat
1. Aller sur https://comp-tences-manager.vercel.app/
2. Cliquer sur "Commencer le test"
3. Remplir le formulaire d'identification
4. Vérifier qu'il n'y a pas d'erreur 500

### Étape 4.2 : Vérifier les logs Vercel
1. Aller sur le dashboard Vercel
2. Sélectionner le projet
3. Aller dans "Logs" (dans le menu "Deployments")
4. Vérifier qu'il n'y a pas d'erreurs Prisma ou de connexion à la base de données

### Étape 4.3 : Vérifier Google Drive (optionnel)
1. Aller sur https://drive.google.com
2. Vérifier qu'un dossier "Candidats Compétences Managériales" a été créé
3. Vérifier qu'un sous-dossier avec le nom du candidat contient le fichier Excel

---

## 5. Résumé des variables d'environnement nécessaires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string Supabase (sans pooling) | `postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` |
| `GOOGLE_DRIVE_ACCESS_TOKEN` | Token d'accès OAuth Google Drive | `ya29.a0AfH6SMB...` |

---

## 6. En cas de problème

### Erreur "PrismaClient is unable to connect to the database"
- Vérifier que `DATABASE_URL` est correctement configurée sur Vercel
- Vérifier que le mot de passe dans la connection string est correct
- Vérifier que la base de données Supabase est bien active

### Erreur "Google Drive API"
- Vérifier que `GOOGLE_DRIVE_ACCESS_TOKEN` est configurée
- Vérifier que le token n'est pas expiré
- Si le token est expiré, générer un nouveau token et mettre à jour la variable sur Vercel

### Erreur 500 après déploiement
- Consulter les logs Vercel : Dashboard → Projet → Logs
- Vérifier que toutes les variables d'environnement sont définies
- Vérifier que les migrations Prisma ont été exécutées

---

## Notes importantes

⚠️ **NE JAMAIS** committer le fichier `.env` contenant les vraies valeurs
⚠️ Toujours utiliser des variables d'environnement sur Vercel pour les secrets
⚠️ Après modification des variables d'environnement, toujours redéployer l'application

---
