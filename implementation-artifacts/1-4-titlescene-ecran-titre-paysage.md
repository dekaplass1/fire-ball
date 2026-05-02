# Story 1.4 : TitleScene — écran titre en paysage (Nouvelle partie / Continuer)

Status: review

## Story

En tant que joueur,
je veux voir un écran titre en mode paysage avec deux options claires au lancement du jeu,
afin de démarrer une nouvelle aventure ou reprendre ma partie là où je l'ai laissée.

## Acceptance Criteria

1. `TitleScene` s'affiche après `BootScene` avec le titre "Fire Ball" et deux boutons : "Nouvelle partie" et "Continuer".
2. Si aucune sauvegarde n'existe dans `localStorage` (`GameState.hasSave()` retourne `false`), le bouton "Continuer" est visuellement grisé et non cliquable.
3. Quand le joueur appuie sur "Nouvelle partie", `GameState.reset()` est appelé puis la scène transite vers `MapScene`.
4. Quand le joueur appuie sur "Continuer" (si actif), `GameState.load()` est appelé puis la scène transite vers `MapScene`.
5. Les deux boutons ont une zone de touch d'au moins 44×44px (padding inclus).
6. L'animation d'intro post-"Nouvelle partie" est un placeholder (non implémentée en MVP — transition directe).
7. `npm run build` s'exécute sans erreur.

## Tasks / Subtasks

- [x] Task 1 : Implémenter `TitleScene.create()` — titre et mise en page (AC: 1)
  - [x] Afficher le texte "Fire Ball" centré en haut du canvas (`fontSize: '56px'`, `color: '#ffaa00'`)
  - [x] Méthode helper `_makeButton()` pour factoriser le pattern bouton

- [x] Task 2 : Créer le bouton "Nouvelle partie" (AC: 3, 5)
  - [x] Padding `{ x: 24, y: 14 }` → hauteur effective 56px ≥ 44px requis
  - [x] Listener `pointerdown` : `GameState.reset()` → `this.scene.start(SCENES.MAP)`

- [x] Task 3 : Créer le bouton "Continuer" avec état conditionnel (AC: 2, 4, 5)
  - [x] `!GameState.hasSave()` → `setAlpha(0.4).disableInteractive()`
  - [x] Si save présente : `GameState.load()` → `this.scene.start(SCENES.MAP)`

- [x] Task 4 : Valider build (AC: 7)
  - [x] `npm run build` → ✅ 5.18s, 16 modules, 0 erreur

## Dev Notes

### Pattern de bouton texte MVP

```js
const btn = this.add.text(x, y, label, {
  fontSize: '28px',
  color: '#ffffff',
  backgroundColor: '#1a1a2e',
  padding: { x: 24, y: 14 },
}).setOrigin(0.5).setInteractive({ useHandCursor: true });

btn.on('pointerdown', () => { /* action */ });
btn.on('pointerover',  () => btn.setStyle({ color: '#ffdd88' }));
btn.on('pointerout',   () => btn.setStyle({ color: '#ffffff' }));
```

Hauteur effective = fontSize (28px) + padding vertical (14×2 = 28px) = 56px ≥ 44px requis ✅

### Bouton "Continuer" désactivé

```js
if (!GameState.hasSave()) {
  continuerBtn.setAlpha(0.4).disableInteractive();
}
```

Ne pas appeler `setInteractive()` puis le désactiver conditionnellement. Créer le bouton sans interactivité par défaut, puis l'ajouter seulement si `hasSave()`.

### Layout canvas 800×450

```
y=120  → Titre "Fire Ball"
y=240  → Bouton "Nouvelle partie"
y=310  → Bouton "Continuer"
x=400  → centre horizontal (toujours)
```

### Imports nécessaires

```js
import { SCENES } from '../constants.js';
import GameState from '../state/GameState.js';
```

### Ce que cette story ne fait PAS

- Pas de fond illustré (Story 2.3)
- Pas d'animation d'intro (hors MVP)
- `currentLevel` n'est pas initialisé ici — MapScene (Story 1.5) le gère

### References

- Épics — Story 1.4 : `planning-artifacts/epics.md#story-14`
- GameState : `src/state/GameState.js` — méthodes `hasSave()`, `load()`, `reset()`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- `TitleScene.create()` implémentée avec titre "Fire Ball" (56px, or) + 2 boutons texte Phaser.
- Méthode helper `_makeButton()` factorise le pattern (texte + padding + interactivité + hover).
- Bouton "Continuer" : `disableInteractive()` + `alpha(0.4)` si `!GameState.hasSave()`.
- Hauteur bouton effective : 28px (fontSize) + 28px (padding ×2) = 56px ≥ 44px requis ✅.
- `npm run build` → ✅ 5.18s.

### File List

- `src/scenes/TitleScene.js`

### Change Log

| Date | Changement |
|------|-----------|
| 2026-05-01 | Story créée et implémentée — status → review |
