# Configuration .env pour Développement Local

Créez un fichier `.env` à la racine du projet avec ce contenu :

```env
# ============================================
# Configuration de Base de Données (OBLIGATOIRE)
# ============================================
DATABASE_URL=mysql://sysadmin:vesta@localhost:3306/ssi_grc

# ============================================
# Configuration JWT (OBLIGATOIRE)
# ============================================
# Générez une clé secrète forte avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=cdeb6dc0-1bcf-4001-a3c1-85197edb7db12b0d24ff-2782-47e5-a0e1-0fe02b60ab1d

# ============================================
# Configuration de l'Application (OBLIGATOIRE)
# ============================================
VITE_APP_TITLE=Portail SSI & Gouvernance GRC

# ============================================
# Configuration OAuth (OPTIONNEL)
# ============================================
# Laissez vide si vous utilisez uniquement l'authentification locale
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
VITE_APP_ID=
OWNER_OPEN_ID=
OWNER_NAME=

# ============================================
# Configuration Analytics (OPTIONNEL)
# ============================================
# Laissez vide si vous n'utilisez pas d'analytics
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# ============================================
# Configuration API Forge (OPTIONNEL)
# ============================================
# Laissez vide si vous n'utilisez pas les services Manus
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_URL=

# ============================================
# Configuration Serveur
# ============================================
NODE_ENV=development
PORT=3000
```

## ⚠️ Important

1. **Remplacez les valeurs** de `DATABASE_URL` et `JWT_SECRET` par vos propres valeurs
2. **Ne committez JAMAIS** le fichier `.env` sur GitHub (il est déjà dans `.gitignore`)
3. **Générez un nouveau JWT_SECRET** avec la commande fournie ci-dessus

## ✅ Vérification

Après avoir créé le fichier `.env`, redémarrez le serveur :

```bash
pnpm dev
```

Les erreurs de variables d'environnement devraient disparaître.
