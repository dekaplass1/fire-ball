import { SCENES } from '../constants.js';
import GameState from '../state/GameState.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.TITLE });
  }

  create() {
    const cx = this.scale.width / 2;

    this.add.text(cx, 120, 'Fire Ball', {
      fontSize: '56px',
      color: '#ffaa00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this._makeButton(cx, 250, 'Nouvelle partie', '#e63946', () => {
      GameState.reset();
      this.scene.start(SCENES.MAP);
    });

    const hasSave = GameState.hasSave();
    const continuerBtn = this._makeButton(cx, 330, 'Continuer', '#457b9d', () => {
      GameState.load();
      this.scene.start(SCENES.MAP);
    });

    if (!hasSave) {
      continuerBtn.setAlpha(0.4).disableInteractive();
    }
  }

  _makeButton(x, y, label, bgColor, onClick) {
    const btn = this.add.text(x, y, label, {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: bgColor,
      padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', onClick);
    btn.on('pointerover',  () => btn.setAlpha(0.85));
    btn.on('pointerout',   () => btn.setAlpha(1));

    return btn;
  }
}
