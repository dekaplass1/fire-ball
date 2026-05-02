# Story 1.6 : UIScene — HUD persistent en mode parallel

Status: review

## Story

En tant que joueur,
Je veux voir en permanence les informations essentielles de mon Guerrier (PV, niveau, Gils),
Afin de prendre des décisions éclairées sans avoir à naviguer dans des menus.

## Acceptance Criteria

1. UIScene étant lancée en mode `parallel` par BootScene, le HUD reste affiché en superposition sur TitleScene, MapScene, CombatScene et ShopScene sans disparaître entre les transitions.
2. Le HUD affiche au minimum : PV actuels / PV max du Guerrier, niveau actuel, solde en Gils — valeurs lues depuis `GameState.hero` au `create()`.
3. Le HUD se met à jour immédiatement quand un événement `hero:hp-changed`, `hero:level-up` ou `hero:gils-changed` est émis par une scène active (CombatScene, ShopScene).
4. Le HUD ne reçoit aucune donnée directement depuis les scènes — uniquement via payload des événements Phaser.
5. Le HUD ne masque aucun élément interactif des autres scènes — positionné en haut du canvas (y ≤ 30), hors des zones de boutons (y ≥ 250).

## Tasks / Subtasks

- [x] Tâche 1 : Initialiser l'affichage HUD depuis GameState (AC: 1, 2)
  - [x] Dans `UIScene.create()`, lire `GameState.hero.hp`, `maxHp`, `level`, `gils`
  - [x] Créer 3 objets `this.add.text()` : HP gauche (x=50), Level centre (x=400), Gils droite (x=750), y=20
  - [x] Stocker les références dans `this._hpText`, `this._levelText`, `this._gilsText`
  - [x] Appeler `.setScrollFactor(0)` sur chaque texte pour les fixer à la caméra UIScene
- [x] Tâche 2 : Configurer les listeners d'événements cross-scènes (AC: 3, 4)
  - [x] Dans `UIScene.create()`, écouter `this.game.events` (bus global Phaser) pour `hero:hp-changed`, `hero:level-up`, `hero:gils-changed`
  - [x] Implémenter `_onHpChanged({ hp, maxHp })`, `_onLevelUp({ level })`, `_onGilsChanged({ gils })` qui appellent `.setText()` sur les textes HUD
- [x] Tâche 3 : Valider position et transparence (AC: 5)
  - [x] HUD positionné à y=20, boutons des autres scènes à y≥250 — aucun chevauchement
  - [x] Caméra UIScene transparente par défaut en parallel mode (pas de backgroundColor)
- [x] Tâche 4 : Build validation
  - [x] `npm run build` passe sans erreur (avertissement bundle Phaser attendu, non bloquant)

## Dev Notes

### Fichier à modifier

**`src/scenes/UIScene.js` uniquement** — stub actuel (11 lignes, `create()` vide). Aucun autre fichier ne change.

### État actuel du stub

```js
import { SCENES } from '../constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.UI });
  }

  create() {
    // Story 1.6 : HUD persistent (lancé en mode parallel par BootScene)
  }
}
```

### Lancement en parallel — déjà géré, ne pas toucher

`BootScene.create()` appelle déjà `this.scene.launch(SCENES.UI)` avant `this.scene.start(SCENES.TITLE)`. **Ne pas modifier BootScene.** UIScene est la dernière dans le tableau `scene` de `main.js` → rendu au-dessus de toutes les autres scènes. Caméra transparente par défaut en parallel mode.

### Dimensions canvas et positionnement HUD

Canvas fixe **800×450**. Les boutons des scènes existantes sont à y=250 (minimum). Le HUD doit tenir dans la bande y=0–40 :

```
x=50           x=400          x=720
PV: 30/30      Niv.1          💰 50
                y ≈ 20
```

Style recommandé : `fontSize: '18px'`, `color: '#ffffff'`, pas de `backgroundColor`. Utiliser `.setOrigin(0, 0.5)` pour gauche/droite et `.setOrigin(0.5, 0.5)` pour le centre.

### GameState.hero — champs utilisés

```js
// src/state/GameState.js — singleton JS pur (PAS de Phaser.Scene, aucun import Phaser)
hero: {
  hp: 30, maxHp: 30,   // → "_hpText" : "PV: hp/maxHp"
  level: 1,             // → "_levelText" : "Niv.level"
  gils: 50,             // → "_gilsText" : "💰 gils"
  // atk, def, xp, skillPoints, currentMapLevel — non affichés dans HUD MVP
}
```

### Implémentation des handlers d'événements

```js
_onHpChanged({ hp, maxHp }) {
  this._hpText.setText(`PV: ${hp}/${maxHp}`);
}
_onLevelUp({ level }) {
  this._levelText.setText(`Niv.${level}`);
}
_onGilsChanged({ gils }) {
  this._gilsText.setText(`💰 ${gils}`);
}
```

