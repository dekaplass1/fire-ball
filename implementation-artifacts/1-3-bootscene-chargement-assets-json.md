# Story 1.3 : BootScene — chargement des assets et des données JSON

Status: review

## Story

En tant que joueur,
je veux que le jeu charge tous ses assets rapidement au démarrage,
afin d'accéder à l'écran titre sans attente perceptible, même sur une connexion mobile 4G.

## Acceptance Criteria

1. `BootScene` est la première scène lancée par `main.js` (déjà vrai depuis Story 1.1).
2. `BootScene.preload()` charge via `this.load.json()` les trois fichiers JSON de données (`enemies.json`, `items.json`, `levels.json`) sous leurs clés de cache respectives (`'enemies'`, `'items'`, `'levels'`).
3. `BootScene.preload()` déclare (via `this.load.image()` ou `this.load.spritesheet()`) tous les assets MVP — spritesheets du Guerrier, sprites des 3 ennemis, éléments UI — même si les fichiers physiques sont absents (Phaser logue un warning, ne crash pas).
4. `BootScene.create()` lance `UIScene` en mode parallel via `this.scene.launch(SCENES.UI)`.
5. `BootScene.create()` démarre `TitleScene` via `this.scene.start(SCENES.TITLE)` — ce qui arrête `BootScene`.
6. Les clés de cache JSON (`'enemies'`, `'items'`, `'levels'`) et les clés d'assets sprites sont définies comme constantes dans `src/constants.js` (ajout de `CACHE_KEYS` et `ASSET_KEYS`).
7. Une asset manquante ne bloque pas le démarrage — les scènes suivantes doivent gérer gracieusement l'absence d'un sprite.
8. `npm run build` s'exécute sans erreur après cette story.

## Tasks / Subtasks

- [x] Task 1 : Étendre `src/constants.js` avec les clés de cache et d'assets (AC: 6)
  - [x] Ajouter `export const CACHE_KEYS` : objet avec `ENEMIES`, `ITEMS`, `LEVELS`
  - [x] Ajouter `export const ASSET_KEYS` : objet avec toutes les clés de sprites MVP (Guerrier + 3 ennemis + UI)

- [x] Task 2 : Implémenter `BootScene.preload()` — chargement JSON (AC: 2)
  - [x] Importer les JSON via Vite `?url` en haut du fichier (`import enemiesUrl from '../data/enemies.json?url'`)
  - [x] Appeler `this.load.json(CACHE_KEYS.ENEMIES, enemiesUrl)`, idem pour `ITEMS` et `LEVELS`

- [x] Task 3 : Implémenter `BootScene.preload()` — déclaration des sprites MVP (AC: 3, 7)
  - [x] Déclarer `this.load.spritesheet(ASSET_KEYS.HERO_IDLE, ...)` et `ASSET_KEYS.HERO_ATTACK`
  - [x] Déclarer `this.load.image()` pour les 3 ennemis (`ASSET_KEYS.ENEMY_GOBELIN`, `ENEMY_LOUP`, `ENEMY_OGRE`)
  - [x] Déclarer `this.load.image()` pour les éléments UI (`ASSET_KEYS.BTN_ATTACK`, `ASSET_KEYS.BTN_FLEE`, `ASSET_KEYS.BTN_ITEM`)

- [x] Task 4 : Implémenter `BootScene.create()` — lancement des scènes (AC: 4, 5)
  - [x] Appeler `this.scene.launch(SCENES.UI)` — UIScene en parallel
  - [x] Appeler `this.scene.start(SCENES.TITLE)` — transition vers TitleScene

