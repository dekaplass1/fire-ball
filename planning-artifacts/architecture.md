---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
lastStep: 8
status: 'complete'
completedAt: '2026-05-01'
inputDocuments: [planning-artifacts/prd.md]
workflowType: 'architecture'
project_name: 'Fire Ball'
user_name: 'Sumio'
date: '2026-05-01'
---

# Architecture Decision Document

_Ce document se construit collaborativement étape par étape. Les sections sont ajoutées au fil des décisions architecturales._

## Analyse du contexte projet

### Vue d'ensemble des exigences

**Exigences fonctionnelles (28 FR) — 6 domaines de capacité :**

| Domaine | FRs | Implication architecturale |
|---|---|---|
| Navigation & Écrans | FR1–FR6 | Gestionnaire de scènes Phaser (SceneManager) |
| Combat | FR7–FR13 | Moteur de combat tour par tour, logique de résolution |
| Progression du héros | FR14–FR18 | Système XP/niveaux/compétences, modèle de données héros |
| Boutique | FR19–FR22 | Interface d'inventaire, système d'objets |
| Persistance | FR23–FR25 | Couche localStorage, sérialisation/désérialisation de l'état |
| Ennemis | FR26–FR28 | Catalogue d'ennemis, sélection par niveau |

**Exigences non-fonctionnelles — implications architecturales :**

- 60 fps pendant les animations → logique de combat séparée du rendu, pas de calcul lourd sur le thread principal pendant les animations
- Chargement < 5s → lazy loading des assets par scène, optimisation du bundle Vite
- Réponse aux actions < 300ms → résolution de tour synchrone, pas d'attente async
- localStorage transparent → couche de persistance légère, écriture non-bloquante
- Bundle < 10 Mo → sprites compressés, assets optimisés par scène

### Contraintes et dépendances techniques

- **Phaser 3** impose une architecture basée sur des Scènes — chaque écran est une scène indépendante
- **localStorage** = store unique → nécessite une couche de sérialisation explicite et cohérente
- **Vite** = bundler ES modules → tree-shaking natif, import dynamique possible pour les assets lourds
- Pas de framework UI (React/Vue) — l'interface est dessinée dans le canvas Phaser

### Préoccupations transversales identifiées

- **Gestion d'état globale** : XP, Gils, niveau, inventaire accessibles depuis toutes les scènes
- **Persistance automatique** : chaque changement d'état significatif déclenche une sauvegarde localStorage
- **Configuration des données de jeu** : stats ennemis, objets boutique, seuils XP — séparés de la logique pour faciliter les modifications sans toucher au code
- **Pipeline d'assets** : sprites, tilesets, sons — organisation et chargement centralisés

### Complexité & Domaine

- **Domaine principal :** Web app canvas-based (JRPG)
- **Niveau de complexité :** Moyen
- **Composants architecturaux estimés :** 6–8 systèmes distincts

## Starter Template

### Domaine technologique principal

Web app canvas-based (JRPG mobile-first) — Phaser 4 + Vite, JavaScript pur.

### Option retenue : `@phaserjs/create-game` (officiel Phaser 4)

**Rationale :** Projet greenfield — Phaser 4 (version majeure actuelle, 2026) plutôt que Phaser 3. Fire Ball utilise sprites, tilemaps et objets standard : aucune friction d'adoption. Renderer WebGL reconstruit = meilleures animations de combat (NFR2 : 60 fps).

**Commande d'initialisation :**

```bash
npm create @phaserjs/game@latest
# Sélectionner : Phaser 4 → Vite → JavaScript
```

**Décisions architecturales fournies par le starter :**

- **Langage :** JavaScript ES modules (projet solo, pas de besoin de typage strict)
- **Bundler :** Vite — hot-reload, build optimisé, lazy loading natif
- **Structure de scènes :** Architecture Phaser SceneManager intégrée
- **Assets :** Pipeline de chargement via `this.load.*` dans les méthodes `preload()`
- **Dev server :** `localhost:8080` avec HMR
- **Build prod :** `npm run build` → bundle statique déployable

