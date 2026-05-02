---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics]
inputDocuments: [planning-artifacts/prd.md, planning-artifacts/architecture.md]
---

# Fire Ball - Epic Breakdown

## Overview

Ce document fournit le découpage complet en épics et stories pour Fire Ball, décomposant les exigences du PRD et de l'Architecture en stories implémentables par les agents IA.

## Requirements Inventory

### Functional Requirements

FR1 : Le joueur peut lancer une nouvelle partie depuis l'écran titre
FR2 : Le joueur peut reprendre une partie existante depuis l'écran titre
FR3 : Le joueur peut visualiser la map et sa position actuelle
FR4 : Le joueur peut progresser vers le prochain niveau depuis la map
FR5 : Le joueur peut accéder à la boutique depuis la map
FR6 : Le joueur voit un écran de game over lorsque le Guerrier atteint 0 PV
FR7 : Le joueur peut déclencher un combat en atteignant un niveau sur la map
FR8 : Le joueur peut choisir l'action "Attaquer" pendant son tour
FR9 : Le joueur peut choisir l'action "Fuir" pendant son tour
FR10 : Le système résout les tours en alternant joueur et ennemi
FR11 : Le joueur voit les PV du Guerrier et de l'ennemi à chaque tour
FR12 : Le joueur voit le résultat de chaque action (dégâts infligés / reçus)
FR13 : Le combat se termine automatiquement à la mort de l'ennemi ou du Guerrier
FR14 : Le joueur reçoit de l'XP à la fin de chaque combat victorieux
FR15 : Le Guerrier monte de niveau lorsque le seuil d'XP est atteint
FR16 : La montée de niveau attribue des points de compétences au joueur
FR17 : Le joueur peut dépenser des points de compétences pour améliorer les stats du Guerrier
FR18 : Le joueur reçoit des Gils à la fin de chaque combat victorieux
FR19 : Le joueur peut consulter les objets disponibles à l'achat
FR20 : Le joueur peut acheter un objet si son solde en Gils est suffisant
FR21 : Le joueur peut utiliser un objet acheté pendant un combat ou depuis l'inventaire
FR22 : Le joueur peut consulter son inventaire
FR23 : La progression est sauvegardée automatiquement (niveau, XP, Gils, position, inventaire)
FR24 : La progression est restaurée à la reprise d'une partie existante
FR25 : Le joueur peut réinitialiser sa partie
FR26 : Le système sélectionne un ennemi approprié au niveau actuel de la map
FR27 : Chaque ennemi dispose de stats propres (PV, attaque, défense)
FR28 : Chaque ennemi rapporte une quantité définie d'XP et de Gils

### NonFunctional Requirements

NFR1 : Chargement initial < 5 secondes sur connexion mobile 4G
NFR2 : Animations de combat à 60 fps sur smartphones iOS et Android récents
NFR3 : Réponse aux actions de combat (appui bouton → résolution du tour) < 300ms
NFR4 : Sauvegarde et chargement localStorage transparents, sans délai perceptible
NFR5 : Bundle applicatif < 10 Mo

### Additional Requirements

- ARCH1 : Initialisation du projet via `npm create @phaserjs/game@latest` (Phaser 4 → Vite → JavaScript) — Epic 1, Story 1
- ARCH2 : Restructurer src/ selon l'arborescence définie : scenes/, state/, systems/, data/, constants.js
- ARCH3 : Créer `src/state/GameState.js` — singleton JS pur, couche localStorage (save/load)
- ARCH4 : Créer les fichiers de données JSON : `src/data/enemies.json`, `items.json`, `levels.json`
- ARCH5 : UIScene lancée en mode `parallel` depuis BootScene pour HUD persistent
- ARCH6 : Configurer Vercel Hobby + CI/CD GitHub (push main → déploiement auto)
- ARCH7 : Créer `src/constants.js` avec SAVE_KEY, SCENES, MAX_LEVEL
- ARCH8 : CombatEngine dans `src/systems/CombatEngine.js` — classe JS pure sans import Phaser

### UX Design Requirements

