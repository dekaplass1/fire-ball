# Story 1.2 : GameState skeleton + fichiers JSON de données

Status: review

## Story

En tant que joueur,
je veux que mes données de jeu (ennemis, objets, seuils de niveau) soient chargées et que ma progression puisse être sauvegardée et restaurée,
afin de retrouver mon état exact à chaque retour dans le jeu.

## Acceptance Criteria

1. `src/state/GameState.js` est un singleton JS pur (objet littéral exporté par défaut) — **aucun import Phaser**.
2. `GameState.save()` sérialise l'état du héros et l'écrit dans `localStorage` sous la clé `fireball-save` dans un `try/catch` silencieux.
3. `GameState.load()` désérialise et restaure l'état depuis `localStorage` si la clé existe ; retourne `null` silencieusement si la clé est absente ou si le JSON est invalide.
4. `GameState.reset()` remet tous les champs à leurs valeurs initiales et supprime la clé `localStorage` (`removeItem`).
5. `GameState.hasSave()` retourne `true` si une sauvegarde valide est présente dans `localStorage`, `false` sinon (utilisé par TitleScene pour activer le bouton "Continuer").
6. `src/data/enemies.json` contient un tableau de 3 ennemis MVP avec les champs : `id`, `name`, `hp`, `atk`, `def`, `xpReward`, `gilsReward`, `minLevel`.
7. `src/data/items.json` contient le catalogue boutique avec les champs : `id`, `name`, `price`, `effect`, `effectValue`, `description`.
8. `src/data/levels.json` contient les données de progression par niveau (1 à `MAX_LEVEL = 10`) avec les champs : `level`, `xpRequired`, `xpToNext`, `maxHp`, `atk`, `def`.
9. `GameState` est importable depuis n'importe quelle scène via `import GameState from '../state/GameState.js'` sans dépendance circulaire.
10. `npm run build` s'exécute sans erreur après l'implémentation de cette story.

## Tasks / Subtasks

- [x] Task 1 : Implémenter `GameState.js` complet (AC: 1, 2, 3, 4, 5, 9)
  - [x] Définir `_initialHeroState` comme objet interne (source de vérité pour `reset()`)
  - [x] Initialiser le singleton avec `hero` (copie de `_initialHeroState`) et `inventory: []`
  - [x] Implémenter `save()` : `JSON.stringify` + `localStorage.setItem(SAVE_KEY, ...)` dans `try/catch` silencieux
  - [x] Implémenter `load()` : `localStorage.getItem(SAVE_KEY)` → `JSON.parse` dans `try/catch` silencieux → appliquer au state si valide → retourner `null` si échec
  - [x] Implémenter `reset()` : copier `_initialHeroState` dans `this.hero`, vider `this.inventory`, appeler `localStorage.removeItem(SAVE_KEY)`
  - [x] Implémenter `hasSave()` : retourner `localStorage.getItem(SAVE_KEY) !== null`
  - [x] Vérifier absence totale d'imports Phaser dans le fichier

- [x] Task 2 : Remplir `src/data/enemies.json` (AC: 6)
  - [x] Créer 3 ennemis MVP : Gobelin (facile, niveaux 1+), Loup (moyen, niveaux 2+), Ogre (difficile, niveaux 4+)
  - [x] Vérifier que les stats sont différenciées et cohérentes avec les stats héros niveau 1 (`hp: 30`, `atk: 8`, `def: 4`)

- [x] Task 3 : Remplir `src/data/items.json` (AC: 7)
  - [x] Créer au moins 2 objets utilisables en combat : Potion (heal 20 HP) et Grande Potion (heal 50 HP)
  - [x] Vérifier que les prix sont cohérents avec les récompenses en Gils des ennemis

- [x] Task 4 : Remplir `src/data/levels.json` (AC: 8)
  - [x] Créer 10 entrées (niveaux 1 à 10)
  - [x] Vérifier que la courbe de progression XP est raisonnable (niveaux 1-5 atteignables dans la session MVP)
  - [x] `xpToNext` vaut `null` au niveau 10 (niveau maximum)

- [x] Task 5 : Valider l'intégration (AC: 10)
  - [x] `npm run build` → aucune erreur (5.71s, dist/ produit)
  - [x] `npm run dev` → aucune erreur console (les imports GameState ne créent pas de boucle)

## Dev Notes

### GameState.js — implémentation complète attendue

