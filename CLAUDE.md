# Fire Ball — Instructions pour Claude

## Projet

JRPG solo tour par tour, navigateur mobile (sans installation), cercle d'amis. Stack : **Phaser 4 + Vite + JavaScript ES modules** — **PAS Phaser 3**. Pas de backend, persistance localStorage. Déploiement Vercel Hobby (push `main` → CI/CD auto). Langue : français (comms/docs), anglais (code).

## Documents de référence

| Document | Chemin |
|---|---|
| PRD | `planning-artifacts/prd.md` |
| Architecture | `planning-artifacts/architecture.md` |
| Épics & Stories | `planning-artifacts/epics.md` |
| Stories d'implémentation | `implementation-artifacts/*.md` |

## Décisions architecturales non-évidentes

- **GameState** : singleton objet littéral JS pur (`src/state/GameState.js`) — **PAS une Phaser.Scene**, aucun import Phaser. Méthodes : `save()`, `load()`, `reset()`, `hasSave()`. `_initialHeroState` en const interne, spread dans `reset()` pour éviter mutation.
- **CombatEngine** : module JS pur (`src/systems/CombatEngine.js`) — **zéro import Phaser**, jamais de logique de jeu dans les scènes.
- **JSON de données** : dans `src/data/`, chargés par Phaser via `import url from '...?url'` (Vite résout l'URL en dev et prod). Clés de cache dans `CACHE_KEYS`, clés d'assets dans `ASSET_KEYS` — tout dans `constants.js`.
- **UIScene** : lancée en `parallel` par `BootScene.create()` via `this.scene.launch(SCENES.UI)` **avant** `this.scene.start(SCENES.TITLE)`. Ne jamais la relancer depuis une autre scène.
- **Communication inter-scènes** : uniquement via événements Phaser (`namespace:event-name`) ou lecture directe de `GameState` — **jamais d'import scène→scène**.
- **`currentMapLevel`** : vit dans `GameState.hero` (pas à la racine) pour être inclus automatiquement dans `save()`/`load()`. Incrémenté par CombatScene après victoire, pas par MapScene.
- **Versions installées** : Phaser 4.1.0, Vite 6.4.2.

## Périmètre MVP

- 1 héros : Guerrier. 3 ennemis différenciés. Écrans : titre, map, combat, boutique, game over.
- Combat tour par tour : Attaquer / Fuite. Progression : XP, Gils, points de compétences.
- Sauvegarde auto localStorage après : fin de combat (victoire/fuite), achat, montée de niveau, dépense de compétences. **Pas de save si `outcome === 'defeat'`.**

**Hors scope MVP :** autres héros, sorts (Fire Ball), PM, animation d'intro, scènes narratives, résistances élémentaires, combats en groupe.

## UX & NFR

- **Orientation paysage obligatoire** (667–932px width, iOS + Android)
- Boutons tactiles min 44×44px (pattern : `this.add.text()` + `padding: { x:24, y:14 }` → ~56px)
- Vue combat : perspective 3/4, héros gauche, ennemi droite, fond illustré
- Sprites : style 2D HD illustré (pas pixel art) — au moins 2 états (idle/attaque)
- NFR : chargement < 5s/4G, 60fps combat, réponse < 300ms, bundle < 10 Mo

## Séquence d'un tour de combat

1. Joueur choisit action (bouton)
2. `CombatEngine.resolveTurn(action)` → synchrone → `{heroHp, enemyHp, log, outcome}`
3. GameState mis à jour
4. `emit('combat:turn-end', payload)` → CombatScene anime
5. Si `outcome !== null` : `emit('combat:end', { outcome })` → transition de scène

## Décisions de conception MVP

- Fuite toujours réussie (`outcome = 'fled'`), sans contre-attaque ennemie
- Utiliser un objet en combat = action du tour (pas de contre-attaque supplémentaire)
- Game over → TitleScene (bouton "Recommencer" → `GameState.reset()`)
- Montée de niveau multi-palier traitée séquentiellement
- `CombatEngine.initCombat(mapLevel)` sélectionne aléatoirement parmi les ennemis eligibles (`minLevel <= mapLevel`)
- `MAX_MAP_LEVEL = 5` (5 niveaux de carte MVP)

## État d'implémentation

**Stories 1.1–1.6 : review** | **Story 1.7 : ready-for-dev** | **Prochaine : Epic 2 (Combat)**

| Epic | Stories | Statut |
|---|---|---|
| 1 — Lancement & map | 1.1 → 1.5 implémentées, 1.6–1.7 à faire | 🔄 |
| 2 — Combat | 2.1–2.4 à faire | ⏳ |
| 3 — Progression | 3.1–3.3 à faire | ⏳ |
| 4 — Boutique | 4.1–4.2 à faire | ⏳ |
| 5 — Persistance | 5.1–5.3 à faire | ⏳ |

**Story 1.6 — UIScene :** HUD en `parallel`, affiche HP/maxHp, level, Gils. Lit `GameState.hero` au démarrage puis écoute `hero:hp-changed`, `hero:level-up`, `hero:gils-changed` émis par les autres scènes. Position non intrusive (ne masque pas les boutons).