UX-DR1 : Vue combat en perspective 3/4 — héros côté gauche, ennemi côté droit, fond de scène illustré
UX-DR2 : UI de combat en bas de l'écran : noms des combattants, barres HP visibles à chaque tour, résultats d'actions affichés
UX-DR3 : Menu d'actions tactile côté gauche ou bas — boutons larges (min 44px), bien espacés pour le touch
UX-DR4 : Fond de scène illustré contextuel (intérieur, donjon, extérieur) selon la zone de combat
UX-DR5 : Sprites personnages et ennemis en style 2D illustré haute résolution (pas pixel art blocky) — au moins 2 états visuels (idle / attaque ou dégâts)
UX-DR6 : Orientation paysage (landscape) obligatoire — viewport cible 667–932px width, iOS et Android (remplace la contrainte portrait du PRD)

### FR Coverage Map

FR1 : Epic 1 — Lancer une nouvelle partie depuis l'écran titre
FR2 : Epic 1 — Reprendre une partie (arrive directement sur la map)
FR3 : Epic 1 — Visualiser la map et la position actuelle
FR4 : Epic 1 — Progresser vers le prochain niveau depuis la map
FR5 : Epic 1 — Accéder à la boutique depuis la map
FR6 : Epic 2 — Écran game over lorsque le Guerrier atteint 0 PV (déclenché par combat perdu)
FR7 : Epic 2 — Déclencher un combat depuis la map
FR8 : Epic 2 — Choisir "Attaquer" pendant son tour
FR9 : Epic 2 — Choisir "Fuir" pendant son tour
FR10 : Epic 2 — Résolution des tours en alternance joueur/ennemi
FR11 : Epic 2 — Voir les PV du Guerrier et de l'ennemi à chaque tour
FR12 : Epic 2 — Voir le résultat de chaque action (dégâts infligés / reçus)
FR13 : Epic 2 — Combat terminé automatiquement à la mort de l'ennemi ou du Guerrier
FR14 : Epic 3 — Recevoir de l'XP après un combat victorieux
FR15 : Epic 3 — Guerrier monte de niveau au seuil d'XP
FR16 : Epic 3 — Montée de niveau attribue des points de compétences
FR17 : Epic 3 — Dépenser des points de compétences pour améliorer les stats
FR18 : Epic 3 — Recevoir des Gils après un combat victorieux
FR19 : Epic 4 — Consulter les objets disponibles à l'achat
FR20 : Epic 4 — Acheter un objet si le solde en Gils est suffisant
FR21 : Epic 4 — Utiliser un objet acheté en combat ou depuis l'inventaire
FR22 : Epic 4 — Consulter son inventaire
FR23 : Epic 5 — Sauvegarde automatique (niveau, XP, Gils, position, inventaire)
FR24 : Epic 5 — Restauration de la progression à la reprise
FR25 : Epic 5 — Réinitialiser sa partie
FR26 : Epic 2 — Sélection d'un ennemi approprié au niveau de la map
FR27 : Epic 2 — Chaque ennemi a ses propres stats (PV, attaque, défense)
FR28 : Epic 2 — Chaque ennemi rapporte XP et Gils définis

ARCH1 : Epic 1 — Init projet npm create @phaserjs/game@latest
ARCH2 : Epic 1 — Structure dossiers src/
ARCH3 : Epic 1 — GameState singleton (skeleton)
ARCH4 : Epic 1 — Fichiers JSON de données
ARCH5 : Epic 1 — UIScene parallel
ARCH6 : Epic 1 — Vercel CI/CD
ARCH7 : Epic 1 — constants.js
ARCH8 : Epic 2 — CombatEngine complet

UX-DR1 : Epic 2 — Vue combat 3/4, héros gauche, ennemi droite
UX-DR2 : Epic 2 — UI combat en bas (HP, noms, résultats)
UX-DR3 : Epic 2 — Boutons tactiles larges
UX-DR4 : Epic 2 — Fond de scène illustré contextuel
UX-DR5 : Epic 2 — Sprites 2D HD avec états idle/attaque
UX-DR6 : Epic 1 — Orientation paysage obligatoire

NFR1 : Epic 1 — Chargement < 5s
NFR2 : Epic 2 — 60fps combat
NFR3 : Epic 2 — < 300ms réponse actions
NFR4 : Epic 5 — localStorage transparent
NFR5 : Epic 1 — Bundle < 10 Mo

## Epic 1 : Le jeu se lance et le joueur arrive sur la map

Le joueur ouvre le lien, voit l'écran titre en mode paysage avec 2 options — *Nouvelle partie* ou *Continuer* (arrive directement sur la map). Il peut naviguer sur la map, progresser vers les niveaux et accéder à la boutique.

