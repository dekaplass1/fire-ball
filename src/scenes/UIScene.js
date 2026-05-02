import { SCENES } from '../constants.js';
import GameState from '../state/GameState.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.UI });
  }

  create() {
    const { hp, maxHp, level, gils } = GameState.hero;

    this._hpText = this.add.text(50, 20, `PV: ${hp}/${maxHp}`, {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0, 0.5).setScrollFactor(0);

    this._levelText = this.add.text(400, 20, `Niv.${level}`, {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5).setScrollFactor(0);

    this._gilsText = this.add.text(750, 20, `\u{1F4B0} ${gils}`, {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(1, 0.5).setScrollFactor(0);

    this.game.events.on('hero:hp-changed',   this._onHpChanged,   this);
    this.game.events.on('hero:level-up',     this._onLevelUp,     this);
    this.game.events.on('hero:gils-changed', this._onGilsChanged, this);
  }

  _onHpChanged({ hp, maxHp }) {
    this._hpText.setText(`PV: ${hp}/${maxHp}`);
  }

  _onLevelUp({ level }) {
    this._levelText.setText(`Niv.${level}`);
  }

  _onGilsChanged({ gils }) {
    this._gilsText.setText(`\u{1F4B0} ${gils}`);
  }
}
