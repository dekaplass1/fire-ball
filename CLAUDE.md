# Fire Ball — Instructions pour Claude

## Projet

JRPG solo tour par tour, navigateur mobile (sans installation). Stack : **Phaser 4 + Vite + JavaScript ES modules** — **PAS Phaser 3**. Pas de backend, persistance localStorage. Déploiement Vercel Hobby (push `main` → CI/CD auto). Langue : français (comms/docs), anglais (code).

## Documents de référence

| Document | Chemin |
|---|---|
| PRD | `planning-artifacts/prd.md` |
| Architecture | `planning-artifacts/architecture.md` |
| Épics & Stories | `planning-artifacts/epics.md` |
| Stories d'implémentation | `implementation-artifacts/*.md` |

## Décisions architecturales non-évidentes

- **GameState** : singleton objet littéral JS pur (`src/state/GameState.js`) — **PAS une Phaser.Scene**, aucun import Phaser. Méthodes : `save()`, `load()`, `reset()`, `hasSave()`. `_initialHeroState` en const interne, spread dans `reset()`.
- **CombatEngine** : module JS pur (`src/systems/CombatEngine.js`) — **zéro import Phaser**. Importe `enemies.json` directement comme ES module (pas via Phaser cache).
- **JSON de données** : deux patterns — import direct (`import data from '../data/foo.json'`) dans les modules JS purs ; `import url from '...?url'` + Phaser cache uniquement dans les scènes qui préchargent pour Phaser.
- **UIScene** : lancée en `parallel` par `BootScene.create()` via `this.scene.launch(SCENES.UI)` avant `this.scene.start(SCENES.TITLE)`. Ne jamais la relancer depuis une autre scène.
- **Communication inter-scènes** : `this.game.events` comme bus global. **PAS** `this.scene.get(key).events` — timing issues.
- **`currentMapLevel`** : dans `GameState.hero` (pas à la racine) — inclus automatiquement dans `save()`/`load()`. Incrémenté par CombatScene après victoire.
- **Import Phaser dans chaque scène** : chaque fichier de scène doit faire `import Phaser from 'phaser'`. `window.Phaser = Phaser` dans `main.js` ne fonctionne PAS — les imports ES modules sont hoistés. `manualChunks: { phaser: ['phaser'] }` garantit un seul chunk partagé.
- **Texte HiDPI** : `GameObjectFactory.prototype.text` patché dans `main.js` — appelle `.setResolution(devicePixelRatio)` sur chaque Text object. `DEFAULT_RESOLUTION` n'existe pas dans Phaser 4.

## Déploiement Vercel

- **URL prod** : `fire-ball.vercel.app`
- **Repo GitHub** : `github.com/dekaplass1/fire-ball` (public)
- **Git author** : `elliotnathanwilson` / `elliot.nathan.wilson@gmail.com` — doit correspondre au compte Vercel pour que CI/CD fonctionne
- **vercel.json** : `{ "buildCommand": "npm run build", "outputDirectory": "dist", "framework": null }`
- **Vercel Authentication** : désactivée (Settings → Security)
- Les 404 sprites dans la console sont normaux jusqu'à Story 2.3 (assets pas encore créés)

## Périmètre MVP

- 1 héros : Guerrier. 3 ennemis. Écrans : titre, map, combat, boutique, game over.
- Combat tour par tour : Attaquer / Fuite. Progression : XP, Gils, points de compétences.
- Sauvegarde auto après : fin de combat (victoire/fuite), achat, montée de niveau, dépense de compétences. **Pas de save si `outcome === 'defeat'`.**
- **Hors scope MVP :** sorts (Fire Ball), autres héros, PM, animation d'intro, résistances élémentaires, combats en groupe.

## UX & NFR

- **Paysage obligatoire** (667–932px width, iOS + Android)
- Boutons tactiles min 44×44px — pattern : `this.add.text()` + `padding: { x:24, y:14 }` → ~56px
- Vue combat : perspective 3/4, héros gauche, ennemi droite, fond illustré
- Sprites : style 2D HD illustré (pas pixel art) — au moins 2 états (idle/attaque)
- NFR : chargement < 5s/4G, 60fps combat, réponse < 300ms, bundle < 10 Mo

## Séquence d'un tour de combat

1. Joueur choisit action (bouton)
2. `CombatEngine.resolveTurn(action)` → synchrone → `{ heroHp, enemyHp, log, outcome }` + met à jour `GameState.hero.hp`
3. `this.game.events.emit('combat:turn-end', payload)` → CombatScene anime
4. Si `outcome !== null` : `this.game.events.emit('combat:end', { outcome })` → transition de scène

## Règles de jeu MVP

- Fuite toujours réussie (`outcome = 'fled'`), sans contre-attaque ennemie
- Utiliser un objet en combat = action du tour, pas de contre-attaque supplémentaire
- Game over → TitleScene (bouton "Recommencer" → `GameState.reset()`)
- Montée de niveau multi-palier traitée séquentiellement

## État d'implémentation

**Story 2.1 review** | **Prochaine : Story 2.2 (CombatScene)**

| Epic | Stories | Statut |
|---|---|---|
| 1 — Lancement & map | 1.1–1.7 | ✅ review |
| 2 — Combat | 2.1 review, 2.2–2.4 à faire | 🔄 |
| 3 — Progression | 3.1–3.3 | ⏳ |
| 4 — Boutique | 4.1–4.2 | ⏳ |
| 5 — Persistance | 5.1–5.3 | ⏳ |