**Exigences couvertes :** FR1–5 · ARCH1–7 · UX-DR6 · NFR1, NFR5

### Story 1.1 : Init projet Phaser 4 + Vite + structure des dossiers

**En tant que** joueur,
**Je veux** pouvoir ouvrir Fire Ball dans mon navigateur mobile via un lien,
**Afin de** jouer sans installation ni friction technique.

**Critères d'acceptation :**

**Étant donné** que le projet est initialisé via `npm create @phaserjs/game@latest` (Phaser 4 → Vite → JavaScript) et que l'arborescence `src/` est mise en place selon l'architecture
**Quand** le lien du jeu est ouvert dans Chrome Android ou Safari iOS
**Alors** un canvas Phaser 4 s'affiche sans erreur dans le navigateur

**Et** `src/` contient : `main.js`, `constants.js`, `state/GameState.js`, `systems/CombatEngine.js`, tous les fichiers de scènes stubs, `data/`

**Et** `src/constants.js` exporte `SAVE_KEY`, `SCENES` et `MAX_LEVEL`

**Et** `npm run build` produit un `dist/` statique valide sans erreur

### Story 1.2 : GameState skeleton + fichiers JSON de données

**En tant que** joueur,
**Je veux** que mes données de jeu (ennemis, objets, seuils de niveau) soient chargées et que ma progression puisse être sauvegardée et restaurée,
**Afin de** retrouver mon état exact à chaque retour dans le jeu.

**Critères d'acceptation :**

**Étant donné** que `src/state/GameState.js` est créé comme singleton JS pur et que les fichiers JSON sont présents dans `src/data/`
**Quand** `GameState.save()` est appelé
**Alors** l'état du jeu est sérialisé et écrit dans `localStorage` sous la clé `fireball-save`

**Et** `GameState.load()` désérialise et restaure l'état depuis `localStorage` si la clé existe

**Et** si `localStorage` est indisponible ou plein, `save()` échoue silencieusement sans interrompre le jeu

**Et** `src/data/enemies.json` contient les stats des 3 ennemis MVP (nom, PV, attaque, défense, XP, Gils)

**Et** `src/data/items.json` contient le catalogue d'objets de la boutique (nom, prix, effet)

**Et** `src/data/levels.json` contient les seuils d'XP et les stats du Guerrier par niveau jusqu'à `MAX_LEVEL`

**Et** `GameState` est importable depuis n'importe quelle scène via `import GameState from '../state/GameState.js'` sans dépendance circulaire

### Story 1.3 : BootScene — chargement des assets et des données JSON

**En tant que** joueur,
**Je veux** que le jeu charge tous ses assets rapidement au démarrage,
**Afin d'** accéder à l'écran titre sans attente perceptible, même sur une connexion mobile 4G.

**Critères d'acceptation :**

**Étant donné** que `BootScene` est la première scène lancée par `main.js`
**Quand** la scène démarre
**Alors** elle charge via `this.load` tous les assets nécessaires au MVP : spritesheets du Guerrier, sprites des 3 ennemis, éléments UI, et les fichiers JSON (`enemies.json`, `items.json`, `levels.json`)

**Et** une fois le chargement terminé, `BootScene` lance `TitleScene` et `UIScene` (en mode `parallel`)

**Et** le chargement initial complet (réseau + rendu premier écran) est inférieur à 5 secondes sur une connexion 4G simulée (Chrome DevTools)

**Et** le bundle produit par `npm run build` est inférieur à 10 Mo

**Et** aucune asset manquante ne bloque le démarrage — les assets absents sont ignorés silencieusement en dev (les stubs visuels suffisent)

### Story 1.4 : TitleScene — écran titre en paysage (Nouvelle partie / Continuer)

**En tant que** joueur,
**Je veux** voir un écran titre en mode paysage avec deux options claires au lancement du jeu,
**Afin de** démarrer une nouvelle aventure ou reprendre ma partie là où je l'ai laissée.

**Critères d'acceptation :**

**Étant donné** que `TitleScene` est affichée après `BootScene`
**Quand** le joueur ouvre le jeu sur son mobile
**Alors** l'écran s'affiche en orientation paysage (667–932px de large) avec le titre "Fire Ball" et deux boutons : "Nouvelle partie" et "Continuer"

