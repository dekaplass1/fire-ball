# Story 1.1 : Init projet Phaser 4 + Vite + structure des dossiers

Status: review

## Story

En tant que joueur,
je veux pouvoir ouvrir Fire Ball dans mon navigateur mobile via un lien,
afin de jouer sans installation ni friction technique.

## Acceptance Criteria

1. Le projet est initialisé via `npm create @phaserjs/game@latest` (Phaser 4 → Vite → JavaScript).
2. Un canvas Phaser 4 s'affiche sans erreur dans Chrome Android et Safari iOS (dernières 2 versions).
3. `src/` contient : `main.js`, `constants.js`, `state/GameState.js`, `systems/CombatEngine.js`, tous les fichiers de scènes stubs, `data/`.
4. `src/constants.js` exporte `SAVE_KEY`, `SCENES` et `MAX_LEVEL`.
5. `npm run build` produit un `dist/` statique valide sans erreur.

## Tasks / Subtasks

- [x] Task 1 : Initialiser le projet Phaser 4 via CLI (AC: 1, 2)
  - [x] Exécuter `npm create @phaserjs/game@latest` — nommer le projet `fire-ball`, sélectionner **Phaser 4**, **Vite**, **JavaScript**
  - [x] Vérifier que `npm install` et `npm run dev` s'exécutent sans erreur
  - [x] Confirmer qu'un canvas Phaser s'affiche dans le navigateur (localhost)

- [x] Task 2 : Restructurer `src/` selon l'architecture (AC: 3)
  - [x] Supprimer les fichiers de démo du template (ex. `src/scenes/Boot.js`, `src/scenes/Game.js`, ou équivalent selon le template)
  - [x] Créer les dossiers manquants : `src/state/`, `src/systems/`, `src/scenes/`, `src/data/`
  - [x] Mettre à jour `public/assets/` si le template y place des assets de démo (garder le dossier, supprimer les fichiers inutiles)

- [x] Task 3 : Créer `src/constants.js` (AC: 4)
  - [x] Exporter `SAVE_KEY = 'fireball-save'`
  - [x] Exporter `SCENES` : objet avec une clé par scène (ex. `BOOT: 'BootScene'`, `TITLE: 'TitleScene'`, etc.)
  - [x] Exporter `MAX_LEVEL` (valeur initiale suggérée : 10)

- [x] Task 4 : Mettre à jour `src/main.js` (AC: 1, 2)
  - [x] Importer toutes les scènes stubs depuis `src/scenes/`
  - [x] Configurer l'objet `Phaser.Game` : `type: Phaser.AUTO`, `width`, `height`, `scene: [BootScene, TitleScene, MapScene, CombatScene, ShopScene, GameOverScene, UIScene]`
  - [x] Lancer `BootScene` en premier (première entrée du tableau `scene`)

- [x] Task 5 : Créer les stubs de scènes (AC: 3)
  - [x] `src/scenes/BootScene.js` — classe étendant `Phaser.Scene`, clé `SCENES.BOOT`, méthodes `preload()` et `create()` vides
  - [x] `src/scenes/TitleScene.js` — même pattern, clé `SCENES.TITLE`
  - [x] `src/scenes/MapScene.js` — clé `SCENES.MAP`
  - [x] `src/scenes/CombatScene.js` — clé `SCENES.COMBAT`
  - [x] `src/scenes/ShopScene.js` — clé `SCENES.SHOP`
  - [x] `src/scenes/GameOverScene.js` — clé `SCENES.GAME_OVER`
  - [x] `src/scenes/UIScene.js` — clé `SCENES.UI` (sera lancée en mode `parallel` dans les stories suivantes)