```js
// src/state/GameState.js
// Singleton JS pur — PAS une Phaser.Scene, AUCUN import Phaser

import { SAVE_KEY } from '../constants.js';

const _initialHeroState = {
  name: 'Guerrier',
  level: 1,
  xp: 0,
  gils: 50,
  hp: 30,
  maxHp: 30,
  atk: 8,
  def: 4,
  skillPoints: 0,
};

const GameState = {
  hero: { ..._initialHeroState },
  inventory: [],

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        hero: this.hero,
        inventory: this.inventory,
      }));
    } catch (e) {
      // silencieux — le jeu continue en mémoire
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.hero) return null;
      this.hero = data.hero;
      this.inventory = data.inventory ?? [];
      return data;
    } catch (e) {
      return null;
    }
  },

  reset() {
    this.hero = { ..._initialHeroState };
    this.inventory = [];
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      // silencieux
    }
  },

  hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (e) {
      return false;
    }
  },
};

export default GameState;
```

**Points critiques :**
- `_initialHeroState` est un objet interne (non exporté) — `reset()` en fait un spread pour éviter la mutation de référence.
- `load()` restaure `this.hero` et `this.inventory` directement (mutation du singleton). Pas de retour de copie.
- `hasSave()` enveloppé dans `try/catch` pour les navigateurs qui bloquent `localStorage` en navigation privée.
- `save()` ne sauvegarde PAS les données de jeu statiques (ennemis, items, levels) — ces fichiers JSON sont gérés par BootScene.

### Données initiales du héros (niveau 1)

| Stat | Valeur | Raison |
|------|--------|--------|
| `hp` / `maxHp` | 30 | Permet ~3-4 coups de Gobelin avant défaite |
| `atk` | 8 | Tue un Gobelin (15 HP) en ~2 attaques |
| `def` | 4 | Réduit légèrement les dégâts ennemis |
| `gils` | 50 | Starter budget — peut acheter 1 Potion (30 Gils) |
| `skillPoints` | 0 | Attribués après montée de niveau (Story 3.2) |

### enemies.json — données attendues

```json
[
  {
    "id": "gobelin",
    "name": "Gobelin",
    "hp": 15,
    "atk": 5,
    "def": 2,
    "xpReward": 15,
    "gilsReward": 8,
    "minLevel": 1
  },
  {
    "id": "loup",
    "name": "Loup",
    "hp": 25,
    "atk": 8,
    "def": 3,
    "xpReward": 30,
    "gilsReward": 15,
    "minLevel": 2
  },
  {
    "id": "ogre",
    "name": "Ogre",
    "hp": 45,
    "atk": 13,
    "def": 6,
    "xpReward": 60,
    "gilsReward": 28,
    "minLevel": 4
  }
]
```

**Note sur `minLevel` :** utilisé par `CombatEngine.initCombat(level)` (Story 2.1) pour filtrer les ennemis éligibles à un niveau donné. Ce champ est définitif dès maintenant pour éviter une réécriture des JSON à Story 2.1.

### items.json — données attendues

```json
[
  {
    "id": "potion",
    "name": "Potion",
    "price": 30,
    "effect": "heal",
    "effectValue": 20,
    "description": "Restaure 20 PV."
  },
  {
    "id": "grande-potion",
    "name": "Grande Potion",
    "price": 80,
    "effect": "heal",
    "effectValue": 50,
    "description": "Restaure 50 PV."
  }
]
```

**Note :** Le champ `effect` est une chaîne enum. La seule valeur MVP est `"heal"`. CombatScene (Story 2.2) et ShopScene (Story 4.1) consomment ce champ pour appliquer l'effet.

### levels.json — données attendues

```json
[
  { "level": 1,  "xpRequired": 0,    "xpToNext": 100,  "maxHp": 30,  "atk": 8,  "def": 4  },
  { "level": 2,  "xpRequired": 100,  "xpToNext": 250,  "maxHp": 36,  "atk": 9,  "def": 5  },
  { "level": 3,  "xpRequired": 250,  "xpToNext": 450,  "maxHp": 43,  "atk": 11, "def": 5  },
  { "level": 4,  "xpRequired": 450,  "xpToNext": 700,  "maxHp": 51,  "atk": 12, "def": 6  },
  { "level": 5,  "xpRequired": 700,  "xpToNext": 1000, "maxHp": 60,  "atk": 14, "def": 7  },
  { "level": 6,  "xpRequired": 1000, "xpToNext": 1350, "maxHp": 70,  "atk": 16, "def": 8  },
  { "level": 7,  "xpRequired": 1350, "xpToNext": 1750, "maxHp": 81,  "atk": 18, "def": 9  },
  { "level": 8,  "xpRequired": 1750, "xpToNext": 2200, "maxHp": 93,  "atk": 20, "def": 10 },
  { "level": 9,  "xpRequired": 2200, "xpToNext": 2700, "maxHp": 106, "atk": 22, "def": 11 },
  { "level": 10, "xpRequired": 2700, "xpToNext": null, "maxHp": 120, "atk": 25, "def": 12 }
]
```

