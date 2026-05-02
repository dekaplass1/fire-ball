---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments: []
classification:
  projectType: web_app
  domain: gaming
  complexity: medium
  projectContext: greenfield
releaseMode: phased
workflowType: 'prd'
---

# Document de Spécifications Produit — Fire Ball

**Auteur :** Sumio
**Date :** 2026-05-01

---

## Résumé Exécutif

Fire Ball est un JRPG solo au tour par tour, jouable dans le navigateur sur smartphone sans installation, conçu pour être partagé entre amis proches. Le projet cible un cercle intime — pas le grand public — en proposant un RPG accessible (lien URL, iOS et Android) centré sur l'ambiance et la narration plutôt que sur la complexité mécanique.

Le cœur de l'expérience est l'alternance entre scènes narratives illustrées (style JRPG japonais, bulles de dialogue) et combats au tour par tour. Les héros se recrutent progressivement — chevalier, magicien, puis deux autres personnages — jusqu'à un groupe de 4. La map est contemplative : les personnages progressent automatiquement de niveau en niveau, sans déplacement libre. L'investissement émotionnel repose sur l'univers, pas sur la profondeur système.

### Ce qui rend Fire Ball spécial

Fire Ball est un cadeau interactif : une expérience soignée, faite avec intention pour un cercle intime. La proposition de valeur est l'accessibilité totale (lien URL, zéro friction) combinée à une esthétique vintage assumée — nostalgie visuelle et sonore, illustrations narratives, mécaniques épurées. Le sort Fire Ball, signature du jeu, incarne cette philosophie : puissant, simple, immédiatement satisfaisant.

## Classification du projet

- **Type :** Web app (Phaser 3 + Vite, navigateur)
- **Domaine :** Gaming / JRPG nostalgique
- **Complexité :** Moyenne
- **Contexte :** Greenfield

## Critères de succès

### Succès utilisateur

Un joueur qui finit une session dit : *"C'est trop sympa, c'est bien fait, j'aime l'ambiance — je veux connaître la suite."* Critère émotionnel : sentiment de qualité, d'univers soigné, envie de revenir.

### Succès technique

- Zéro backend — état de jeu géré entièrement côté client
- Cible : smartphones récents iOS et Android, pas de support legacy
- Animations de sorts et d'invocations soignées comme indicateur de qualité perçue

### Succès business

Projet personnel sans objectif commercial. Succès = le jeu tourne, les amis y jouent, l'expérience donne envie de continuer l'histoire.

### Résultats mesurables

- Le jeu se lance sur navigateur mobile sans installation
- Une session complète (map → combat → progression → boutique) est jouable de bout en bout
- La progression (XP, compétences, boutique) fonctionne sans friction

## Parcours utilisateur

### Parcours 1 — Lucas, première session

Lucas reçoit un message : *"J'ai fait un jeu, essaie ça."* Un lien. Il clique depuis son Samsung Galaxy. Chargement en quelques secondes — pas d'app store, pas de compte. Écran titre : musique rétro, ambiance pixel art. Il appuie sur "Jouer".

Il découvre son guerrier sur une carte simple. Un chemin, un premier donjon. Il avance. Combat : un slime lui fait face. "Attaquer". Victoire — +20 XP, +10 Gils. Un point de compétence à dépenser. Il renforce l'attaque, bat deux autres monstres, achète une potion. Quarante minutes passent. Il envoie un message : *"C'est trop bien, c'est quoi la suite ?"*

**Capacités révélées :** écran titre, map, déclenchement de combat, système de tour, récompenses XP/or, écran de compétences, boutique.

### Parcours 2 — Lucas, retour le lendemain

Il rouvre le lien. Le jeu retrouve son état — guerrier niveau 2, 45 Gils, position sur la map. Il reprend sans friction.

**Capacités révélées :** sauvegarde locale (localStorage), reprise de session sans login.

### Parcours 3 — Le créateur

Ajout d'un ennemi en local, vérification du combat et des animations, déploiement, envoi du lien.

**Capacités révélées :** configuration des ennemis sans backend, hébergement statique suffisant.

### Résumé des capacités révélées

| Capacité | Parcours source |
|---|---|
| Écran titre + lancement immédiat | 1 |
| Navigation sur map | 1 |
| Combat tour par tour avec récompenses | 1 |
| Système XP / Gils / points de compétences | 1 |
| Boutique d'objets | 1 |
| Sauvegarde locale (localStorage) | 2 |
| Reprise de session | 2 |
| Configuration ennemis sans backend | 3 |

## Scoping & Développement phasé

### Stratégie

**Approche :** MVP d'expérience — délivrer une boucle de jeu complète et plaisante avec un seul héros, suffisante pour que les amis y jouent et donnent envie de voir la suite.

**Ressources :** Solo developer, stack frontend uniquement.

### Phase 1 — MVP (Version jouable initiale)

