# Guide de Déploiement sur o2switch

Ce guide vous explique comment déployer votre application SSI/GRC sur votre hébergement o2switch avec cPanel.

---

## 📋 Prérequis

### Sur o2switch

- Accès cPanel à votre hébergement o2switch
- Accès SSH activé (demander au support si nécessaire)
- Node.js installé (version 18 ou supérieure)
- MySQL/MariaDB disponible

### Sur votre machine locale

- Projet SSI/GRC fonctionnel en local
- Client FTP ou accès SSH
- Accès à votre base de données MySQL locale

---

## 🗂️ Étape 1 : Préparer la Base de Données

### 1.1 Créer la base de données sur o2switch

1. **Connectez-vous à cPanel**
2. **Allez dans "Bases de données MySQL"**
3. **Créez une nouvelle base de données** :
   - Nom : `votre_user_ssi_grc` (o2switch ajoute automatiquement un préfixe)
   - Notez le nom complet de la base

4. **Créez un utilisateur MySQL** :
   - Nom d'utilisateur : `votre_user_ssi`
   - Mot de passe : Générez un mot de passe fort
   - Notez ces identifiants

5. **Associez l'utilisateur à la base de données** :
   - Sélectionnez l'utilisateur et la base
   - Accordez **TOUS LES PRIVILÈGES**

### 1.2 Exporter votre base de données locale

```bash
# Sur Windows (PowerShell)
cd C:\Users\Avenier\ssi-app

# Exporter la structure et les données
mysqldump -u sysadmin -p ssi_grc > ssi_grc_export.sql
```

### 1.3 Importer dans o2switch

**Option A : Via phpMyAdmin (recommandé pour petites bases)**

1. Dans cPanel, ouvrez **phpMyAdmin**
2. Sélectionnez votre base de données
3. Cliquez sur **Importer**
4. Choisissez le fichier `ssi_grc_export.sql`
5. Cliquez sur **Exécuter**

**Option B : Via SSH (pour grandes bases)**

```bash
# Connectez-vous en SSH
ssh votre_user@votre-domaine.com

# Importez la base
mysql -u votre_user_ssi -p votre_user_ssi_grc < ssi_grc_export.sql
```

---

## 📦 Étape 2 : Préparer l'Application pour la Production

### 2.1 Compiler l'application

Sur votre machine Windows :

```bash
cd C:\Users\Avenier\ssi-app

# Installer les dépendances (si pas déjà fait)
pnpm install

# Compiler pour la production
pnpm build
```

Cela créera un dossier `dist/` avec le serveur compilé et un dossier `client/dist/` avec le frontend.

### 2.2 Créer le fichier .env de production

Créez un fichier `.env.production` à la racine du projet :

```env
# Base de données o2switch
DATABASE_URL=mysql://votre_user_ssi:VOTRE_MOT_DE_PASSE@localhost:3306/votre_user_ssi_grc

# Secret JWT (générez une clé aléatoire forte)
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire-changez-moi

# Configuration de l'application
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=Portail SSI & Gouvernance GRC

# URL de l'application (votre domaine)
APP_URL=https://votre-domaine.com
```

**Important** : Générez un JWT_SECRET fort avec cette commande :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Étape 3 : Transférer les Fichiers sur o2switch

### 3.1 Structure des fichiers à transférer

Vous devez transférer ces dossiers/fichiers :

```
ssi-app/
├── dist/                    # Serveur compilé
├── client/dist/             # Frontend compilé
├── drizzle/                 # Schémas et migrations
├── node_modules/            # Dépendances (ou réinstaller sur le serveur)
├── package.json
├── .env.production          # Configuration production
└── ecosystem.config.cjs     # Configuration PM2 (voir ci-dessous)
```

### 3.2 Transférer via FTP

**Option A : FileZilla (recommandé)**

1. Téléchargez FileZilla : https://filezilla-project.org/
2. Connectez-vous avec vos identifiants cPanel
3. Naviguez vers `/home/votre_user/`
4. Créez un dossier `ssi-app/`
5. Transférez tous les fichiers

**Option B : Via cPanel File Manager**

1. Dans cPanel, ouvrez **Gestionnaire de fichiers**
2. Créez un dossier `ssi-app/`
3. Utilisez **Téléverser** pour transférer les fichiers
4. Extrayez les archives si nécessaire

### 3.3 Transférer via SSH (plus rapide)

```bash
# Sur votre machine Windows, compressez le projet
tar -czf ssi-app.tar.gz dist/ client/dist/ drizzle/ package.json .env.production ecosystem.config.cjs

# Transférez via SCP
scp ssi-app.tar.gz votre_user@votre-domaine.com:~/

# Sur le serveur o2switch (SSH)
ssh votre_user@votre-domaine.com
cd ~
mkdir ssi-app
tar -xzf ssi-app.tar.gz -C ssi-app/
cd ssi-app
```

---

## ⚙️ Étape 4 : Configurer l'Application sur o2switch

### 4.1 Installer Node.js (si nécessaire)

```bash
# Vérifier la version de Node.js
node --version

# Si Node.js n'est pas installé ou version < 18, demandez au support o2switch
# Ils peuvent installer Node.js via "Setup Node.js App" dans cPanel
```

### 4.2 Installer les dépendances de production

```bash
cd ~/ssi-app

# Copier le fichier .env de production
cp .env.production .env

# Installer uniquement les dépendances de production
npm install --production

# Ou si vous avez pnpm
pnpm install --prod
```