**Et** si aucune sauvegarde n'existe dans `localStorage`, le bouton "Continuer" est désactivé (grisé et non cliquable)

**Et** quand le joueur appuie sur "Nouvelle partie", `GameState` est réinitialisé et la scène passe à `MapScene`

**Et** quand le joueur appuie sur "Continuer", `GameState.load()` est appelé et la scène passe à `MapScene` avec l'état restauré

**Et** les deux boutons ont une zone de touch d'au moins 44×44px

**Et** l'animation d'intro post-"Nouvelle partie" est un placeholder vide (non implémentée en MVP)

### Story 1.5 : MapScene — navigation et progression sur la map

**En tant que** joueur,
**Je veux** voir ma position sur la map et pouvoir progresser vers le prochain niveau ou accéder à la boutique,
**Afin d'** avancer dans mon aventure et préparer mon Guerrier pour les combats à venir.

**Critères d'acceptation :**

**Étant donné** que `MapScene` est active après `TitleScene`
**Quand** le joueur arrive sur la map
**Alors** sa position actuelle est visible (niveau courant mis en évidence)

**Et** un bouton "Avancer" permet de progresser vers le niveau suivant — s'il y a un ennemi sur ce niveau, cela déclenche la transition vers `CombatScene`

**Et** un bouton "Boutique" permet de naviguer vers `ShopScene` depuis n'importe quel niveau

**Et** les deux boutons ont une zone de touch d'au moins 44×44px

**Et** `GameState.currentLevel` est mis à jour quand le joueur progresse

**Et** si le joueur atteint le dernier niveau, le bouton "Avancer" est désactivé

### Story 1.6 : UIScene — HUD persistent en mode parallel

**En tant que** joueur,
**Je veux** voir en permanence les informations essentielles de mon Guerrier (PV, niveau, Gils),
**Afin de** prendre des décisions éclairées sans avoir à naviguer dans des menus.

**Critères d'acceptation :**

**Étant donné** que `UIScene` est lancée en mode `parallel` par `BootScene`
**Quand** le joueur navigue entre `MapScene`, `CombatScene` et `ShopScene`
**Alors** le HUD reste affiché en superposition sur toutes ces scènes sans disparaître entre les transitions

**Et** le HUD affiche au minimum : PV actuels / PV max du Guerrier, niveau actuel, solde en Gils

**Et** le HUD se met à jour immédiatement quand `GameState` émet un événement (ex. `hero:hp-changed`, `hero:level-up`)

**Et** le HUD ne reçoit aucune donnée directement depuis les scènes — il écoute uniquement les événements Phaser

**Et** le HUD ne masque aucun élément interactif des autres scènes (position non intrusive)

### Story 1.7 : Déploiement Vercel + CI/CD GitHub

**En tant que** joueur,
**Je veux** accéder au jeu via un lien stable et toujours à jour,
**Afin de** jouer à la dernière version sans avoir à installer quoi que ce soit.

**Critères d'acceptation :**

**Étant donné** que le dépôt GitHub est connecté à un projet Vercel Hobby
**Quand** un commit est poussé sur la branche `main`
**Alors** Vercel déclenche automatiquement un nouveau déploiement

**Et** le déploiement produit un build statique (`npm run build`) sans erreur et le publie sur l'URL Vercel du projet

**Et** l'URL de production est accessible depuis Chrome Android et Safari iOS sans erreur

**Et** aucun backend, fonction serverless ou variable d'environnement secrète n'est requis — le déploiement est entièrement statique

## Epic 2 : Combat au tour par tour jouable

Le joueur peut déclencher un combat depuis la map, choisir d'attaquer ou de fuir, voir les dégâts en temps réel dans une vue 3/4 illustrée, et gagner (retour map avec récompenses brutes) ou perdre (écran game over).

**Exigences couvertes :** FR6, FR7–FR13, FR26–FR28 · ARCH8 · UX-DR1–5 · NFR2, NFR3

### Story 2.1 : CombatEngine — logique pure de résolution des tours

**En tant que** joueur,
**Je veux** que mes actions en combat (attaquer, fuir) soient résolues de manière cohérente et déterministe,
**Afin d'** avoir un système de combat fiable et prévisible.

**Critères d'acceptation :**