**Note :** `xpToNext: null` au niveau 10 signale le plafond (`MAX_LEVEL`). La logique de montée de niveau (Story 3.2) doit gérer ce cas.

### Ce que cette story ne fait PAS

- **N'implémente pas** la logique de montée de niveau (Story 3.2) — `skillPoints` est juste un champ dans `hero`.
- **N'implémente pas** le chargement des JSON dans BootScene (Story 1.3) — les fichiers JSON existent seulement en tant que fichiers statiques après cette story.
- **N'implémente pas** `CombatEngine` (Story 2.1) — son stub reste inchangé.
- **Ne touche pas** aux scènes existantes — aucune scène n'appelle encore `GameState.save()` ou `GameState.load()`.

### Dépendances et utilisation en aval

| Story | Comment GameState est utilisé |
|-------|-------------------------------|
| 1.3 (BootScene) | Charge les JSON via `this.load.json()` — indépendant de GameState |
| 1.4 (TitleScene) | Appelle `GameState.hasSave()` pour activer "Continuer", puis `GameState.load()` ou `GameState.reset()` |
| 2.1 (CombatEngine) | Lit `GameState.hero.atk`, `GameState.hero.def`, etc. |
| 3.1 (Récompenses) | Modifie `GameState.hero.xp` et `GameState.hero.gils`, puis appelle `GameState.save()` |
| 4.1 (ShopScene) | Modifie `GameState.inventory` et `GameState.hero.gils`, puis appelle `GameState.save()` |
| 5.3 (Reset) | Appelle `GameState.reset()` |

### Aucun test automatisé pour cette story

La validation se fait manuellement :
1. Ouvrir la console DevTools → `import('/src/state/GameState.js')` puis tester `.save()`, `.load()`, `.reset()`, `.hasSave()`.
2. `npm run build` → aucune erreur.

Les tests unitaires formels (si ajoutés) appartiennent à une story dédiée.

### Rappels de conventions (à ne pas violer)

- Import de `SAVE_KEY` depuis `../constants.js` — jamais de chaîne magique dans GameState.
- `GameState` ne doit jamais importer directement une scène ou `Phaser`.
- Pas de `console.log`, `console.warn` ou `console.error` dans le code de production — les erreurs localStorage sont silencieuses.

### Project Structure Notes

Fichiers **modifiés** (UPDATE) :
- `src/state/GameState.js` — stub → implémentation complète
- `src/data/enemies.json` — `[]` → données réelles
- `src/data/items.json` — `[]` → données réelles
- `src/data/levels.json` — `[]` → données réelles

Fichiers **non touchés** dans cette story :
- `src/main.js`, `src/constants.js`, toutes les scènes, `CombatEngine.js`
- Aucun nouveau fichier créé

### References

- Architecture — section "Architecture des données" : `planning-artifacts/architecture.md#architecture-des-données`
- Architecture — section "Persistance" : `planning-artifacts/architecture.md#persistance`
- Architecture — section "Patterns de gestion d'erreurs" : `planning-artifacts/architecture.md#patterns-de-gestion-derreurs`
- Epics — Story 1.2 : `planning-artifacts/epics.md#story-12`
- CLAUDE.md — rappels save/load/reset + décisions MVP
- Story 1.1 complétée : `implementation-artifacts/1-1-init-projet-phaser4-vite-structure.md`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- Build warning chunk Phaser (~1.35 MB / 349 kB gzippé) : attendu et acceptable — bien sous le NFR 10 MB. Identique à Story 1.1.

### Completion Notes List

- `GameState.js` implémenté en singleton JS pur : `save()`, `load()`, `reset()`, `hasSave()` — zéro import Phaser.
- `_initialHeroState` défini comme objet interne non exporté ; `reset()` en fait un spread pour éviter la mutation de référence.
- `hasSave()` ajouté (non prévu dans l'épic original, mais requis implicitement par Story 1.4 pour activer le bouton "Continuer").
- `enemies.json` : 3 ennemis différenciés (Gobelin/Loup/Ogre) avec champ `minLevel` anticipant `CombatEngine.initCombat(level)` (Story 2.1).
- `items.json` : 2 objets de soin (Potion +20 HP / Grande Potion +50 HP), champ `effect` en enum `"heal"` pour Stories 2.2 et 4.1.
- `levels.json` : 10 niveaux, courbe XP douce, `xpToNext: null` au niveau 10.
- `npm run build` → ✅ dist/ produit en 5.71s, 0 erreur.

### File List

- `src/state/GameState.js`
- `src/data/enemies.json`
- `src/data/items.json`
- `src/data/levels.json`

### Change Log

| Date | Changement |
|------|-----------|
| 2026-05-01 | Story créée — prête pour implémentation |
| 2026-05-01 | Implémentation complète — status → review |
