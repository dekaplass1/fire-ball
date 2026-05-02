# Story 2.1 : CombatEngine — logique pure de résolution des tours

Status: review

## Story

En tant que joueur,
je veux que mes actions en combat (attaquer, fuir) soient résolues de manière cohérente et déterministe,
afin d'avoir un système de combat fiable et prévisible.

## Acceptance Criteria

1. `src/systems/CombatEngine.js` est un module JS pur sans aucun import Phaser.
2. `CombatEngine.initCombat(mapLevel)` sélectionne aléatoirement un ennemi dont `minLevel <= mapLevel` en lisant `enemies.json` directement via import ES module.
3. `CombatEngine.resolveTurn('attack')` calcule les dégâts du héros (basés sur `hero.atk - enemy.def`, minimum 1), met à jour les PV de l'ennemi, déclenche une contre-attaque ennemie si l'ennemi survit.
4. `CombatEngine.resolveTurn('attack')` retourne `{ heroHp, enemyHp, log, outcome }` de manière synchrone.
5. `outcome` vaut `null` si le combat continue, `'victory'` si l'ennemi tombe à 0 PV, `'defeat'` si le héros tombe à 0 PV.
6. `CombatEngine.resolveTurn('flee')` retourne `outcome: 'fled'` sans contre-attaque ennemie.
7. `CombatEngine.getEnemy()` retourne l'ennemi courant (objet avec PV mis à jour).
8. `GameState.hero.hp` est mis à jour directement par `resolveTurn`.
9. 16 tests unitaires passent avec `npm test`.
10. `npm run build` s'exécute sans erreur.

## Tasks / Subtasks

- [x] Task 1 : Installer Vitest + jsdom et configurer (AC: 9)
  - [x] `npm install -D vitest jsdom`
  - [x] Créer `vitest.config.mjs` avec `environment: 'jsdom'`
  - [x] Ajouter `"test": "vitest run"` dans `package.json`

- [x] Task 2 : Écrire les tests (phase rouge) (AC: 1–8)
  - [x] Créer `src/systems/__tests__/CombatEngine.test.js`
  - [x] Tests `initCombat` : champs requis, eligibilité niveau, isolation des copies
  - [x] Tests `resolveTurn('flee')` : outcome fled, PV héros inchangés
  - [x] Tests `resolveTurn('attack')` : réduction PV, minimum 1 dégât, victory, defeat, pas de contre-attaque si victoire, mise à jour GameState
  - [x] Test `getEnemy` : retourne l'ennemi courant
  - [x] Confirmer 15/16 tests en échec avant implémentation

- [x] Task 3 : Implémenter `CombatEngine.js` (phase verte) (AC: 1–8)
  - [x] Import direct `enemies.json` (ES module, aucun Phaser)
  - [x] Import `GameState` pour les stats héros
  - [x] `initCombat(mapLevel)` : filter + random + spread (copie indépendante)
  - [x] `resolveTurn('flee')` : retour immédiat sans mutation
  - [x] `resolveTurn('attack')` : `Math.max(1, atk - def)` pour les deux camps, gestion victory/defeat
  - [x] `getEnemy()` : retourne `_enemy` courant
  - [x] Confirmer 16/16 tests verts

- [x] Task 4 : Valider l'intégration (AC: 10)
  - [x] `npm run build` → aucune erreur

## Dev Notes

### Architecture

- Import JSON direct : `import enemiesData from '../data/enemies.json'` — Vite gère nativement, plus simple que `?url` (réservé au chargement Phaser)
- État interne : variable module `_enemy` (objet avec PV courants mutables)
- `initCombat` retourne l'objet `_enemy` ET le stocke — `getEnemy()` renvoie la même référence
- Les dégâts : `Math.max(1, atk - def)` — minimum 1 garanti dans les deux sens
- Pas de contre-attaque si victoire — retour anticipé avant le bloc contre-attaque
- `GameState.hero.hp` muté directement — CombatScene lit depuis GameState après chaque tour

### Formule de dégâts

```
heroDmg  = Math.max(1, hero.atk  - enemy.def)
enemyDmg = Math.max(1, enemy.atk - hero.def)
```

### Test framework

Vitest avec jsdom (pour localStorage dans GameState.reset()). `beforeEach(() => GameState.reset())` remet le héros à ses valeurs initiales entre chaque test.

## Dev Agent Record

### Completion Notes

- 16 tests unitaires passent, couvrant tous les critères d'acceptation
- Aucun import Phaser dans CombatEngine.js
- Build prod ✅ (5.76s)
- Vitest 4.1.5 + jsdom 29.1.1 installés comme devDependencies

## File List

- `src/systems/CombatEngine.js` — implémenté
- `src/systems/__tests__/CombatEngine.test.js` — créé (16 tests)
- `vitest.config.mjs` — créé
- `package.json` — script `test` ajouté, vitest + jsdom en devDependencies

## Change Log

- 2026-05-02 : Story 2.1 implémentée — CombatEngine JS pur avec 16 tests unitaires