### 4.3 Configurer PM2 pour gérer l'application

PM2 est un gestionnaire de processus qui garde votre application en ligne.

**Créez le fichier `ecosystem.config.cjs` :**

```javascript
module.exports = {
  apps: [{
    name: 'ssi-app',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false
  }]
};
```

**Installer et démarrer PM2 :**

```bash
# Installer PM2 globalement
npm install -g pm2

# Créer le dossier de logs
mkdir -p logs

# Démarrer l'application
pm2 start ecosystem.config.cjs

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs ssi-app

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save
```

---

## 🌐 Étape 5 : Configurer le Reverse Proxy (cPanel)

### 5.1 Configuration Apache avec .htaccess

Créez un fichier `.htaccess` dans le dossier `public_html/` :

```apache
# Activer le module de réécriture
RewriteEngine On

# Rediriger tout le trafic vers l'application Node.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Headers de sécurité
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache des assets statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 5.2 Configuration via "Setup Node.js App" (cPanel)

Si o2switch propose "Setup Node.js App" dans cPanel :

1. Ouvrez **Setup Node.js App**
2. Cliquez sur **Create Application**
3. Configurez :
   - **Node.js version** : 18.x ou supérieure
   - **Application mode** : Production
   - **Application root** : `/home/votre_user/ssi-app`
   - **Application URL** : Votre domaine
   - **Application startup file** : `dist/index.js`
   - **Environment variables** : Ajoutez vos variables du `.env`
4. Cliquez sur **Create**

---

## 🔒 Étape 6 : Configurer HTTPS (SSL)

### 6.1 Activer Let's Encrypt SSL

1. Dans cPanel, allez dans **SSL/TLS Status**
2. Sélectionnez votre domaine
3. Cliquez sur **Run AutoSSL**
4. Attendez que le certificat soit généré

### 6.2 Forcer HTTPS

Ajoutez ces lignes au début de votre `.htaccess` :

```apache
# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ Étape 7 : Vérifier le Déploiement

### 7.1 Tester l'application

1. Ouvrez votre navigateur
2. Accédez à `https://votre-domaine.com`
3. Vous devriez voir la page de login
4. Créez un compte et testez la connexion

### 7.2 Vérifier les logs

```bash
# Logs PM2
pm2 logs ssi-app

# Logs Apache (si erreurs)
tail -f ~/logs/error_log

# Logs de l'application
tail -f ~/ssi-app/logs/pm2-out.log
tail -f ~/ssi-app/logs/pm2-error.log
```

### 7.3 Monitorer l'application

```bash
# Statut PM2
pm2 status

# Moniteur en temps réel
pm2 monit

# Redémarrer si nécessaire
pm2 restart ssi-app

# Arrêter l'application
pm2 stop ssi-app

# Supprimer l'application de PM2
pm2 delete ssi-app
```

---

## 🔧 Maintenance et Mises à Jour

### Mettre à jour l'application

```bash
# Sur votre machine Windows
cd C:\Users\Avenier\ssi-app
pnpm build

# Transférer les nouveaux fichiers dist/ vers o2switch

# Sur o2switch (SSH)
cd ~/ssi-app
pm2 restart ssi-app
```

### Sauvegarder la base de données

```bash
# Sur o2switch
mysqldump -u votre_user_ssi -p votre_user_ssi_grc > backup_$(date +%Y%m%d).sql

# Télécharger la sauvegarde
scp votre_user@votre-domaine.com:~/backup_*.sql ./
```

---

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs ssi-app --lines 100

# Vérifier les variables d'environnement
cat .env

# Tester manuellement
node dist/index.js
```

### Erreur de connexion à la base de données

```bash
# Tester la connexion MySQL
mysql -u votre_user_ssi -p votre_user_ssi_grc

# Vérifier DATABASE_URL dans .env
cat .env | grep DATABASE_URL
```

### Erreur 502 Bad Gateway

- Vérifiez que PM2 est en cours d'exécution : `pm2 status`
- Vérifiez le port dans `.env` (doit correspondre au .htaccess)
- Redémarrez Apache : `sudo service httpd restart` (si vous avez les droits)

### L'application se déconnecte après quelques minutes

- Vérifiez la mémoire disponible : `free -h`
- Augmentez `max_memory_restart` dans `ecosystem.config.cjs`
- Contactez le support o2switch pour augmenter les limites

---

## 📞 Support

### Support o2switch

- **Email** : support@o2switch.fr
- **Téléphone** : +33 (0)4 44 44 60 40
- **Documentation** : https://faq.o2switch.fr/

### Ressources Utiles

- **Documentation PM2** : https://pm2.keymetrics.io/docs/usage/quick-start/
- **Documentation Apache** : https://httpd.apache.org/docs/
- **Documentation Node.js** : https://nodejs.org/docs/

---

## ✨ Optimisations Avancées

### Activer la compression Gzip

Déjà configuré dans le `.htaccess` ci-dessus.

### Configurer un CDN

Pour améliorer les performances, vous pouvez utiliser Cloudflare :

1. Créez un compte sur https://cloudflare.com
2. Ajoutez votre domaine
3. Changez les DNS chez votre registrar
4. Activez le proxy Cloudflare

### Monitoring avec PM2 Plus

```bash
# Créer un compte sur https://app.pm2.io
# Lier votre serveur
pm2 link <secret_key> <public_key>
```

---

**Félicitations ! Votre application SSI/GRC est maintenant déployée sur o2switch ! 🎉**