- [x] Task 5 : Valider build et comportement (AC: 8)
  - [x] `npm run build` → aucune erreur (5.24s, 15 modules transformés)
  - [x] `npm run dev` → aucune erreur console critique (les warnings d'assets manquants sont acceptables)

## Dev Notes

### Mécanisme de chargement JSON — Vite `?url` (critique)

Les JSON de données sont dans `src/data/` (créés à Story 1.2). Phaser's `this.load.json()` attend une URL réseau, pas un import ES module. En Vite, le suffixe `?url` convertit un import en URL résolue correctement en dev et en prod :

```js
// En haut de BootScene.js — imports URL (pas d'import JSON direct)
import enemiesUrl from '../data/enemies.json?url';
import itemsUrl from '../data/items.json?url';
import levelsUrl from '../data/levels.json?url';
```

En dev, Vite retourne `/src/data/enemies.json`. En prod, le chemin hasché correct dans `dist/`. Sans `?url`, les fichiers ne seraient pas accessibles par le loader réseau de Phaser.

**Ne PAS faire :**
```js
// ❌ Import direct — donne un objet JS, pas une URL
import enemies from '../data/enemies.json';
this.load.json('enemies', enemies); // FAUX - attend une URL
```

### Accès aux données chargées depuis les scènes suivantes

Une fois BootScene terminée, les données JSON sont disponibles dans le cache Phaser depuis n'importe quelle scène :

```js
// Depuis n'importe quelle scène Phaser, après BootScene
import { CACHE_KEYS } from '../constants.js';

const enemies = this.cache.json.get(CACHE_KEYS.ENEMIES); // array d'objets ennemi
const items   = this.cache.json.get(CACHE_KEYS.ITEMS);
const levels  = this.cache.json.get(CACHE_KEYS.LEVELS);
```

### `constants.js` — ajouts attendus

```js
// Ajouter à src/constants.js (ne pas toucher aux exports existants)

export const CACHE_KEYS = {
  ENEMIES: 'enemies',
  ITEMS:   'items',
  LEVELS:  'levels',
};

export const ASSET_KEYS = {
  // Héros
  HERO_IDLE:     'hero-idle',
  HERO_ATTACK:   'hero-attack',
  // Ennemis
  ENEMY_GOBELIN: 'enemy-gobelin',
  ENEMY_LOUP:    'enemy-loup',
  ENEMY_OGRE:    'enemy-ogre',
  // UI combat
  BTN_ATTACK:    'btn-attack',
  BTN_FLEE:      'btn-flee',
  BTN_ITEM:      'btn-item',
  // Fond de scène
  BG_COMBAT:     'bg-combat',
};
```

### `BootScene.js` — implémentation complète attendue

```js
// src/scenes/BootScene.js
import { SCENES, CACHE_KEYS, ASSET_KEYS } from '../constants.js';

import enemiesUrl from '../data/enemies.json?url';
import itemsUrl   from '../data/items.json?url';
import levelsUrl  from '../data/levels.json?url';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {
    // Données JSON de jeu
    this.load.json(CACHE_KEYS.ENEMIES, enemiesUrl);
    this.load.json(CACHE_KEYS.ITEMS,   itemsUrl);
    this.load.json(CACHE_KEYS.LEVELS,  levelsUrl);

    // Sprites héros (fichiers absents jusqu'à Story 2.3 — warning Phaser accepté)
    this.load.spritesheet(ASSET_KEYS.HERO_IDLE,   'assets/sprites/hero/idle.png',   { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(ASSET_KEYS.HERO_ATTACK, 'assets/sprites/hero/attack.png', { frameWidth: 64, frameHeight: 64 });

    // Sprites ennemis
    this.load.image(ASSET_KEYS.ENEMY_GOBELIN, 'assets/sprites/enemies/gobelin.png');
    this.load.image(ASSET_KEYS.ENEMY_LOUP,    'assets/sprites/enemies/loup.png');
    this.load.image(ASSET_KEYS.ENEMY_OGRE,    'assets/sprites/enemies/ogre.png');

    // UI combat
    this.load.image(ASSET_KEYS.BTN_ATTACK, 'assets/ui/btn-attack.png');
    this.load.image(ASSET_KEYS.BTN_FLEE,   'assets/ui/btn-flee.png');
    this.load.image(ASSET_KEYS.BTN_ITEM,   'assets/ui/btn-item.png');

    // Fond de scène combat
    this.load.image(ASSET_KEYS.BG_COMBAT, 'assets/sprites/backgrounds/bg-combat.png');
  }

  create() {
    this.scene.launch(SCENES.UI);    // UIScene en mode parallel (HUD persistent)
    this.scene.start(SCENES.TITLE);  // Transition vers TitleScene (arrête BootScene)
  }
}
```

### Ordre launch / start dans `create()`

`this.scene.launch(SCENES.UI)` doit être appelé **avant** `this.scene.start(SCENES.TITLE)`. `start()` arrête la scène courante (BootScene), ce qui peut interrompre les appels suivants si UIScene n'est pas encore lancée. L'ordre est donc :
1. `launch(UI)` — UIScene tourne en arrière-plan, indépendante
2. `start(TITLE)` — BootScene → TitleScene (UIScene reste active)

### Assets manquants — comportement Phaser 4

Phaser 4 (comme Phaser 3) logue un `404 Not Found` en console pour chaque asset manquant mais **ne lève pas d'exception**. Les scènes qui tentent d'afficher un sprite non chargé affichent simplement rien (ou un placeholder vide). Ce comportement est intentionnel pour cette story — les assets réels arrivent à Story 2.3.

**Les warnings en dev sont donc NORMAUX pour cette story.** Ne pas les traiter comme des erreurs.

### Dimensions des spritesheets (provisoire)

Les `frameWidth: 64, frameHeight: 64` dans `this.load.spritesheet()` sont des valeurs provisoires. Elles seront ajustées à Story 2.3 quand les vrais sprites seront disponibles. L'important est que la déclaration existe pour que Phaser enregistre la clé.

### Ce que cette story ne fait PAS

- **Pas de barre de progression** — pas dans l'épic MVP, ajout post-MVP si souhaité
- **Pas de splash screen** — BootScene est instantanée en dev (assets absents = load immédiat)
- **UIScene non implémentée** — son stub existant suffit pour `launch()`. L'implémentation réelle est à Story 1.6
- **TitleScene non implémentée** — son stub existant reçoit le `start()`. Story 1.4 l'implémente

### Dépendances aval de cette story

| Story | Ce qui dépend de BootScene 1.3 |
|-------|-------------------------------|
| 1.4 (TitleScene) | Reçoit le `scene.start(SCENES.TITLE)` de BootScene |
| 1.6 (UIScene) | Reçoit le `scene.launch(SCENES.UI)` de BootScene |
| 2.1 (CombatEngine) | Lira `this.cache.json.get(CACHE_KEYS.ENEMIES)` |
| 2.2 (CombatScene) | Utilisera `ASSET_KEYS.HERO_IDLE`, `ASSET_KEYS.ENEMY_*` |
| 4.1 (ShopScene) | Lira `this.cache.json.get(CACHE_KEYS.ITEMS)` |

### Project Structure Notes

Fichiers **modifiés** (UPDATE) :
- `src/constants.js` — ajout de `CACHE_KEYS` et `ASSET_KEYS` (ne pas toucher aux exports existants)
- `src/scenes/BootScene.js` — stub → implémentation complète

Fichiers **non touchés** :
- `src/data/*.json`, `src/state/GameState.js`, autres scènes, `src/main.js`

### References

- Architecture — section "Organisation des assets" : `planning-artifacts/architecture.md#organisation-des-assets`
- Architecture — section "Flux de données & points d'intégration" : `planning-artifacts/architecture.md#flux-de-données`
- Architecture — pattern de transition : `this.scene.start(SCENES.MAP)` / `this.scene.launch(SCENES.UI)`
- Épics — Story 1.3 : `planning-artifacts/epics.md#story-13`
- Story 1.1 complétée : `implementation-artifacts/1-1-init-projet-phaser4-vite-structure.md`
- Story 1.2 complétée : `implementation-artifacts/1-2-gamestate-skeleton-json-donnees.md`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- Build : 15 modules transformés (vs 12 avant) — les 3 imports `?url` JSON + CACHE_KEYS + ASSET_KEYS ajoutent des modules au graphe Vite. Comportement attendu.
- Warning chunk Phaser (~1.35 MB / 349 kB gzippé) : identique aux stories précédentes, acceptable.

### Completion Notes List

- `CACHE_KEYS` (`ENEMIES`, `ITEMS`, `LEVELS`) et `ASSET_KEYS` (9 clés) ajoutés à `constants.js` sans toucher aux exports existants.
- `BootScene.preload()` charge les 3 JSON via import Vite `?url` (URL résolue correctement en dev et prod) + déclare tous les sprites MVP.
- `BootScene.create()` lance `UIScene` en parallel puis démarre `TitleScene` (ordre intentionnel : launch avant start).
- Assets sprites absents → warnings Phaser en console, aucun crash. Comportement conforme AC 7.
- `npm run build` → ✅ 5.24s, 0 erreur.

### File List

- `src/constants.js`
- `src/scenes/BootScene.js`

### Change Log

| Date | Changement |
|------|-----------|
| 2026-05-01 | Story créée — prête pour implémentation |
| 2026-05-01 | Implémentation complète — status → review |
