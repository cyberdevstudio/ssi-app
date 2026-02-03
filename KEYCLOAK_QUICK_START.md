# 🚀 Keycloak Integration - Quick Start

## ✅ Ce qui a été fait

L'intégration Keycloak est **complète** et **prête à l'emploi** :

1. ✅ **Module d'authentification Keycloak** (`server/keycloakAuth.ts`)
   - Login via Direct Access Grants
   - Register via Admin API
   - Refresh token
   - Logout

2. ✅ **Routes tRPC mises à jour** (`server/routers.ts`)
   - `auth.login` → Keycloak
   - `auth.register` → Keycloak
   - `auth.refreshToken` → Keycloak
   - `auth.logout` → Keycloak

3. ✅ **Schéma base de données** (`drizzle/schema.ts`)
   - Ajout du champ `keycloakId`

4. ✅ **Configuration** (`.env.keycloak.example`)
   - Toutes les variables Keycloak

5. ✅ **Documentation complète** (`docs/KEYCLOAK_INTEGRATION.md`)
   - Architecture
   - Configuration Keycloak
   - Flux d'authentification
   - Tests
   - Dépannage

---

## 🎯 Ce qui n'a PAS changé

✅ **Pages frontend** : Login et Register inchangées  
✅ **Routes frontend** : Aucune modification  
✅ **Composants UI** : Design intact  
✅ **UX** : Pas de redirection vers Keycloak  

---

## 📦 Installation

### Étape 1 : Extraire l'archive

Extrayez `keycloak-integration-complete.zip` et copiez les fichiers dans votre projet :

```
C:\Users\Avenier\ssi-app\
├── server/
│   ├── keycloakAuth.ts          ← NOUVEAU
│   └── routers.ts               ← REMPLACER
├── drizzle/
│   └── schema.ts                ← REMPLACER
├── docs/
│   └── KEYCLOAK_INTEGRATION.md  ← NOUVEAU
└── .env.keycloak.example        ← RÉFÉRENCE
```

### Étape 2 : Configurer Keycloak

1. **Créer le realm** : `ssigrc`
2. **Créer le client** : `sigma-frontend`
3. **Activer Direct Access Grants** : `ON`
4. **Récupérer le Client Secret**

### Étape 3 : Configurer `.env`

Ajoutez ces variables à votre fichier `.env` :

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ssigrc
KEYCLOAK_CLIENT_ID=sigma-frontend
KEYCLOAK_CLIENT_SECRET=votre-secret-ici
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

### Étape 4 : Migration base de données

```bash
pnpm db:push
```

### Étape 5 : Redémarrer

```bash
pnpm dev
```

---

## 🧪 Test Rapide

1. Ouvrez `http://localhost:3001`
2. Cliquez sur **"Créer un compte"**
3. Remplissez le formulaire
4. ✅ **L'inscription passe par Keycloak** (transparent pour l'utilisateur)
5. ✅ **La connexion passe par Keycloak** (transparent pour l'utilisateur)

---

## 📊 Architecture

```
┌─────────────┐
│   Frontend  │ Pages Login/Register personnalisées
│  (inchangé) │ Pas de redirection Keycloak
└──────┬──────┘
       │ tRPC
       ↓
┌─────────────┐
│   Backend   │ keycloakAuth.ts (NOUVEAU)
│  (modifié)  │ Communique avec Keycloak
└──────┬──────┘
       │ OIDC API
       ↓
┌─────────────┐
│  Keycloak   │ Moteur d'authentification
│  (externe)  │ Gère les mots de passe
└─────────────┘
```

---

## 🔑 Points Clés

### 1. Direct Access Grants

Permet au backend d'authentifier l'utilisateur **sans redirection** :

```typescript
POST /realms/ssigrc/protocol/openid-connect/token
grant_type=password
username=user@example.com
password=password123
```

### 2. Admin API pour Register

Crée l'utilisateur dans Keycloak via l'API Admin :

```typescript
POST /admin/realms/ssigrc/users
PUT /admin/realms/ssigrc/users/{id}/reset-password
```

### 3. Session Hybride

- **Cookie local** : JWT pour la session applicative
- **Tokens Keycloak** : access_token + refresh_token (stockés côté frontend)

### 4. Synchronisation Base de Données

- Utilisateur créé dans **Keycloak** (source de vérité)
- Utilisateur créé dans **base locale** (avec `keycloakId`)
- Synchronisation automatique au login

---

## 🚨 Checklist Keycloak

Avant de tester, vérifiez :

- [ ] Keycloak est démarré (`http://localhost:8080`)
- [ ] Realm **ssigrc** existe
- [ ] Client **sigma-frontend** existe
- [ ] **Direct Access Grants Enabled** = `ON`
- [ ] Client Secret copié dans `.env`
- [ ] Variables `KEYCLOAK_*` dans `.env`
- [ ] Migration base de données effectuée (`pnpm db:push`)

---

## 📞 Support

**Erreur courante** : "Invalid email or password"

**Solution** : Vérifiez que **Direct Access Grants** est activé dans Keycloak.

**Documentation complète** : Voir `docs/KEYCLOAK_INTEGRATION.md`

---

## 🎉 Résultat

Après installation :

✅ **Login** fonctionne via Keycloak (transparent)  
✅ **Register** fonctionne via Keycloak (transparent)  
✅ **UX inchangée** (pages personnalisées)  
✅ **Sécurité renforcée** (Keycloak gère les mots de passe)  
✅ **Prêt pour SSO** (peut être activé plus tard)  

---

**L'intégration Keycloak est prête ! 🚀**
