import Phaser from 'phaser';
import { SCENES } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create() {
    // Story 2.4 : écran de fin de partie (défaite uniquement)
  }
}
