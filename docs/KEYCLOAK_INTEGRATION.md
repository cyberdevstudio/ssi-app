# 🔐 Guide d'Intégration Keycloak

Ce guide explique comment l'intégration Keycloak a été implémentée dans l'application SSI/GRC **sans modifier l'UX existante**.

---

## 📋 Table des Matières

1. [Architecture](#architecture)
2. [Configuration Keycloak](#configuration-keycloak)
3. [Configuration Application](#configuration-application)
4. [Flux d'Authentification](#flux-dauthentification)
5. [Migration Base de Données](#migration-base-de-données)
6. [Tests](#tests)
7. [Dépannage](#dépannage)

---

## 🏗️ Architecture

### Principe

L'intégration Keycloak utilise le pattern **Backend for Frontend (BFF)** :

- **Frontend** : Pages de login/register personnalisées (inchangées)
- **Backend** : Communique avec Keycloak via API
- **Keycloak** : Moteur d'authentification OIDC

### Flux

```
Frontend (Login Page)
    ↓ email + password
Backend (tRPC)
    ↓ Direct Access Grants
Keycloak (Token Endpoint)
    ↓ access_token + refresh_token
Backend (Session)
    ↓ JWT Cookie
Frontend (Dashboard)
```

### Avantages

✅ **Pas de redirection** vers Keycloak  
✅ **UX inchangée** (pages personnalisées)  
✅ **Sécurité renforcée** (Keycloak gère les mots de passe)  
✅ **SSO prêt** (peut être activé plus tard)  
✅ **Audit centralisé** (logs Keycloak)  

---

## ⚙️ Configuration Keycloak

### Étape 1 : Créer le Realm

1. Connectez-vous à Keycloak Admin Console : `http://localhost:8080`
2. Créez un nouveau realm : **ssigrc**

### Étape 2 : Créer le Client

1. Dans le realm **ssigrc**, créez un client :
   - **Client ID** : `sigma-frontend`
   - **Client Protocol** : `openid-connect`
   - **Access Type** : `confidential`

2. Configurez les paramètres :
   - **Valid Redirect URIs** : `http://localhost:3001/*`
   - **Web Origins** : `http://localhost:3001`

3. **IMPORTANT** : Activez **Direct Access Grants**
   - Onglet **Settings** → **Direct Access Grants Enabled** : `ON`

4. Récupérez le **Client Secret** :
   - Onglet **Credentials** → Copiez le secret

### Étape 3 : Configurer les Rôles (Optionnel)

1. Créez les rôles :
   - `user` (par défaut)
   - `admin`

2. Assignez les rôles aux utilisateurs selon les besoins

---

## 🔧 Configuration Application

### Étape 1 : Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL=mysql://sysadmin:vesta@localhost:3306/ssi_grc
JWT_SECRET=your-jwt-secret-here

# Application
VITE_APP_TITLE=Portail SSI & Gouvernance GRC
NODE_ENV=development
PORT=3001

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ssigrc
KEYCLOAK_CLIENT_ID=sigma-frontend
KEYCLOAK_CLIENT_SECRET=your-client-secret-here

# Keycloak Admin (pour l'inscription)
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

### Étape 2 : Installer les Dépendances

```bash
pnpm install
```

Aucune nouvelle dépendance n'est nécessaire (`axios` est déjà installé).

### Étape 3 : Migration Base de Données

Le champ `keycloakId` a été ajouté à la table `users` :

```bash
pnpm db:push
```

---

## 🔄 Flux d'Authentification

### 1. Login

**Frontend** → **Backend** :
```typescript
const result = await trpc.auth.login.mutate({
  email: "user@example.com",
  password: "password123",
});
```

**Backend** → **Keycloak** :
```typescript
POST {KEYCLOAK_URL}/realms/ssigrc/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
client_id=sigma-frontend
client_secret=xxx
username=user@example.com
password=password123
```

**Keycloak** → **Backend** :
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800
}
```

**Backend** → **Frontend** :
- Cookie de session (JWT local)
- Tokens Keycloak (à stocker côté frontend pour refresh)

### 2. Register

**Frontend** → **Backend** :
```typescript
const result = await trpc.auth.register.mutate({
  email: "newuser@example.com",
  password: "password123",
  name: "John Doe",
});
```

**Backend** → **Keycloak Admin API** :

1. Créer l'utilisateur :
```typescript
POST {KEYCLOAK_URL}/admin/realms/ssigrc/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "newuser@example.com",
  "email": "newuser@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "enabled": true
}
```

2. Définir le mot de passe :
```typescript
PUT {KEYCLOAK_URL}/admin/realms/ssigrc/users/{userId}/reset-password
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "type": "password",
  "value": "password123",
  "temporary": false
}
```

**Backend** → **Base de données locale** :
- Créer l'utilisateur avec `keycloakId`

**Backend** → **Frontend** :
- Cookie de session (JWT local)

### 3. Refresh Token

**Frontend** → **Backend** :
```typescript
const result = await trpc.auth.refreshToken.mutate({
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
});
```

**Backend** → **Keycloak** :
```typescript
POST {KEYCLOAK_URL}/realms/ssigrc/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
client_id=sigma-frontend
client_secret=xxx
refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Keycloak** → **Backend** → **Frontend** :
- Nouveaux tokens (access_token, refresh_token)

### 4. Logout

**Frontend** → **Backend** :
```typescript
await trpc.auth.logout.mutate({
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
});
```

**Backend** :
1. Supprimer le cookie de session
2. Appeler Keycloak logout endpoint

**Backend** → **Keycloak** :
```typescript
POST {KEYCLOAK_URL}/realms/ssigrc/protocol/openid-connect/logout
Content-Type: application/x-www-form-urlencoded

client_id=sigma-frontend
client_secret=xxx
refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Migration Base de Données

### Changements dans le Schéma

**Fichier** : `drizzle/schema.ts`

```typescript
export const users = mysqlTable("users", {
  // ... autres champs
  keycloakId: varchar("keycloak_id", { length: 255 }), // NOUVEAU
  // ... autres champs
});
```

### Commande de Migration

```bash
pnpm db:push
```

Cette commande :
1. Génère la migration SQL
2. Applique la migration à la base de données

### Migration Manuelle (si nécessaire)

```sql
ALTER TABLE users ADD COLUMN keycloak_id VARCHAR(255);
```

---

## 🧪 Tests

### Test 1 : Inscription

1. Ouvrez `http://localhost:3001`
2. Cliquez sur **"Créer un compte"**
3. Remplissez le formulaire :
   - Email : `test@example.com`
   - Mot de passe : `Test@1234`
   - Nom : `Test User`
4. Cliquez sur **"Créer mon compte"**

**Résultat attendu** :
- ✅ Utilisateur créé dans Keycloak
- ✅ Utilisateur créé dans la base de données locale
- ✅ Redirection vers le dashboard
- ✅ Session active

### Test 2 : Connexion

1. Déconnectez-vous
2. Cliquez sur **"Se connecter"**
3. Entrez les identifiants :
   - Email : `test@example.com`
   - Mot de passe : `Test@1234`
4. Cliquez sur **"Se connecter"**

**Résultat attendu** :
- ✅ Authentification via Keycloak
- ✅ Tokens reçus
- ✅ Session créée
- ✅ Redirection vers le dashboard

### Test 3 : Vérification Keycloak

1. Connectez-vous à Keycloak Admin : `http://localhost:8080`
2. Allez dans **Realm ssigrc** → **Users**
3. Vérifiez que l'utilisateur `test@example.com` existe

### Test 4 : Refresh Token

Le refresh token est automatiquement géré par le frontend. Pour tester manuellement :

```typescript
const result = await trpc.auth.refreshToken.mutate({
  refreshToken: "your-refresh-token",
});
console.log(result.tokens);
```

### Test 5 : Logout

1. Cliquez sur **"Déconnexion"** dans le dashboard
2. Vérifiez que vous êtes redirigé vers la page de login
3. Vérifiez dans Keycloak que la session est fermée

---

## 🔍 Dépannage

### Erreur : "Invalid email or password"

**Cause** : Identifiants incorrects ou Direct Access Grants désactivé

**Solution** :
1. Vérifiez les identifiants
2. Dans Keycloak Admin :
   - Realm **ssigrc** → Client **sigma-frontend**
   - Settings → **Direct Access Grants Enabled** : `ON`

### Erreur : "Failed to authenticate with Keycloak admin API"

**Cause** : Identifiants admin incorrects

**Solution** :
1. Vérifiez `KEYCLOAK_ADMIN_USERNAME` et `KEYCLOAK_ADMIN_PASSWORD`
2. Par défaut : `admin` / `admin`

### Erreur : "User already exists in Keycloak"

**Cause** : L'email est déjà enregistré dans Keycloak

**Solution** :
1. Utilisez un autre email
2. Ou supprimez l'utilisateur dans Keycloak Admin

### Erreur : "Failed to get user ID from Keycloak"

**Cause** : La réponse de Keycloak ne contient pas le header `Location`

**Solution** :
1. Vérifiez la version de Keycloak (>= 20.0)
2. Vérifiez les logs du serveur Keycloak

### Erreur : "Database not available"

**Cause** : La base de données n'est pas accessible

**Solution** :
1. Vérifiez que MySQL est démarré
2. Vérifiez `DATABASE_URL` dans `.env`
3. Testez la connexion : `mysql -u sysadmin -p -h localhost ssi_grc`

---

## 📚 Ressources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Direct Access Grants](https://www.keycloak.org/docs/latest/securing_apps/#_resource_owner_password_credentials_flow)
- [Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html)

---

## 🎯 Prochaines Étapes

1. **Tester l'intégration** complète
2. **Configurer les rôles** Keycloak
3. **Activer le SSO** (optionnel)
4. **Configurer l'email** (vérification d'email)
5. **Ajouter 2FA** (authentification à deux facteurs)

---

**L'intégration Keycloak est maintenant complète !** 🎉
