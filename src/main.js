import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import MapScene from './scenes/MapScene.js';
import CombatScene from './scenes/CombatScene.js';
import ShopScene from './scenes/ShopScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import UIScene from './scenes/UIScene.js';

Phaser.GameObjects.Text.DEFAULT_RESOLUTION = window.devicePixelRatio;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: window.devicePixelRatio,
    autoRound: true,
  },
  render: {
    roundPixels: true,
  },
  scene: [
    BootScene,
    TitleScene,
    MapScene,
    CombatScene,
    ShopScene,
    GameOverScene,
    UIScene,
  ],
};

new Phaser.Game(config);