- [x] Task 6 : Créer les stubs `GameState.js` et `CombatEngine.js` (AC: 3)
  - [x] `src/state/GameState.js` — singleton JS pur (export default d'un objet littéral), méthodes vides : `save()`, `load()`, `reset()`
  - [x] `src/systems/CombatEngine.js` — module JS pur, **aucun import Phaser**, méthode stub : `resolveTurn(action)` retournant `null`

- [x] Task 7 : Créer les fichiers JSON de données (AC: 3)
  - [x] `src/data/enemies.json` — tableau vide `[]` (données réelles à Story 1.2)
  - [x] `src/data/items.json` — tableau vide `[]`
  - [x] `src/data/levels.json` — tableau vide `[]`

- [x] Task 8 : Valider le build et le rendu (AC: 2, 5)
  - [x] `npm run build` s'exécute sans erreur et produit `dist/`
  - [x] Canvas Phaser 4 visible sans erreur console dans le navigateur (Chrome de bureau accepté pour cette story)
  - [x] Aucune erreur d'import ou de module manquant dans la console

## Dev Notes

### Stack et commande d'initialisation

- **Framework :** Phaser 4 (2026) — **PAS Phaser 3**. Le renderer WebGL a été entièrement reconstruit dans la v4. L'API de scène reste similaire (`Phaser.Scene`, `preload`/`create`/`update`) mais certains systèmes internes diffèrent.
- **Commande d'init :** `npm create @phaserjs/game@latest`
  - Sélectionner : **Phaser 4** → **Vite** → **JavaScript** (pas TypeScript)
  - Le template génère un `src/` avec une structure de démo qu'il faudra réorganiser
- **Dev server :** `npm run dev` → Vite HMR sur `localhost:8080` (ou port Vite par défaut)
- **Build prod :** `npm run build` → sortie statique dans `dist/`

### Structure cible après la story

```
fire-ball/
├── src/
│   ├── main.js               ← config Phaser, enregistrement scènes
│   ├── constants.js          ← SAVE_KEY, SCENES, MAX_LEVEL
│   ├── state/
│   │   └── GameState.js      ← singleton JS pur (stub)
│   ├── systems/
│   │   └── CombatEngine.js   ← logique combat pure (stub, 0 import Phaser)
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── TitleScene.js
│   │   ├── MapScene.js
│   │   ├── CombatScene.js
│   │   ├── ShopScene.js
│   │   ├── GameOverScene.js
│   │   └── UIScene.js
│   └── data/
│       ├── enemies.json      ← [] pour l'instant
│       ├── items.json        ← []
│       └── levels.json       ← []
├── public/
│   └── assets/              ← dossier vide (assets réels aux stories suivantes)
├── index.html
├── package.json
└── vite.config.js (ou vite/config.dev.mjs selon le template)
```

### Pattern de scène Phaser 4

Chaque scène suit ce pattern — utiliser **toujours** la clé depuis `SCENES` :

```js
// src/scenes/BootScene.js
import { SCENES } from '../constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {}

  create() {
    // Stub : sera complété à Story 1.3
  }
}
```

### constants.js — contenu attendu

```js
// src/constants.js
export const SAVE_KEY = 'fireball-save';

export const SCENES = {
  BOOT:      'BootScene',
  TITLE:     'TitleScene',
  MAP:       'MapScene',
  COMBAT:    'CombatScene',
  SHOP:      'ShopScene',
  GAME_OVER: 'GameOverScene',
  UI:        'UIScene',
};

export const MAX_LEVEL = 10;
```

### main.js — configuration Phaser 4

```js
// src/main.js
import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import MapScene from './scenes/MapScene.js';
import CombatScene from './scenes/CombatScene.js';
import ShopScene from './scenes/ShopScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: '#000000',
  scene: [
    BootScene,
    TitleScene,
    MapScene,
    CombatScene,
    ShopScene,
    GameOverScene,
    UIScene,
  ],
};

new Phaser.Game(config);
```

> **Note :** Les dimensions (`800×450`) sont provisoires pour le stub. La gestion du viewport mobile (667–932px, landscape) sera affinée à Story 1.4 (TitleScene) avec `Phaser.Scale.FIT` ou équivalent Phaser 4.

### GameState.js — pattern singleton (stub)

```js
// src/state/GameState.js
// Singleton JS pur — PAS une Phaser.Scene, aucun import Phaser
const GameState = {
  hero: {},
  inventory: [],

  save() {
    // Stub — implémentation complète à Story 1.2
  },

  load() {
    // Stub — implémentation complète à Story 1.2
  },

  reset() {
    // Stub — implémentation complète à Story 1.2
  },
};

export default GameState;
```

### CombatEngine.js — stub

```js
// src/systems/CombatEngine.js
// Logique pure — AUCUN import Phaser autorisé
const CombatEngine = {
  resolveTurn(action) {
    // Stub — implémentation complète à Story 2.1
    return null;
  },
};

export default CombatEngine;
```

### Conventions de code (rappel)

- Variables/fonctions : `camelCase`
- Classes/scènes : `PascalCase`
- Fichiers classes : `PascalCase.js`, fichiers utilitaires : `kebab-case.js`
- Constantes globales : `UPPER_SNAKE_CASE`
- **Jamais de chaînes magiques** — toujours passer par `SCENES.X`
- **Jamais d'import direct scène→scène**
- **Logique de jeu uniquement dans `src/systems/`**

### Périmètre de cette story

Cette story se limite à l'échafaudage — **pas de logique de jeu**. Les stubs sont intentionnellement vides. Ne pas anticiper les stories suivantes.

- Story 1.2 → remplira GameState + JSON de données
- Story 1.3 → remplira BootScene (assets loading)
- Story 1.4 → TitleScene avec orientation paysage

### Gestion du template scaffoldé

Le template Phaser 4 + Vite + JS peut générer des fichiers supplémentaires (ex. `src/scenes/Boot.js`, `src/scenes/Game.js`, fichiers de config Vite multiples). **Supprimer tout ce qui n'est pas dans la structure cible ci-dessus.** Garder uniquement `vite.config.js` (ou équivalent) et `index.html` tels quels.

### Aucun test automatisé pour cette story

Cette story ne produit que du scaffolding et des stubs. La validation se fait manuellement :
1. `npm run dev` → canvas visible, aucune erreur console
2. `npm run build` → `dist/` créé sans erreur

Les tests unitaires démarreront à Story 1.2 (GameState) et 2.1 (CombatEngine).

### References

- Architecture décisions : `planning-artifacts/architecture.md`
- Phaser 4 create-game CLI : [https://github.com/phaserjs/create-game](https://github.com/phaserjs/create-game)
- Phaser 4 docs : [https://docs.phaser.io](https://docs.phaser.io)
- CLAUDE.md — conventions et structure complète du projet

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- CLI `npm create @phaserjs/game@latest` interactive non utilisable sans TTY → projet créé manuellement à partir du template officiel `phaserjs/template-vite` (Phaser 4.1.0 + Vite 6.3.x).
- Warning build chunk size Phaser (~1.35 MB) : attendu et acceptable (350 kB gzippé, bien sous NFR 10 MB).

### Completion Notes List

- Projet initialisé manuellement en suivant le template officiel `phaserjs/template-vite` (Phaser 4.1.0).
- Arborescence `src/` conforme à l'architecture : `state/`, `systems/`, `scenes/`, `data/`.
- `src/constants.js` exporte `SAVE_KEY`, `SCENES` (7 clés), `MAX_LEVEL = 10`.
- `src/main.js` configure `Phaser.Game` avec `Scale.FIT + CENTER_BOTH` et enregistre les 7 scènes.
- 7 stubs de scènes créés — chacun référence sa clé depuis `SCENES`.
- `GameState.js` singleton JS pur, `CombatEngine.js` sans import Phaser.
- 3 fichiers JSON créés avec tableau vide `[]`.
- `npm install` → 0 vulnérabilités. `npm run build` → ✅ `dist/` produit en 5.73s.
- `.gitignore` ajouté (node_modules, dist, .DS_Store).

### File List

- `package.json`
- `index.html`
- `.gitignore`
- `public/style.css`
- `public/assets/` (dossier vide)
- `vite/config.dev.mjs`
- `vite/config.prod.mjs`
- `src/main.js`
- `src/constants.js`
- `src/scenes/BootScene.js`
- `src/scenes/TitleScene.js`
- `src/scenes/MapScene.js`
- `src/scenes/CombatScene.js`
- `src/scenes/ShopScene.js`
- `src/scenes/GameOverScene.js`
- `src/scenes/UIScene.js`
- `src/state/GameState.js`
- `src/systems/CombatEngine.js`
- `src/data/enemies.json`
- `src/data/items.json`
- `src/data/levels.json`

### Change Log

| Date | Changement |
|------|-----------|
| 2026-05-01 | Story créée — prête pour implémentation |
| 2026-05-01 | Implémentation complète — status → review |