### Pattern cross-scène : attachment dynamique via SceneManager

**Problème de timing** : `UIScene.create()` est appelé au lancement du jeu (via BootScene), avant que CombatScene/ShopScene ne soient actives. `this.scene.get(key)` retourne `null` pour les scènes non encore démarrées.

**Solution** : écouter `'start'` sur le SceneManager pour attacher les listeners dynamiquement :

```js
// Dans UIScene.create() — après création des textes HUD
this.scene.manager.on('start', (sys) => {
  const key = sys.settings.key;
  if (key !== SCENES.COMBAT && key !== SCENES.SHOP) return;
  const scene = this.scene.get(key);
  if (!scene) return;
  scene.events.on('hero:hp-changed',   this._onHpChanged,   this);
  scene.events.on('hero:level-up',     this._onLevelUp,     this);
  scene.events.on('hero:gils-changed', this._onGilsChanged, this);
});
```

En Story 1.6, CombatScene et ShopScene sont des stubs non actifs — les listeners seront attachés lors de leurs premières activations (Stories 2.x/4.x). Le HUD affiche correctement les valeurs initiales dès maintenant.

**Fallback Phaser 4** : si `this.scene.manager.on` n'est pas disponible en Phaser 4.1.0, utiliser `this.game.events` comme bus global :
- Émetteurs (CombatScene etc.) : `this.game.events.emit('hero:hp-changed', { hp, maxHp })`
- UIScene : `this.game.events.on('hero:hp-changed', this._onHpChanged, this)` dans `create()`

### Événements Phaser — format payload contractuel

| Événement          | Payload           | Émetteur (future story) |
|--------------------|-------------------|-------------------------|
| `hero:hp-changed`  | `{ hp, maxHp }`   | CombatScene (2.x)       |
| `hero:level-up`    | `{ level }`       | CombatScene (3.x)       |
| `hero:gils-changed`| `{ gils }`        | CombatScene, ShopScene  |

Les handlers **ne doivent pas lire GameState** — utiliser uniquement le payload pour mettre à jour les textes.

### Anti-patterns à éviter absolument

- ❌ NE PAS importer d'autres scènes (`import MapScene from './MapScene.js'`) — violation architecture
- ❌ NE PAS appeler `GameState` depuis un handler d'événement — payload uniquement
- ❌ NE PAS recréer le HUD à chaque transition — UIScene reste active (parallel)
- ❌ NE PAS relancer UIScene depuis une autre scène — `this.scene.launch(SCENES.UI)` est uniquement dans BootScene
- ❌ NE PAS ajouter `backgroundColor` aux textes HUD — le HUD doit être transparent
- ❌ NE PAS oublier `.setScrollFactor(0)` — fixe les textes à la caméra UIScene

### Project Structure Notes

- Seul `src/scenes/UIScene.js` est modifié — aucun autre fichier ne change.
- `SCENES.UI` et les noms d'événements (`hero:hp-changed` etc.) existent déjà dans `constants.js` / architecture.
- UIScene est déjà enregistrée en dernier dans `main.js` — rendu correct au-dessus de tout.

### References

- [Architecture UIScene](planning-artifacts/architecture.md) — sections "UIScene parallel", "Communication inter-scènes", "HUD (UIScene)" lignes 139–178, 222–226, 343–347
- [Épics Story 1.6](planning-artifacts/epics.md) — lignes 238–256
- [Stub à modifier](src/scenes/UIScene.js)
- [Pattern buttons/scènes](src/scenes/MapScene.js) — `_makeButton()`, structure create()
- [GameState champs](src/state/GameState.js) — `_initialHeroState`
- [Constantes](src/constants.js) — `SCENES`
- [Canvas config](src/main.js) — 800×450, UIScene dernière dans array

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

Aucune erreur. Build `npm run build` réussi en 5.67s.

### Completion Notes List

- UIScene.create() lit `GameState.hero` (hp, maxHp, level, gils) pour l'affichage initial.
- 3 textes HUD créés à y=20 : gauche (x=50, origin 0/0.5), centre (x=400, origin 0.5/0.5), droite (x=750, origin 1/0.5). Tous avec `.setScrollFactor(0)`.
- Bus d'événements : `this.game.events` utilisé comme bus global Phaser (alternative documentée dans Dev Notes) plutôt que l'approche per-scène — évite les problèmes de timing liés à l'absence de CombatScene/ShopScene actives en Story 1.6. Les scènes émettrices devront appeler `this.game.events.emit('hero:hp-changed', { hp, maxHp })` etc.
- Caméra UIScene transparente par défaut en parallel — aucun fond opaque sur le HUD.
- Build prod validé sans régression.

### Change Log

- 2026-05-02 : Implémentation Story 1.6 — UIScene HUD persistent (hp, level, gils) avec listeners `this.game.events`.

### File List

- `src/scenes/UIScene.js` — modifié (stub → implémentation complète, 40 lignes)