**Étant donné** que `src/systems/CombatEngine.js` est une classe JS pure sans aucun import Phaser
**Quand** `CombatEngine.resolveTurn(action)` est appelé avec `action = 'attack'`
**Alors** les dégâts infligés par le Guerrier sont calculés (basés sur ses stats vs défense de l'ennemi) et les PV de l'ennemi sont mis à jour

**Et** l'ennemi contre-attaque automatiquement dans le même tour et les PV du Guerrier sont mis à jour

**Et** `resolveTurn` retourne un objet `{ heroHp, enemyHp, log, outcome }` de manière synchrone

**Et** `outcome` vaut `null` si le combat continue, `'victory'` si l'ennemi est mort, `'defeat'` si le Guerrier est mort

**Et** quand `action = 'flee'`, `outcome` vaut `'fled'` (fuite toujours réussie en MVP) sans contre-attaque ennemie

**Et** `CombatEngine.initCombat(level)` sélectionne aléatoirement un ennemi dont le niveau correspond à `level` en lisant `enemies.json` via `GameState`

**Et** chaque ennemi a ses propres stats (PV, attaque, défense) et ses récompenses (XP, Gils) définies dans `enemies.json`

**Et** `CombatEngine` ne contient aucune logique d'affichage ni d'animation — uniquement de la logique de jeu

### Story 2.2 : CombatScene — UI et déroulement visuel d'un combat

**En tant que** joueur,
**Je veux** voir le combat se dérouler dans une vue illustrée avec mes PV, ceux de l'ennemi et les résultats de chaque action,
**Afin de** vivre un combat immersif et comprendre ce qui se passe à chaque tour.

**Critères d'acceptation :**

**Étant donné** que `CombatScene` est déclenchée par `MapScene` via `this.scene.start(SCENES.COMBAT)`
**Quand** la scène démarre
**Alors** `CombatEngine.initCombat(level)` est appelé et la vue s'affiche en perspective 3/4 : Guerrier à gauche, ennemi à droite, fond de scène en arrière-plan (placeholder acceptable en MVP)

**Et** l'UI en bas de l'écran affiche : nom et barre HP du Guerrier, nom et barre HP de l'ennemi

**Et** deux boutons tactiles sont visibles : "Attaquer" et "Fuir" (zone de touch min 44×44px)

**Et** quand le joueur appuie sur un bouton, `CombatEngine.resolveTurn(action)` est appelé et le résultat s'affiche (dégâts infligés / reçus) en moins de 300ms

**Et** les barres HP se mettent à jour visuellement après chaque tour

**Et** si `outcome === 'victory'`, `CombatScene` émet `combat:end` avec `{ outcome: 'victory' }` et retourne à `MapScene`

**Et** si `outcome === 'defeat'`, `CombatScene` émet `combat:end` avec `{ outcome: 'defeat' }` et lance `GameOverScene`

**Et** si `outcome === 'fled'`, `CombatScene` retourne à `MapScene` sans récompense

**Et** le rendu tourne à 60fps sur un smartphone iOS ou Android récent

### Story 2.3 : Sprites et fonds de scène illustrés

**En tant que** joueur,
**Je veux** voir des personnages et des décors visuellement soignés pendant les combats,
**Afin d'** être immergé dans l'univers du jeu.

**Critères d'acceptation :**

**Étant donné** que les assets sont chargés par `BootScene`
**Quand** `CombatScene` s'affiche
**Alors** le Guerrier est représenté par un sprite 2D illustré haute résolution (pas pixel art blocky) avec au moins 2 états visuels : idle et attaque

**Et** chacun des 3 ennemis MVP possède son propre sprite 2D illustré avec au moins 2 états visuels : idle et dégâts reçus

**Et** le fond de scène est un visuel illustré contextuel selon la zone de combat (ex. extérieur, donjon, intérieur) — au moins 2 fonds distincts pour le MVP

**Et** tous les assets sprites sont des fichiers dans `public/assets/sprites/` référencés via les clés définies dans `src/constants.js`

**Et** le poids total de tous les assets visuels ne fait pas dépasser le bundle au-delà de 10 Mo

### Story 2.4 : GameOverScene — écran de fin de partie

**En tant que** joueur,
**Je veux** voir un écran clair lorsque mon Guerrier est vaincu,
**Afin de** comprendre que ma partie est terminée et pouvoir recommencer.

**Critères d'acceptation :**

**Étant donné** que `CombatScene` a émis `combat:end` avec `{ outcome: 'defeat' }`
**Quand** `GameOverScene` s'affiche
**Alors** un message de fin de partie est visible (ex. "Game Over")

**Et** un bouton "Recommencer" réinitialise `GameState` et relance `TitleScene`

**Et** le bouton a une zone de touch d'au moins 44×44px

**Et** `GameState` n'est pas sauvegardé automatiquement lors d'une défaite — la progression du combat perdu n'est pas persistée

## Epic 3 : Progression du héros

Après un combat victorieux, le joueur reçoit XP et Gils, voit son guerrier monter de niveau, et peut dépenser des points de compétences pour améliorer ses stats.

**Exigences couvertes :** FR14, FR15, FR16, FR17, FR18

### Story 3.1 : Récompenses post-combat — XP et Gils

**En tant que** joueur,
**Je veux** recevoir de l'XP et des Gils après avoir vaincu un ennemi,
**Afin de** voir ma progression récompensée et disposer de ressources pour la boutique.

**Critères d'acceptation :**

**Étant donné** que `CombatScene` reçoit `outcome === 'victory'`
**Quand** le combat se termine par une victoire
**Alors** les récompenses de l'ennemi vaincu (XP et Gils définis dans `enemies.json`) sont ajoutées à `GameState.hero.xp` et `GameState.hero.gils`

**Et** `CombatScene` affiche brièvement les récompenses gagnées (ex. "+120 XP, +50 Gils") avant de retourner à `MapScene`

**Et** `GameState.save()` est appelé automatiquement après l'attribution des récompenses

**Et** si le combat se termine par une fuite (`outcome === 'fled'`), aucune récompense n'est attribuée

### Story 3.2 : Montée de niveau et attribution des points de compétences

**En tant que** joueur,
**Je veux** voir mon Guerrier monter de niveau quand il accumule suffisamment d'XP,
**Afin de** sentir ma progression et débloquer des améliorations.

**Critères d'acceptation :**

**Étant donné** que `GameState.hero.xp` vient d'être mis à jour après une victoire
**Quand** le total d'XP atteint ou dépasse le seuil du niveau suivant (défini dans `levels.json`)
**Alors** `GameState.hero.level` est incrémenté et les stats du Guerrier (PV max, attaque, défense) sont mises à jour selon `levels.json`

**Et** le joueur reçoit un nombre défini de points de compétences ajoutés à `GameState.hero.skillPoints`

**Et** un message de montée de niveau est affiché à l'écran (ex. "Niveau 3 !")

**Et** si plusieurs niveaux sont franchis d'un coup, chaque niveau est traité séquentiellement

**Et** `GameState.save()` est appelé automatiquement après la montée de niveau

**Et** au-delà de `MAX_LEVEL`, aucune montée de niveau supplémentaire ne se produit

### Story 3.3 : Dépense des points de compétences

**En tant que** joueur,
**Je veux** pouvoir dépenser mes points de compétences pour améliorer les stats de mon Guerrier,
**Afin de** personnaliser ma façon de jouer et renforcer mon personnage.

**Critères d'acceptation :**

**Étant donné** que le joueur dispose d'au moins un point de compétence (`GameState.hero.skillPoints > 0`)
**Quand** il accède à l'écran de compétences (accessible depuis `MapScene`)
**Alors** les stats améliorables sont affichées (PV max, attaque, défense) avec le coût en points pour chaque amélioration

**Et** le joueur peut appuyer sur une stat pour dépenser un point et l'améliorer immédiatement

**Et** `GameState.hero.skillPoints` est décrémenté et la stat correspondante est mise à jour dans `GameState`

**Et** si `skillPoints === 0`, tous les boutons d'amélioration sont désactivés

**Et** `GameState.save()` est appelé automatiquement après chaque dépense

**Et** les boutons ont une zone de touch d'au moins 44×44px

## Epic 4 : Boutique & inventaire

Le joueur peut acheter des objets avec ses Gils depuis la boutique, consulter son inventaire, et utiliser un objet pendant un combat ou hors combat.

**Exigences couvertes :** FR19, FR20, FR21, FR22

### Story 4.1 : ShopScene — consulter et acheter des objets

**En tant que** joueur,
**Je veux** consulter les objets disponibles et en acheter avec mes Gils,
**Afin de** préparer mon Guerrier pour les prochains combats.

**Critères d'acceptation :**

**Étant donné** que `ShopScene` est lancée depuis `MapScene` via le bouton "Boutique"
**Quand** la scène s'affiche
**Alors** la liste des objets disponibles est affichée avec pour chaque objet : nom, description de l'effet et prix en Gils (lus depuis `items.json`)

**Et** le solde actuel en Gils du joueur est visible à l'écran

**Et** quand le joueur appuie sur "Acheter" pour un objet dont le prix est ≤ son solde, l'objet est ajouté à `GameState.inventory` et le prix est déduit de `GameState.hero.gils`

**Et** si le solde est insuffisant, le bouton "Acheter" est désactivé pour cet objet

**Et** `GameState.save()` est appelé automatiquement après chaque achat

**Et** un bouton "Retour" permet de revenir à `MapScene`

**Et** tous les boutons ont une zone de touch d'au moins 44×44px

### Story 4.2 : Inventaire — consulter et utiliser des objets

**En tant que** joueur,
**Je veux** consulter mes objets et les utiliser en combat ou depuis la map,
**Afin de** soigner mon Guerrier ou appliquer des effets au bon moment.

**Critères d'acceptation :**

**Étant donné** que le joueur a au moins un objet dans `GameState.inventory`
**Quand** il ouvre l'inventaire (accessible depuis `MapScene` ou depuis `CombatScene` pendant son tour)
**Alors** la liste de ses objets est affichée avec nom, effet et quantité pour chaque entrée

**Et** quand le joueur utilise un objet, son effet est appliqué immédiatement à `GameState.hero` (ex. restauration de PV)

**Et** la quantité de l'objet utilisé est décrémentée dans `GameState.inventory` (supprimé si quantité = 0)

**Et** `GameState.save()` est appelé automatiquement après chaque utilisation

**Et** si un objet est utilisé depuis `CombatScene`, cela compte comme l'action du tour du joueur (pas de contre-attaque ennemie supplémentaire)

**Et** tous les boutons ont une zone de touch d'au moins 44×44px

## Epic 5 : Persistance & reprise de session

### Story 5.1 : Sauvegarde automatique — vérification complète des déclencheurs

**En tant que** joueur,
**Je veux** que ma progression soit sauvegardée automatiquement après chaque événement significatif,
**Afin de** ne jamais perdre de progrès en cas de fermeture ou crash du navigateur.

**Exigences couvertes :** FR23, NFR4

**Critères d'acceptation :**

**Étant donné** qu'un combat se termine par une victoire
**Quand** `CombatEngine` retourne `outcome = 'victory'`
**Alors** `GameState.save()` est appelé avant la transition vers `MapScene`

**Et** la clé `fireball-save` dans localStorage contient l'état mis à jour (XP, Gils, niveau, inventaire)

**Étant donné** qu'un combat se termine par une fuite
**Quand** `CombatEngine` retourne `outcome = 'fled'`
**Alors** `GameState.save()` est appelé avant la transition vers `MapScene`

**Étant donné** qu'un combat se termine par une défaite
**Quand** `CombatEngine` retourne `outcome = 'defeat'`
**Alors** `GameState.save()` n'est **pas** appelé — l'état en localStorage correspond au dernier déclencheur valide (avant le combat perdu)

**Et** la transition vers `GameOverScene` s'effectue sans écriture en localStorage

**Étant donné** que le joueur achète un objet dans `ShopScene`
**Quand** la transaction est confirmée (Gils déduits, objet ajouté à l'inventaire)
**Alors** `GameState.save()` est appelé immédiatement après la mise à jour de l'état

**Étant donné** que le joueur monte de niveau après un combat
**Quand** le calcul de montée de niveau est complété (y compris en cas de paliers multiples franchis d'un coup)
**Alors** `GameState.save()` est appelé une seule fois, après le traitement séquentiel de tous les paliers

**Étant donné** que le joueur dépense des points de compétences
**Quand** la dépense est confirmée
**Alors** `GameState.save()` est appelé immédiatement

**Et** si `localStorage.setItem()` lève une exception (quota dépassé, mode privé), l'erreur est silencieusement ignorée et le jeu continue normalement en mémoire

### Story 5.2 : Restauration complète de session

**En tant que** joueur,
**Je veux** retrouver mon état exact quand je reviens sur le jeu,
**Afin de** reprendre ma partie là où je l'avais laissée sans rien ressaisir.

**Exigences couvertes :** FR24

**Critères d'acceptation :**

**Étant donné** que le joueur a une sauvegarde existante dans localStorage (clé `fireball-save`)
**Quand** il ouvre le jeu et arrive sur `TitleScene`
**Alors** le bouton "Continuer" est actif

**Et** quand il appuie sur "Continuer", `GameState.load()` désérialise la sauvegarde et restaure l'intégralité de l'état : niveau, XP, Gils, PV actuels, inventaire et position sur la map

**Et** le joueur est redirigé directement vers `MapScene` à la position sauvegardée

**Étant donné** qu'aucune sauvegarde n'existe dans localStorage
**Quand** le joueur arrive sur `TitleScene`
**Alors** le bouton "Continuer" est désactivé (grisé)

**Et** seul le bouton "Nouvelle partie" est interactif

**Étant donné** que la sauvegarde en localStorage est corrompue ou illisible (`JSON.parse` échoue)
**Quand** `GameState.load()` tente de la lire
**Alors** l'erreur est ignorée silencieusement et le jeu se comporte comme s'il n'y avait aucune sauvegarde (bouton "Continuer" désactivé)

**Et** tous les boutons ont une zone de touch d'au moins 44×44px

### Story 5.3 : Réinitialisation de la partie

**En tant que** joueur,
**Je veux** pouvoir recommencer une nouvelle partie depuis zéro,
**Afin de** repartir avec un personnage vierge si je le souhaite.

**Exigences couvertes :** FR25

**Critères d'acceptation :**

**Étant donné** que le joueur est sur `TitleScene` avec une sauvegarde existante
**Quand** il appuie sur "Nouvelle partie"
**Alors** `GameState.reset()` remet tous les champs à leurs valeurs initiales (niveau 1, XP 0, Gils 0, PV max, inventaire vide, position de départ)

**Et** `localStorage.removeItem(SAVE_KEY)` supprime l'ancienne sauvegarde

**Et** le joueur est redirigé vers `MapScene` avec l'état réinitialisé

**Étant donné** que le joueur est sur `GameOverScene` après une défaite
**Quand** il appuie sur "Recommencer"
**Alors** `GameState.reset()` est appelé (même comportement que "Nouvelle partie" depuis `TitleScene`)

**Et** le joueur est redirigé vers `TitleScene`

**Et** tous les boutons ont une zone de touch d'au moins 44×44px

## Epic List

### Epic 1 : Le jeu se lance et le joueur arrive sur la map
Le joueur ouvre le lien, voit l'écran titre en mode paysage avec 2 options — *Nouvelle partie* (placeholder d'animation intro, post-MVP) ou *Continuer* (arrive directement sur la map). Il peut naviguer sur la map, progresser vers les niveaux et accéder à la boutique.
**FRs couverts :** FR1, FR2, FR3, FR4, FR5 · ARCH1–7 · UX-DR6 · NFR1, NFR5

### Epic 2 : Combat au tour par tour jouable
Le joueur peut déclencher un combat depuis la map, choisir d'attaquer ou de fuir, voir les dégâts en temps réel dans une vue 3/4 illustrée, et gagner (retour map avec récompenses brutes) ou perdre (écran game over).
**FRs couverts :** FR6, FR7–FR13, FR26–FR28 · ARCH8 · UX-DR1–5 · NFR2, NFR3

### Epic 3 : Progression du héros
Après un combat victorieux, le joueur reçoit XP et Gils, voit son guerrier monter de niveau, et peut dépenser des points de compétences pour améliorer ses stats.
**FRs couverts :** FR14, FR15, FR16, FR17, FR18

### Epic 4 : Boutique & inventaire
Le joueur peut acheter des objets avec ses Gils depuis la boutique, consulter son inventaire, et utiliser un objet pendant un combat ou hors combat.
**FRs couverts :** FR19, FR20, FR21, FR22

### Epic 5 : Persistance & reprise de session
La progression du joueur est sauvegardée automatiquement après chaque événement significatif. Au retour, il retrouve son état exact. Il peut aussi réinitialiser sa partie depuis l'écran titre.
**FRs couverts :** FR23, FR24, FR25 · NFR4
