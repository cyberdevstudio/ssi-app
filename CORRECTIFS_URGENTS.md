# Correctifs Urgents - Erreurs d'Inscription et Variables d'Environnement

## 🔴 Problèmes Identifiés

### 1. Erreur d'inscription (NaN)
**Symptôme** : `DrizzleQueryError: Failed query... params: NaN,1`

**Cause** : `result.insertId` retourne un `bigint` qui n'est pas correctement converti en `number`.

**Solution** : Fichier `server/localAuth.ts` corrigé (lignes 106-113)

### 2. Variables d'environnement manquantes
**Symptôme** : Erreurs répétées `%VITE_ANALYTICS_ENDPOINT% is not defined`

**Cause** : Fichier `.env` incomplet ou manquant.

**Solution** : Créer un fichier `.env` complet (voir `ENV_LOCAL_TEMPLATE.md`)

### 3. Script analytics malformé
**Symptôme** : `Malformed URI sequence in request URL: /%VITE_ANALYTICS_ENDPOINT%/umami`

**Cause** : Script analytics chargé même sans variables d'environnement.

**Solution** : Fichier `client/index.html` corrigé (lignes 20-29)

---

## 🛠️ Instructions de Correction

### Étape 1 : Mettre à jour `server/localAuth.ts`

**Remplacez les lignes 106-113** par :

```typescript
// MySQL insertId is a bigint, convert properly
const userId = typeof result.insertId === 'bigint' 
  ? Number(result.insertId) 
  : parseInt(String(result.insertId), 10);

if (isNaN(userId)) {
  return { success: false, error: "Failed to get user ID after creation" };
}

// Fetch created user
const newUser = await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
```

### Étape 2 : Créer/Mettre à jour le fichier `.env`

**Créez un fichier `.env` à la racine du projet** avec ce contenu :

```env
# Configuration de Base de Données
DATABASE_URL=mysql://sysadmin:vesta@localhost:3306/ssi_grc

# Configuration JWT
JWT_SECRET=cdeb6dc0-1bcf-4001-a3c1-85197edb7db12b0d24ff-2782-47e5-a0e1-0fe02b60ab1d

# Configuration de l'Application
VITE_APP_TITLE=Portail SSI & Gouvernance GRC

# Configuration OAuth (Optionnel - laissez vide pour auth locale uniquement)
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
VITE_APP_ID=
OWNER_OPEN_ID=
OWNER_NAME=

# Configuration Analytics (Optionnel - laissez vide si non utilisé)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# Configuration API Forge (Optionnel - laissez vide si non utilisé)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_URL=

# Configuration Serveur
NODE_ENV=development
PORT=3000
```

### Étape 3 : Mettre à jour `client/index.html`

**Remplacez les lignes 20-23** par :

```html
<!-- Analytics (Umami) - Only loads if environment variables are set -->
<script>
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT && import.meta.env.VITE_ANALYTICS_WEBSITE_ID) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = import.meta.env.VITE_ANALYTICS_ENDPOINT + '/umami';
    script.setAttribute('data-website-id', import.meta.env.VITE_ANALYTICS_WEBSITE_ID);
    document.body.appendChild(script);
  }
</script>
```

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
pnpm dev
```

---

## ✅ Vérification

Après avoir appliqué ces correctifs :

1. **Aucune erreur de variables d'environnement** dans la console
2. **L'inscription fonctionne** sans erreur `NaN`
3. **La connexion fonctionne** correctement
4. **L'application charge** sans erreur

---

## 📝 Résumé des Fichiers Modifiés

| Fichier | Modification | Raison |
|---------|--------------|--------|
| `server/localAuth.ts` | Correction conversion `insertId` | Résoudre erreur NaN |
| `.env` | Création/Mise à jour | Définir toutes les variables |
| `client/index.html` | Script analytics conditionnel | Éviter erreur URL malformée |

---

## 🚀 Prochaines Étapes

Une fois ces correctifs appliqués :

1. **Testez l'inscription** : Créez un nouveau compte
2. **Testez la connexion** : Connectez-vous avec le compte créé
3. **Vérifiez la navigation** : Accédez aux différents modules
4. **Poussez sur GitHub** : `git add . && git commit -m "fix: inscription et variables env" && git push`

---

## 📞 Support

Si vous rencontrez encore des problèmes après avoir appliqué ces correctifs, vérifiez :

1. **Le fichier `.env` existe** à la racine du projet
2. **Les variables sont bien définies** (même vides pour les optionnelles)
3. **Le serveur a été redémarré** après les modifications
4. **La base de données est accessible** avec les identifiants fournis