**Capacités indispensables :**
- Écran titre avec lancement immédiat
- Map simple avec déplacement automatique entre niveaux
- 1 héros jouable : le Guerrier (PV, stats d'attaque)
- 3 ennemis de base avec stats variées
- Combat tour par tour : Attaquer / Fuite
- Récompenses post-combat : XP + Gils
- Système de niveaux et points de compétences (dépense sur le Guerrier)
- Boutique : achat d'objets (potions a minima)
- Sauvegarde locale (localStorage) — reprise de session
- Écrans : titre, map, combat, boutique, game over

### Phase 2 — Post-MVP

- Recrutement progressif : Magicien (système de PM et sorts dont Fire Ball)
- Scènes narratives : illustrations + bulles de dialogue style JRPG
- 2 héros supplémentaires pour compléter le groupe de 4
- Ennemis avec types et résistances (ex : vulnérabilité eau/feu)
- Combats en groupe (2 à 4 héros)

### Phase 3 — Vision

- Histoire complète multi-chapitres
- Animations d'invocations avancées
- Musiques d'ambiance thématiques par zone
- Illustrations originales

### Gestion des risques

**Technique :** Le système de progression (compétences + boutique) est le composant le plus complexe du MVP — à implémenter tôt pour valider l'architecture.

**Ressources :** Si le scope paraît trop large, la boutique peut être réduite à une interface minimale sans compromettre l'essentiel.

## Exigences spécifiques Web App

### Architecture technique

- **Rendu :** Canvas HTML5 via Phaser 3 + Vite
- **État :** localStorage pour la persistance (niveau, XP, Gils, position, inventaire)
- **Assets :** Sprites, tilesets, musiques chargés statiquement au démarrage
- **Déploiement :** Hébergement statique (Vercel, GitHub Pages ou équivalent) — aucun serveur

### Compatibilité navigateur

| Navigateur | Version cible |
|---|---|
| Chrome Android | Dernières 2 versions |
| Safari iOS | Dernières 2 versions |
| Firefox Mobile | Support secondaire |

### Responsive & Touch

- Viewport cible : 375px–430px (portrait uniquement)
- Interface de combat 100% tactile : boutons larges, zones de tap confortables
- Pas de keyboard/mouse requis

## Exigences fonctionnelles

### Navigation & Écrans

- FR1 : Le joueur peut lancer une nouvelle partie depuis l'écran titre
- FR2 : Le joueur peut reprendre une partie existante depuis l'écran titre
- FR3 : Le joueur peut visualiser la map et sa position actuelle
- FR4 : Le joueur peut progresser vers le prochain niveau depuis la map
- FR5 : Le joueur peut accéder à la boutique depuis la map
- FR6 : Le joueur voit un écran de game over lorsque le Guerrier atteint 0 PV

### Combat

- FR7 : Le joueur peut déclencher un combat en atteignant un niveau sur la map
- FR8 : Le joueur peut choisir l'action "Attaquer" pendant son tour
- FR9 : Le joueur peut choisir l'action "Fuir" pendant son tour
- FR10 : Le système résout les tours en alternant joueur et ennemi
- FR11 : Le joueur voit les PV du Guerrier et de l'ennemi à chaque tour
- FR12 : Le joueur voit le résultat de chaque action (dégâts infligés / reçus)
- FR13 : Le combat se termine automatiquement à la mort de l'ennemi ou du Guerrier

### Progression du héros

- FR14 : Le joueur reçoit de l'XP à la fin de chaque combat victorieux
- FR15 : Le Guerrier monte de niveau lorsque le seuil d'XP est atteint
- FR16 : La montée de niveau attribue des points de compétences au joueur
- FR17 : Le joueur peut dépenser des points de compétences pour améliorer les stats du Guerrier
- FR18 : Le joueur reçoit des Gils à la fin de chaque combat victorieux

### Boutique

- FR19 : Le joueur peut consulter les objets disponibles à l'achat
- FR20 : Le joueur peut acheter un objet si son solde en Gils est suffisant
- FR21 : Le joueur peut utiliser un objet acheté pendant un combat ou depuis l'inventaire
- FR22 : Le joueur peut consulter son inventaire

### Persistance

- FR23 : La progression est sauvegardée automatiquement (niveau, XP, Gils, position, inventaire)
- FR24 : La progression est restaurée à la reprise d'une partie existante
- FR25 : Le joueur peut réinitialiser sa partie

### Ennemis

- FR26 : Le système sélectionne un ennemi approprié au niveau actuel de la map
- FR27 : Chaque ennemi dispose de stats propres (PV, attaque, défense)
- FR28 : Chaque ennemi rapporte une quantité définie d'XP et de Gils

## Exigences non-fonctionnelles

### Performance

- NFR1 : Chargement initial < 5 secondes sur connexion mobile 4G
- NFR2 : Animations de combat à 60 fps sur smartphones iOS et Android récents
- NFR3 : Réponse aux actions de combat (appui bouton → résolution du tour) < 300ms
- NFR4 : Sauvegarde et chargement localStorage transparents, sans délai perceptible
- NFR5 : Bundle applicatif < 10 Mo
