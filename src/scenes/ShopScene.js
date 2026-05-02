import Phaser from 'phaser';
import { SCENES } from '../constants.js';

export default class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.SHOP });
  }

  create() {
    // Story 4.1 : consulter et acheter des objets
  }
}
