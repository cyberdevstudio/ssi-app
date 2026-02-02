# Guide de Test Local - Application SSI/GRC

## Vue d'ensemble

Cette application est une **plateforme GRC (Gouvernance, Risques et Conformité)** complète pour la gestion de la sécurité de l'information. Elle est développée avec la stack **Next.js + Node.js + PostgreSQL** et déployée sur l'infrastructure Manus.

## État Actuel du Projet

### ✅ Fonctionnalités Implémentées

**Phase 1 : Base de Données**
- ✅ Schéma Drizzle complet avec 37 entités
- ✅ Support multi-tenant (organizationId sur toutes les entités)
- ✅ Migrations configurées et appliquées
- ✅ Organisation par défaut créée

**Phase 2 : Architecture Frontend**
- ✅ Thème professionnel (bleu, design moderne)
- ✅ DashboardLayout avec sidebar navigation resizable
- ✅ 9 modules avec routes configurées
- ✅ Système d'authentification Manus OAuth
- ✅ Pages de base pour tous les modules

### 📋 Modules Disponibles

1. **Tableau de Bord** : Vue d'ensemble avec indicateurs clés
2. **Organisations** : Gestion des organisations, entités, départements, processus
3. **Gouvernance** : Rôles, comités, membres, décisions
4. **Risques** : Registre des risques avec évaluations
5. **Contrôles** : Contrôles de sécurité avec preuves
6. **Conformité** : Support ISO 27001, NIST CSF, CIS Controls, RGPD
7. **Audits** : Planification et gestion des audits
8. **Actions** : Plans d'action avec suivi
9. **EBIOS RM** : Méthodologie EBIOS RM

### 🚧 En Cours de Développement

Les fonctionnalités CRUD complètes pour chaque module seront développées progressivement après validation de l'architecture actuelle.

---

## Test de l'Application en Ligne

### Accès Direct

L'application est déjà déployée et accessible à l'adresse suivante :

**URL de l'application** : https://3000-itogvgzgx46vo5ezenf1q-7226e12d.us2.manus.computer

### Étapes de Test

1. **Accéder à l'application**
   - Ouvrez l'URL dans votre navigateur
   - Vous verrez l'écran de connexion

2. **Se connecter**
   - Cliquez sur le bouton "Sign in"
   - Authentifiez-vous avec votre compte Manus
   - Vous serez redirigé vers le tableau de bord

3. **Tester la navigation**
   - Utilisez la sidebar pour naviguer entre les modules
   - Testez le redimensionnement de la sidebar (glisser le bord droit)
   - Testez le collapse/expand de la sidebar (icône en haut à gauche)
   - Sur mobile, testez le menu hamburger

4. **Vérifier les modules**
   - Parcourez chaque module via la sidebar
   - Vérifiez que les pages se chargent correctement
   - Notez les indicateurs (actuellement à 0, normal car pas de données)

5. **Tester l'authentification**
   - Cliquez sur votre avatar en bas de la sidebar
   - Testez la déconnexion
   - Reconnectez-vous

---

## Installation Locale (Windows 11)

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   - Télécharger : https://nodejs.org/
   - Vérifier : `node --version`

2. **pnpm** (gestionnaire de paquets)
   - Installer : `npm install -g pnpm`
   - Vérifier : `pnpm --version`

3. **Git** (pour cloner le projet)
   - Télécharger : https://git-scm.com/
   - Vérifier : `git --version`

### Étapes d'Installation

#### 1. Télécharger le Projet

Vous avez deux options :

**Option A : Télécharger depuis Manus (recommandé)**
- Dans l'interface Manus, cliquez sur "Code" dans le panneau de gestion
- Cliquez sur "Download all files"
- Extrayez l'archive ZIP dans un dossier de votre choix

**Option B : Cloner depuis GitHub (si exporté)**
```bash
git clone <url-du-repo>
cd ssi-app
```

#### 2. Installer les Dépendances

Ouvrez un terminal (PowerShell ou CMD) dans le dossier du projet :

```bash
pnpm install
```

Cette commande installera toutes les dépendances nécessaires (React, Express, Drizzle, etc.).

#### 3. Configurer les Variables d'Environnement

**Important** : L'application utilise des variables d'environnement injectées automatiquement par Manus. Pour un test local complet, vous aurez besoin de :

1. **Base de données** : L'application utilise MySQL/TiDB fourni par Manus
2. **Authentification** : OAuth Manus pour l'authentification

**Pour un test local simplifié**, vous pouvez :

- Utiliser une base de données MySQL locale
- Créer un fichier `.env` à la racine du projet avec :

```env
DATABASE_URL=mysql://user:password@localhost:3306/ssi_grc
JWT_SECRET=your-secret-key-here
VITE_APP_TITLE=SSI/GRC Application
```

**Note** : L'authentification OAuth Manus ne fonctionnera pas en local sans configuration supplémentaire. Pour un test complet avec authentification, utilisez l'application déployée sur Manus.

#### 4. Initialiser la Base de Données

Si vous utilisez une base de données locale :

```bash
pnpm db:push
```

Cette commande créera toutes les tables nécessaires dans votre base de données.

