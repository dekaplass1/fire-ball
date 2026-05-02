import { SCENES, MAX_MAP_LEVEL } from '../constants.js';
import GameState from '../state/GameState.js';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MAP });
  }

  create() {
    const cx = this.scale.width / 2;
    const mapLevel = GameState.hero.currentMapLevel;

    this.add.text(cx, 70, 'Carte', {
      fontSize: '40px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, 140, `Niveau ${mapLevel} / ${MAX_MAP_LEVEL}`, {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    const avancerBtn = this._makeButton(cx, 250, '⚔  Avancer', '#e63946', () => {
      this.scene.start(SCENES.COMBAT);
    });

    if (mapLevel >= MAX_MAP_LEVEL) {
      avancerBtn.setAlpha(0.4).disableInteractive();
    }

    this._makeButton(cx, 330, '🏪  Boutique', '#457b9d', () => {
      this.scene.start(SCENES.SHOP);
    });
  }

  _makeButton(x, y, label, bgColor, onClick) {
    const btn = this.add.text(x, y, label, {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: bgColor,
      padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', onClick);
    btn.on('pointerover', () => btn.setAlpha(0.85));
    btn.on('pointerout',  () => btn.setAlpha(1));

    return btn;
  }
}
