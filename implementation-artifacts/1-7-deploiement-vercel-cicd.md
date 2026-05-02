# Story 1.7 : Déploiement Vercel + CI/CD GitHub

Status: ready-for-dev

## Story

En tant que joueur,
Je veux accéder au jeu via un lien stable et toujours à jour,
Afin de jouer à la dernière version sans avoir à installer quoi que ce soit.

## Acceptance Criteria

1. Le dépôt GitHub étant connecté à un projet Vercel Hobby, un commit poussé sur `main` déclenche automatiquement un nouveau déploiement.
2. Le déploiement produit un build statique (`npm run build`) sans erreur et publie le contenu de `dist/` sur l'URL Vercel du projet.
3. L'URL de production est accessible depuis Chrome Android et Safari iOS sans erreur.
4. Aucun backend, fonction serverless ou variable d'environnement secrète n'est requis — déploiement entièrement statique.

## Tasks / Subtasks

- [x] Tâche 1 : Créer `vercel.json` à la racine du projet (AC: 1, 2, 4)
  - [x] Créer `vercel.json` avec `buildCommand`, `outputDirectory`, `framework: null`
  - [x] Vérifier que `npm run build` passe toujours sans erreur après ajout du fichier
- [ ] Tâche 2 : Connecter le dépôt GitHub à Vercel — **étape manuelle** (AC: 1)
  - [ ] Se connecter sur [vercel.com](https://vercel.com) avec le compte Vercel Hobby
  - [ ] Créer un nouveau projet → "Import Git Repository" → sélectionner `fire-ball`
  - [ ] Vérifier que Vercel détecte bien `npm run build` et `dist/` (ou accepter les valeurs de `vercel.json`)
  - [ ] Laisser toutes les variables d'environnement vides (aucune requise)
  - [ ] Déclencher le premier déploiement
- [ ] Tâche 3 : Valider le déploiement (AC: 2, 3, 4)
  - [ ] Confirmer que le build Vercel réussit dans le dashboard (logs sans erreur)
  - [ ] Ouvrir l'URL de production sur Chrome Android et Safari iOS — le canvas Phaser doit s'afficher
  - [ ] Vérifier qu'il n'y a aucune requête réseau vers un backend (tout servi statiquement)
- [ ] Tâche 4 : Valider le CI/CD (AC: 1)
  - [ ] Pousser un commit trivial (ex. espace dans un commentaire) sur `main`
  - [ ] Confirmer dans le dashboard Vercel qu'un nouveau déploiement se déclenche automatiquement

## Dev Notes

### Fichier à créer

**`vercel.json`** à la racine du projet (seul fichier de code à modifier/créer).

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

- `framework: null` : empêche Vercel d'auto-détecter un framework et de surcharger les paramètres.
- `buildCommand` : correspond au script `"build": "vite build --config vite/config.prod.mjs"` de `package.json`.
- `outputDirectory` : correspond à `build.outDir: 'dist'` dans `vite/config.prod.mjs`.

### Configuration Vite prod — vérifications importantes

`vite/config.prod.mjs` utilise `base: './'` — les chemins dans `dist/index.html` seront relatifs (`./assets/...`). Cela fonctionne correctement sur Vercel quand le projet est servi à la racine du domaine (`https://xxx.vercel.app/`).

**Ne pas changer `base`** — `'./'` est intentionnel et validé par les builds précédents.

### Structure dist produite par le build

```
dist/
├── index.html
└── assets/
    ├── index-[hash].js     (~7 kB gzip: 2.5 kB)
    └── phaser-[hash].js    (~1.3 MB gzip: 350 kB)
```

Tout statique, aucun fichier serveur requis.

### .gitignore — `dist/` exclu (correct)

`dist/` est dans `.gitignore` : Vercel exécute lui-même `npm run build` lors du déploiement, il ne faut **pas** committer le dossier `dist/`.

### Vercel Hobby — plan gratuit

Plan gratuit permanent pour les projets statiques. Aucune carte bancaire requise. Limites non contraignantes pour ce MVP (bande passante, builds/mois).

### Étapes manuelles Vercel (interface web)

Cette story nécessite des actions dans le dashboard Vercel qui ne peuvent pas être automatisées :

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. "Import Git Repository" → connecter le compte GitHub si pas déjà fait → sélectionner `fire-ball`
3. **Build & Output Settings** :
   - Framework Preset : **Other** (ou Vite si proposé)
   - Build Command : `npm run build` ✓
   - Output Directory : `dist` ✓
   - Install Command : `npm install` ✓
4. Environment Variables : laisser vide
5. Cliquer "Deploy"

Si `vercel.json` est présent et poussé sur `main` avant la connexion, Vercel utilisera automatiquement les valeurs qu'il contient.

### Node.js version

Vercel utilise Node.js 20.x par défaut — compatible avec Vite 6.4.2 et les dépendances du projet.

### Anti-patterns à éviter

- ❌ NE PAS committer `dist/` — Vercel construit lui-même
- ❌ NE PAS ajouter de fonctions serverless (`/api/`, `vercel.json` routes) — statique uniquement
- ❌ NE PAS modifier `base` dans `vite/config.prod.mjs`
- ❌ NE PAS ajouter de variables d'environnement inutiles

### Project Structure Notes

- Seul `vercel.json` (nouveau) est ajouté à la racine.
- Aucun fichier source `src/` modifié.
- Architecture confirme : `vercel.json` minimal à la racine [Source: architecture.md ligne 280, 396]

### References

- [Épics Story 1.7](planning-artifacts/epics.md) — lignes 258–275
- [Architecture déploiement](planning-artifacts/architecture.md) — lignes 99, 159–160, 278–280, 396
- [Vite prod config](vite/config.prod.mjs) — `base: './'`, `outDir: 'dist'`
- [package.json scripts](package.json) — `"build": "vite build --config vite/config.prod.mjs"`
- [.gitignore](.gitignore) — `dist/` exclu

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

Build prod validé en 5.64s après ajout de `vercel.json`.

### Completion Notes List

- `vercel.json` créé à la racine avec `buildCommand: "npm run build"`, `outputDirectory: "dist"`, `framework: null`.
- Build `npm run build` confirmé sans erreur (warning bundle Phaser attendu, non bloquant).
- Tâches 2–4 requièrent des actions manuelles dans le dashboard Vercel (connexion GitHub, premier déploiement, vérification mobile, test CI/CD) — à compléter par Sumio.

### Change Log

- 2026-05-02 : Création de `vercel.json` (Tâche 1 complète). Tâches 2–4 en attente d'actions manuelles Vercel.

### File List

- `vercel.json` — créé (configuration déploiement Vercel statique)