#### 5. Lancer l'Application en Mode Développement

```bash
pnpm dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

#### 6. Compiler pour la Production (optionnel)

```bash
pnpm build
pnpm start
```

---

## Structure du Projet

```
ssi-app/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ui/            # Composants shadcn/ui
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Home.tsx       # Tableau de bord
│   │   │   ├── Organizations.tsx
│   │   │   ├── Governance.tsx
│   │   │   ├── Risks.tsx
│   │   │   ├── Controls.tsx
│   │   │   ├── Compliance.tsx
│   │   │   ├── Audits.tsx
│   │   │   ├── Actions.tsx
│   │   │   └── Ebios.tsx
│   │   ├── App.tsx            # Configuration des routes
│   │   └── index.css          # Styles globaux
│   └── public/                # Assets statiques
├── server/                    # Backend Express + tRPC
│   ├── routers.ts             # Routes tRPC
│   ├── db.ts                  # Helpers de base de données
│   └── _core/                 # Infrastructure (OAuth, contexte)
├── drizzle/                   # Schéma et migrations
│   ├── schema.ts              # 37 entités définies
│   └── migrations/            # Migrations SQL
├── shared/                    # Types partagés
├── package.json               # Dépendances
└── todo.md                    # Suivi des fonctionnalités
```

---

## Points de Test Recommandés

### 1. Architecture et Navigation

- [ ] La sidebar s'affiche correctement
- [ ] Les 9 modules sont visibles dans le menu
- [ ] La navigation entre les modules fonctionne
- [ ] Le redimensionnement de la sidebar fonctionne
- [ ] Le collapse/expand de la sidebar fonctionne
- [ ] Sur mobile, le menu hamburger fonctionne

### 2. Thème et Design

- [ ] Le thème bleu professionnel est appliqué
- [ ] Les couleurs sont cohérentes
- [ ] Les cartes (cards) s'affichent correctement
- [ ] Les boutons ont le bon style
- [ ] Les icônes sont visibles et appropriées
- [ ] Le responsive fonctionne (mobile, tablette, desktop)

### 3. Authentification

- [ ] L'écran de connexion s'affiche
- [ ] La connexion OAuth Manus fonctionne
- [ ] L'utilisateur connecté est affiché dans la sidebar
- [ ] La déconnexion fonctionne
- [ ] Après déconnexion, l'accès aux pages est bloqué

### 4. Multi-tenant

- [ ] L'utilisateur est associé à l'organisation par défaut (ID 1)
- [ ] Les données sont isolées par organisation (à vérifier après CRUD)

### 5. Performance et Stabilité

- [ ] Les pages se chargent rapidement
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs du serveur
- [ ] Le hot-reload fonctionne en mode développement

---

## Problèmes Connus et Limitations

### Limitations Actuelles

1. **Pas de données** : Les modules affichent des indicateurs à 0 car aucune donnée n'est encore créée
2. **CRUD non implémentés** : Les boutons "Nouveau" affichent un toast "Fonctionnalité à venir"
3. **Authentification locale** : OAuth Manus ne fonctionne pas en local sans configuration

### Prochaines Étapes de Développement

Après validation de l'architecture :

1. **Module Organisations** : CRUD complet (organisations, entités, départements, processus)
2. **Module Risques** : CRUD complet (risques, scénarios, impacts, évaluations)
3. **Module Contrôles** : CRUD complet (contrôles, évaluations, preuves)
4. **Autres modules** : CRUD progressifs selon priorités

---

## Support et Contact

Pour toute question ou problème :

1. **Vérifier les logs** :
   - Logs serveur : `.manus-logs/devserver.log`
   - Logs navigateur : `.manus-logs/browserConsole.log`
   - Logs réseau : `.manus-logs/networkRequests.log`

2. **Vérifier l'état du projet** :
   - Dans Manus, ouvrez le panneau "Dashboard"
   - Vérifiez l'état du serveur de développement

3. **Redémarrer le serveur** :
   - Dans Manus, utilisez le bouton "Restart" dans le panneau Dashboard

---

## Checklist de Validation

Avant de passer au développement des CRUD :

- [ ] L'architecture frontend est validée
- [ ] La navigation fonctionne correctement
- [ ] Le thème et le design sont satisfaisants
- [ ] L'authentification fonctionne
- [ ] Les 9 modules sont accessibles
- [ ] Pas de bugs bloquants identifiés
- [ ] Les performances sont acceptables

Une fois cette checklist complétée, vous pouvez demander le développement des fonctionnalités CRUD.

---

## Commandes Utiles

```bash
# Installer les dépendances
pnpm install

# Lancer en mode développement
pnpm dev

# Compiler pour la production
pnpm build

# Lancer en production
pnpm start

# Vérifier les types TypeScript
pnpm check

# Formater le code
pnpm format

# Lancer les tests
pnpm test

# Pousser les migrations de base de données
pnpm db:push
```

---

**Version** : v1.0.0-alpha (Architecture et Navigation)  
**Date** : 2 février 2026  
**Stack** : Next.js 14 + Express + tRPC + Drizzle + MySQL
