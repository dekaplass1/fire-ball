# Story 1.5 : MapScene — navigation et progression sur la map

Status: review

## Story

En tant que joueur,
je veux voir ma position sur la map et pouvoir progresser vers le prochain niveau ou accéder à la boutique,
afin d'avancer dans mon aventure et préparer mon Guerrier pour les combats à venir.

## Acceptance Criteria

1. `MapScene` affiche le niveau de map courant (`GameState.currentMapLevel`) mis en évidence.
2. Un bouton "Avancer" démarre `CombatScene` (avec l'ennemi du niveau courant).
3. Un bouton "Boutique" démarre `ShopScene`.
4. Les deux boutons ont une zone de touch d'au moins 44×44px.
5. `GameState.currentMapLevel` existe dans GameState (ajout Story 1.5) et est sauvegardé / restauré avec `save()` / `load()`.
6. Si `GameState.currentMapLevel >= MAX_MAP_LEVEL`, le bouton "Avancer" est désactivé (grisé, non cliquable).
7. `MAX_MAP_LEVEL = 5` est défini dans `constants.js`.
8. `npm run build` s'exécute sans erreur.

## Tasks / Subtasks

- [x] Task 1 : Ajouter `MAX_MAP_LEVEL` à `constants.js` (AC: 7)
  - [x] `export const MAX_MAP_LEVEL = 5;`

- [x] Task 2 : Étendre `GameState` avec `currentMapLevel` (AC: 5)
  - [x] `currentMapLevel: 1` ajouté dans `_initialHeroState` — save/load/reset couverts automatiquement

- [x] Task 3 : Implémenter `MapScene.create()` (AC: 1, 2, 3, 4, 6)
  - [x] Titre "Carte" + "Niveau X / 5" affiché
  - [x] Bouton "⚔ Avancer" → `this.scene.start(SCENES.COMBAT)` ; désactivé si `>= MAX_MAP_LEVEL`
  - [x] Bouton "🏪 Boutique" → `this.scene.start(SCENES.SHOP)`

- [x] Task 4 : Valider build (AC: 8)
  - [x] `npm run build` → ✅ 5.71s, 0 erreur

## Dev Notes

### `currentMapLevel` dans GameState

`currentMapLevel` est placé dans `_initialHeroState` (dans `hero`) pour qu'il soit automatiquement inclus dans `save()` / `load()` / `reset()` existants. Aucune autre modification de `GameState.js` n'est nécessaire.

Accès depuis MapScene :
```js
const level = GameState.hero.currentMapLevel; // 1 par défaut
```

Incrément (géré par CombatScene après victoire, Stories 2.x) :
```js
GameState.hero.currentMapLevel += 1;
GameState.save();
```

### Pourquoi "Avancer" ne modifie pas `currentMapLevel` ici

Le joueur "progresse" seulement après une victoire en combat. Si le joueur fuit, `currentMapLevel` ne change pas. L'incrément est donc dans CombatScene (Story 2.2). MapScene affiche seulement la valeur courante.

### Layout 800×450

```
y=70   → "Carte" (titre)
y=140  → "Niveau X / 5" (indicateur de progression)
y=250  → [⚔ Avancer] button
y=330  → [🏪 Boutique] button
x=400  → centré
```

### Pattern bouton (réutiliser le même qu'en TitleScene)

```js
_makeButton(x, y, label, bgColor, onClick) {
  const btn = this.add.text(x, y, label, {
    fontSize: '28px',
    color: '#ffffff',
    backgroundColor: bgColor,
    padding: { x: 24, y: 14 },
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  btn.on('pointerdown', onClick);
  btn.on('pointerover', () => btn.setAlpha(0.85));
  btn.on('pointerout',  () => btn.setAlpha(1));
  return btn;
}
```

### Ce que cette story ne fait PAS

- N'implémente pas la logique combat (Story 2.1)
- N'incrémente pas `currentMapLevel` (géré en Story 2.2 après victoire)
- Pas de carte visuelle illustrée (post-MVP)

### References

- Épics — Story 1.5 : `planning-artifacts/epics.md#story-15`
- `GameState.hero.currentMapLevel` : ajouté dans cette story

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- `MAX_MAP_LEVEL = 5` ajouté à `constants.js`.
- `currentMapLevel: 1` ajouté à `_initialHeroState` dans `GameState.js` — inclus automatiquement dans save/load/reset existants.
- `MapScene` affiche niveau courant, bouton "Avancer" (vers CombatScene) et "Boutique" (vers ShopScene).
- Bouton "Avancer" désactivé si `currentMapLevel >= MAX_MAP_LEVEL`.
- Incrément de `currentMapLevel` délégué à CombatScene (Story 2.2) après victoire.
- `npm run build` → ✅ 5.71s.

### File List

- `src/constants.js`
- `src/state/GameState.js`
- `src/scenes/MapScene.js`

### Change Log

| Date | Changement |
|------|-----------|
| 2026-05-02 | Story créée et implémentée — status → review |