**Note :** L'initialisation du projet via cette commande sera la première story d'implémentation (Epic 1, Story 1).

## Décisions architecturales fondamentales

### Analyse des priorités de décision

**Décisions critiques (bloquent l'implémentation) :**
- Structure des scènes Phaser et rôle de chacune
- GameState singleton — structure et accès depuis les scènes
- Pipeline JSON — format et emplacement des fichiers de données
- Stratégie de persistance localStorage

**Décisions importantes (façonnent l'architecture) :**
- Infrastructure Vercel + GitHub CI/CD
- Déclencheurs de sauvegarde automatique

**Décisions différées (post-MVP) :**
- Animations avancées (spritesheet complexes, tweens enchaînés)
- Système de groupe de héros (Magicien + 2 autres)
- Scènes narratives illustrées et bulles de dialogue
- Résistances élémentaires des ennemis

### Architecture des données

**GameState — singleton global :**
- Fichier : `src/state/GameState.js`
- Indépendant de Phaser (classe JS pure, pas de `Phaser.Scene`)
- Accessible depuis toutes les scènes via import ES module
- Contient : stats héros (HP, level, XP, Gils, compétences, inventaire), état de session (scène active, ennemi courant)
- Responsable de la sérialisation/désérialisation localStorage

**Données de jeu — fichiers JSON externalisés :**

| Fichier | Contenu |
|---|---|
| `src/data/enemies.json` | Stats des 3 ennemis MVP (nom, HP, ATK, XP, Gils) |
| `src/data/items.json` | Catalogue boutique (nom, effet, prix) |
| `src/data/levels.json` | Seuils XP, stats héros par niveau |

Données chargées au `preload()` de BootScene via `this.load.json()` — modifiables sans toucher au code logique.

### Architecture Frontend (Scènes Phaser)

**Structure des scènes :**

| Scène | Rôle | Mode |
|---|---|---|
| `BootScene` | Chargement assets initiaux, splash | normal |
| `TitleScene` | Écran titre, nouveau jeu / charger partie | normal |
| `MapScene` | Monde, navigation, déclenchement combats | normal |
| `CombatScene` | Combat tour par tour (Attaquer / Fuite) | normal |
| `ShopScene` | Boutique objets, gestion inventaire | normal |
| `GameOverScene` | Fin de partie, restart | normal |
| `UIScene` | HUD persistent (HP, Gils, level) | **parallel** |

`UIScene` lancée en `parallel` dans Phaser permet un HUD persistent sans recréation à chaque transition de scène. Elle écoute les événements Phaser pour se mettre à jour.

**Transitions :** `this.scene.start('NomScene')` pour les transitions normales ; `UIScene` reste active en tâche de fond.

### Persistance

- **Store :** `localStorage`, clé unique `fireball-save`
- **Format :** objet JSON sérialisé (JSON.stringify / JSON.parse)
- **Sauvegarde automatique** déclenchée après chaque événement significatif :
  - Fin de combat (victoire ou fuite)
  - Achat en boutique
  - Montée de niveau
  - Dépense de points de compétences
- **Chargement :** à l'initialisation de GameState (TitleScene)
- **Réinitialisation :** nouveau jeu efface la clé et repart de l'état initial

### Infrastructure & Déploiement

- **Hébergement :** Vercel Hobby (gratuit permanent pour projets statiques)
- **CI/CD :** push sur `main` → build Vite automatique → déploiement Vercel
- **Pas de serverless, pas de fonctions backend** — bundle statique pur
- **Environnement :** un seul (production), pas de staging nécessaire pour ce projet personnel

### Analyse d'impact des décisions

**Séquence d'implémentation imposée par ces décisions :**
1. Init projet (`npm create @phaserjs/game@latest`) + structure dossiers
2. `GameState.js` — modèle de données et couche localStorage
3. Fichiers JSON de données (`enemies.json`, `items.json`, `levels.json`)
4. `BootScene` — chargement assets et JSON
5. `UIScene` — HUD parallel
6. Scènes de jeu dans l'ordre : TitleScene → MapScene → CombatScene → ShopScene → GameOverScene

**Dépendances inter-composants :**
- Toutes les scènes dépendent de `GameState` (import direct)
- `CombatScene` lit `enemies.json` via GameState ou cache local
- `ShopScene` lit `items.json` et modifie `GameState.inventory`
- `UIScene` écoute les événements Phaser émis par les autres scènes

## Patterns d'implémentation & règles de cohérence

### Points de conflit identifiés : 4 zones critiques

### Patterns de nommage

**Code JavaScript :**
- Variables et fonctions : `camelCase` — ex. `currentEnemy`, `loadItems()`, `resolveAttack()`
- Classes et scènes Phaser : `PascalCase` — ex. `GameState`, `CombatScene`, `CombatEngine`
- Fichiers source : `PascalCase` pour les classes (`GameState.js`, `CombatEngine.js`), `kebab-case` pour les utilitaires
- Constantes globales : `UPPER_SNAKE_CASE` — ex. `SAVE_KEY`, `MAX_LEVEL`, `BASE_ATTACK`

**Événements Phaser :**
- Format : `namespace:event-name` en kebab-case — ex. `hero:hp-changed`, `hero:level-up`, `combat:turn-end`, `combat:end`

### Patterns de structure

**Organisation des dossiers :**
```
src/
  scenes/       → BootScene.js, TitleScene.js, MapScene.js, CombatScene.js, ShopScene.js, GameOverScene.js, UIScene.js
  state/        → GameState.js (singleton)
  systems/      → CombatEngine.js (et futurs systèmes)
  data/         → enemies.json, items.json, levels.json
  constants.js  → toutes les constantes globales
```

**Constantes globales — `src/constants.js` :**
```js
export const SAVE_KEY = 'fireball-save';
export const SCENES = { BOOT: 'BootScene', TITLE: 'TitleScene', MAP: 'MapScene', COMBAT: 'CombatScene', SHOP: 'ShopScene', GAME_OVER: 'GameOverScene', UI: 'UIScene' };
export const MAX_LEVEL = 10;
```

### Patterns de communication

**Accès à GameState depuis une scène :**
```js
import GameState from '../state/GameState.js';
const hp = GameState.hero.hp;
```

**Notification de changement vers UIScene :**
```js
// Dans toute scène qui modifie les stats :
this.events.emit('hero:hp-changed', { hp: GameState.hero.hp });
// UIScene écoute via : this.scene.get('CombatScene').events.on('hero:hp-changed', ...)
```

**Transitions entre scènes :**
```js
this.scene.start(SCENES.MAP);       // transition normale
this.scene.launch(SCENES.UI);       // lancer UIScene en parallel (une seule fois, dans BootScene)
```

### Patterns de combat

**Séquence d'un tour (invariante) :**
1. Joueur choisit une action (bouton)
2. `CombatEngine.resolveTurn(action)` — synchrone, retourne `{heroHp, enemyHp, log, outcome}`
3. `GameState` mis à jour
4. `emit('combat:turn-end', payload)`
5. `CombatScene` anime le résultat
6. Si `outcome !== null` : `emit('combat:end', { outcome })` puis transition de scène

`CombatEngine` est une classe pure sans référence à Phaser — logique uniquement.

### Patterns de gestion d'erreurs

**localStorage — stratégie silencieuse :**
```js
save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.serialize()));
  } catch (e) {
    // Jeu continue en mémoire, sans crash ni alerte
  }
}
```

Aucun autre try/catch dans le reste du code sauf nécessité explicite.

### Règles obligatoires pour tous les agents

- Toutes les constantes passent par `src/constants.js` — jamais de chaînes magiques en dur
- `GameState` est importé, jamais recréé — un seul import par fichier qui en a besoin
- La logique de jeu (calculs, règles) vit dans `src/systems/`, jamais dans les scènes
- Les scènes ne se parlent qu'via événements Phaser ou `GameState` — jamais d'import direct scène→scène
- Toute modification de `GameState` déclenche `GameState.save()` en fin de méthode

## Structure du projet & frontières architecturales

### Arborescence complète du projet

```
fire-ball/
├── index.html                    → entry point HTML (Vite)
├── package.json
├── vite.config.js
├── .gitignore
├── vercel.json                   → config déploiement Vercel
├── planning-artifacts/
│   ├── prd.md
│   └── architecture.md
├── public/
│   └── assets/
│       ├── sprites/
│       │   ├── hero/             → spritesheets du Guerrier
│       │   └── enemies/          → sprites des 3 ennemis MVP
│       └── ui/                   → éléments HUD (boutons, barres HP)
└── src/
    ├── main.js                   → config Phaser, enregistrement des scènes, lancement BootScene
    ├── constants.js              → SAVE_KEY, SCENES, MAX_LEVEL, etc.
    ├── state/
    │   └── GameState.js          → singleton : données héros, save/load localStorage
    ├── systems/
    │   └── CombatEngine.js       → logique de combat pure (sans Phaser)
    ├── scenes/
    │   ├── BootScene.js          → chargement assets + JSON, transition vers TitleScene
    │   ├── TitleScene.js         → écran titre, nouveau jeu / charger
    │   ├── MapScene.js           → monde, navigation, déclenchement combats/boutique
    │   ├── CombatScene.js        → UI combat, appelle CombatEngine, anime résultats
    │   ├── ShopScene.js          → UI boutique, modifie GameState.inventory
    │   ├── GameOverScene.js      → écran fin, bouton restart
    │   └── UIScene.js            → HUD persistent (HP, Gils, level), mode parallel
    └── data/
        ├── enemies.json          → stats 3 ennemis MVP
        ├── items.json            → catalogue boutique
        └── levels.json           → seuils XP, stats héros par niveau
```

### Mapping FR → fichiers

| Domaine FR | Fichiers responsables |
|---|---|
| Navigation & Écrans (FR1–6) | `src/scenes/*.js`, `src/main.js` |
| Combat (FR7–13) | `src/scenes/CombatScene.js`, `src/systems/CombatEngine.js`, `src/data/enemies.json` |
| Progression héros (FR14–18) | `src/state/GameState.js`, `src/data/levels.json` |
| Boutique (FR19–22) | `src/scenes/ShopScene.js`, `src/data/items.json` |
| Persistance (FR23–25) | `src/state/GameState.js` (méthodes `save()` / `load()`) |
| Ennemis (FR26–28) | `src/data/enemies.json`, `src/systems/CombatEngine.js` |

### Flux de données & points d'intégration

**Démarrage du jeu :**
```
main.js → BootScene (preload: JSON + assets)
        → TitleScene + UIScene.launch() (parallel)
        → TitleScene charge GameState depuis localStorage
        → MapScene
```

**Pendant le jeu :**
```
MapScene ──→ CombatScene.start({ enemy })
              └─ CombatEngine.resolveTurn()
              └─ GameState.update() + save()
              └─ emit('combat:end') → MapScene
         ──→ ShopScene
              └─ GameState.inventory.update() + save()
              └─ → MapScene
```

**HUD (UIScene) :**
```
UIScene écoute : hero:hp-changed, hero:level-up, hero:gils-changed
                ← émis par CombatScene et ShopScene
```

### Frontières architecturales

**Frontières de composants :**
- `src/systems/` → logique pure, zéro import Phaser — testable indépendamment
- `src/state/` → données uniquement, zéro logique de rendu
- `src/scenes/` → orchestration UI + appels vers systems et state
- `src/data/` → lecture seule, jamais modifié à l'exécution

**Pas d'intégrations externes** — projet entièrement offline, zéro API tierce.

### Organisation des assets

- Assets dans `public/assets/` — servis statiquement par Vite, accessibles via chemin relatif dans `this.load.*`
- Chargés une seule fois dans `BootScene.preload()` — disponibles dans toutes les scènes suivantes via le cache Phaser
- Nommage des clés de cache : `kebab-case` — ex. `'hero-idle'`, `'enemy-goblin'`, `'btn-attack'`

## Résultats de validation de l'architecture

### Validation de cohérence ✅

**Compatibilité des décisions :**
Phaser 4 + Vite + JavaScript ES modules forment un stack homogène sans conflit. GameState (classe JS pure) est compatible avec le tree-shaking Vite. La résolution de tour synchrone + localStorage synchrone garantit le NFR < 300ms. UIScene en mode parallel est un pattern natif Phaser SceneManager.

**Consistance des patterns :**
Les conventions camelCase/PascalCase/UPPER_SNAKE_CASE sont cohérentes avec les standards JS. Les événements `namespace:event-name` s'appliquent sans conflit entre UIScene et les scènes de jeu. La frontière `src/systems/` sans import Phaser respecte la séparation logique/rendu.

**Alignement structure/décisions :**
Chaque décision architecturale a un fichier de destination clair. Les frontières sont respectées : scènes → orchestration, systems → logique pure, state → données.

### Validation de couverture des exigences ✅

| Domaine FR | Couverture |
|---|---|
| FR1–6 Navigation | 7 scènes définies, transitions via constantes `SCENES` |
| FR7–13 Combat | `CombatScene` + `CombatEngine` + `enemies.json` |
| FR14–18 Progression | `GameState` + `levels.json` |
| FR19–22 Boutique | `ShopScene` + `items.json` |
| FR23–25 Persistance | `GameState.save()/load()` + clé `fireball-save` |
| FR26–28 Ennemis | `enemies.json` + `CombatEngine` |

**NFR :** 60fps (CombatEngine séparé) ✅ · < 5s (BootScene preload + Vite) ✅ · < 300ms (synchrone) ✅ · < 10Mo (stack minimaliste) ✅

### Analyse des lacunes

**Lacunes mineures (ne bloquent pas l'implémentation) :**
- Structure interne exacte de `GameState` (champs hero, inventory) → à définir en story 1
- Config `main.js` (dimensions canvas, liste des scènes Phaser) → à définir en story 1
- `vercel.json` minimal → fichier trivial à créer lors du déploiement

**Lacunes critiques : aucune.**

### Checklist de complétude de l'architecture

**Analyse des exigences**
- [x] Contexte projet analysé en profondeur
- [x] Complexité évaluée (Moyen, 6–8 systèmes)
- [x] Contraintes techniques identifiées
- [x] Préoccupations transversales cartographiées

**Décisions architecturales**
- [x] Décisions critiques documentées avec stack complet
- [x] Stack technique spécifié (Phaser 4, Vite, JS, Vercel)
- [x] Patterns d'intégration définis
- [x] Performances adressées architecturalement

**Patterns d'implémentation**
- [x] Conventions de nommage établies
- [x] Patterns de structure définis
- [x] Patterns de communication spécifiés
- [x] Patterns de processus documentés (erreurs, sauvegarde)

**Structure du projet**
- [x] Arborescence complète définie
- [x] Frontières de composants établies
- [x] Points d'intégration cartographiés
- [x] Mapping FR → fichiers complet

### Bilan de maturité

**Statut global : READY FOR IMPLEMENTATION**
**Niveau de confiance : Élevé**

**Points forts :**
- Séparation logique/rendu via `CombatEngine` indépendant de Phaser
- GameState singleton sans boilerplate — adapté au scope solo
- Pipeline JSON externalisé — données modifiables sans toucher au code
- Stack minimaliste parfaitement calibré pour le MVP

**Axes d'évolution post-MVP :**
- `src/systems/LevelEngine.js` pour la progression avancée
- Format JSON versionné si le catalogue d'ennemis s'étend
- `src/scenes/NarrativeScene.js` pour les cutscènes illustrées

### Handoff vers l'implémentation

**Directive pour les agents IA :**
- Suivre toutes les décisions architecturales exactement telles que documentées
- Appliquer les patterns d'implémentation de manière cohérente sur tous les composants
- Respecter la structure du projet et les frontières définies
- Se référer à ce document pour toute question architecturale

**Première priorité d'implémentation :**
```bash
npm create @phaserjs/game@latest
# Sélectionner : Phaser 4 → Vite → JavaScript
# Puis restructurer src/ selon l'arborescence définie en section 6
```
