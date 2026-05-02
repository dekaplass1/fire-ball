import Phaser from 'phaser';
import { SCENES, CACHE_KEYS, ASSET_KEYS } from '../constants.js';

import enemiesUrl from '../data/enemies.json?url';
import itemsUrl   from '../data/items.json?url';
import levelsUrl  from '../data/levels.json?url';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {
    // Données JSON de jeu
    this.load.json(CACHE_KEYS.ENEMIES, enemiesUrl);
    this.load.json(CACHE_KEYS.ITEMS,   itemsUrl);
    this.load.json(CACHE_KEYS.LEVELS,  levelsUrl);

    // Sprites héros (absents jusqu'à Story 2.3 — warnings Phaser acceptés)
    this.load.spritesheet(ASSET_KEYS.HERO_IDLE,   'assets/sprites/hero/idle.png',   { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(ASSET_KEYS.HERO_ATTACK, 'assets/sprites/hero/attack.png', { frameWidth: 64, frameHeight: 64 });

    // Sprites ennemis
    this.load.image(ASSET_KEYS.ENEMY_GOBELIN, 'assets/sprites/enemies/gobelin.png');
    this.load.image(ASSET_KEYS.ENEMY_LOUP,    'assets/sprites/enemies/loup.png');
    this.load.image(ASSET_KEYS.ENEMY_OGRE,    'assets/sprites/enemies/ogre.png');

    // UI combat
    this.load.image(ASSET_KEYS.BTN_ATTACK, 'assets/ui/btn-attack.png');
    this.load.image(ASSET_KEYS.BTN_FLEE,   'assets/ui/btn-flee.png');
    this.load.image(ASSET_KEYS.BTN_ITEM,   'assets/ui/btn-item.png');

    // Fond de scène combat
    this.load.image(ASSET_KEYS.BG_COMBAT, 'assets/sprites/backgrounds/bg-combat.png');
  }

  create() {
    this.scene.launch(SCENES.UI);   // UIScene en mode parallel (HUD persistent)
    this.scene.start(SCENES.TITLE); // Transition vers TitleScene (arrête BootScene)
  }
}
