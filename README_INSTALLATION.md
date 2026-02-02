# Instructions d'Installation - Corrections SSI/GRC

Ce dossier contient tous les fichiers de correction pour votre application SSI/GRC afin de :

1. ✅ Corriger les scripts npm pour Windows
2. ✅ Implémenter l'authentification locale (email/password)
3. ✅ Préparer le déploiement sur o2switch

---

## 📦 Contenu du Dossier

```
ssi-app-corrections/
├── package.json                              # Scripts npm corrigés (cross-env)
├── ecosystem.config.cjs                      # Configuration PM2 pour o2switch
├── .htaccess                                 # Configuration Apache reverse proxy
├── server/
│   ├── localAuth.ts                          # Système d'authentification locale
│   └── auth-routes-addition.ts               # Routes à ajouter dans routers.ts
├── client/src/
│   ├── pages/
│   │   ├── Login.tsx                         # Page de connexion
│   │   └── Register.tsx                      # Page d'inscription
│   └── components/
│       └── DashboardLayout-modifications.tsx # Modifications pour DashboardLayout
├── drizzle/
│   └── schema-modifications.ts               # Ajout du champ passwordHash
└── docs/
    └── GUIDE_DEPLOIEMENT_O2SWITCH.md         # Guide complet de déploiement
```

---

## 🚀 Étape 1 : Corriger l'Erreur Windows

### Problème

```
'NODE_ENV' n'est pas reconnu en tant que commande interne
```

### Solution

1. **Remplacez votre `package.json`** par celui fourni dans ce dossier
2. **Installez `cross-env`** :

```bash
cd C:\Users\Avenier\ssi-app
pnpm add -D cross-env
```

3. **Testez** :

```bash
pnpm dev
```

L'application devrait maintenant démarrer sans erreur !

---

## 🔐 Étape 2 : Implémenter l'Authentification Locale

### 2.1 Installer les dépendances

```bash
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### 2.2 Modifier le schéma de base de données

1. **Ouvrez** `drizzle/schema.ts`
2. **Ajoutez** le champ `passwordHash` dans la table `users` :

```typescript
export const users = mysqlTable("users", {
  // ... autres champs ...
  email: varchar("email", { length: 320 }),
  passwordHash: text("password_hash"), // AJOUTEZ CETTE LIGNE
  loginMethod: varchar("login_method", { length: 64 }),
  // ... autres champs ...
});
```

3. **Poussez les modifications** :

```bash
pnpm db:push
```

### 2.3 Ajouter le fichier d'authentification

1. **Copiez** `server/localAuth.ts` dans votre projet
2. **Placez-le** dans `C:\Users\Avenier\ssi-app\server\localAuth.ts`

### 2.4 Modifier server/routers.ts

1. **Ouvrez** `server/routers.ts`
2. **Ajoutez** les imports en haut du fichier :

```typescript
import { loginUser, registerUser, generateToken } from "./localAuth";
```

3. **Ajoutez** les routes d'authentification (voir `server/auth-routes-addition.ts`)

### 2.5 Modifier server/_core/context.ts

1. **Ouvrez** `server/_core/context.ts`
2. **Ajoutez** l'import :

```typescript
import { verifyToken } from "../localAuth";
```

3. **Modifiez** la fonction `createContext` pour supporter l'authentification locale (voir `server/auth-routes-addition.ts`)

### 2.6 Ajouter les pages de login/register

1. **Copiez** `client/src/pages/Login.tsx` dans votre projet
2. **Copiez** `client/src/pages/Register.tsx` dans votre projet

### 2.7 Modifier App.tsx

1. **Ouvrez** `client/src/App.tsx`
2. **Ajoutez** les imports :

```typescript
import Login from "./pages/Login";
import Register from "./pages/Register";
```

3. **Ajoutez** les routes :

```typescript
<Route path={"/login"} component={Login} />
<Route path={"/register"} component={Register} />
```

### 2.8 Modifier DashboardLayout.tsx

1. **Ouvrez** `client/src/components/DashboardLayout.tsx`
2. **Remplacez** la section "if (!user)" (voir `client/src/components/DashboardLayout-modifications.tsx`)

---

## ✅ Étape 3 : Tester l'Application en Local

```bash
# Démarrer l'application
pnpm dev
```

1. **Ouvrez** http://localhost:3000
2. **Vous serez redirigé** vers `/login`
3. **Cliquez** sur "Créer un compte"
4. **Inscrivez-vous** avec :
   - Nom : Votre nom
   - Email : votre.email@exemple.com
   - Mot de passe : minimum 8 caractères
5. **Connectez-vous** et testez l'application !

---

## 🌐 Étape 4 : Déployer sur o2switch

Consultez le **guide complet de déploiement** :

📄 `docs/GUIDE_DEPLOIEMENT_O2SWITCH.md`

Ce guide couvre :

- Configuration de la base de données MySQL
- Transfert des fichiers via FTP/SSH
- Installation de Node.js et PM2
- Configuration du reverse proxy Apache
- Activation HTTPS avec Let's Encrypt
- Maintenance et dépannage

---

## 📝 Checklist de Vérification

Avant de déployer sur o2switch, assurez-vous que :

- [ ] L'application démarre sans erreur en local (`pnpm dev`)
- [ ] Vous pouvez créer un compte et vous connecter
- [ ] Tous les modules sont accessibles après connexion
- [ ] La base de données est correctement configurée
- [ ] Le fichier `.env` est configuré avec vos identifiants MySQL
- [ ] L'application compile sans erreur (`pnpm build`)

---

## 🆘 Problèmes Courants

### Erreur : "Cannot find module 'bcryptjs'"

```bash
pnpm add bcryptjs
```

### Erreur : "Column 'password_hash' doesn't exist"

```bash
pnpm db:push
```

### Erreur : "Invalid email or password"

- Vérifiez que vous avez bien créé un compte
- Vérifiez que le mot de passe fait au moins 8 caractères
- Vérifiez les logs du serveur pour plus de détails

### L'application ne démarre pas

```bash
# Vérifier les erreurs TypeScript
pnpm check

# Vérifier les logs
# Regardez la console pour les erreurs
```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** de la console
2. **Consultez** le guide de déploiement o2switch
3. **Vérifiez** que toutes les modifications ont été appliquées

---

## 🎉 Prochaines Étapes

Une fois l'authentification locale fonctionnelle, vous pouvez :

1. **Développer les CRUD** pour le module Organisations
2. **Développer les CRUD** pour le module Risques
3. **Développer les CRUD** pour le module Contrôles
4. **Déployer sur o2switch** avec le guide fourni

---

**Bon développement ! 🚀**
