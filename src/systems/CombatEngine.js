// CombatEngine — logique pure de combat, zéro import Phaser
import enemiesData from '../data/enemies.json';
import GameState from '../state/GameState.js';

let _enemy = null;

const CombatEngine = {
  initCombat(mapLevel) {
    const eligible = enemiesData.filter(e => e.minLevel <= mapLevel);
    const template = eligible[Math.floor(Math.random() * eligible.length)];
    _enemy = { ...template };
    return _enemy;
  },

  resolveTurn(action) {
    if (action === 'flee') {
      return {
        heroHp: GameState.hero.hp,
        enemyHp: _enemy.hp,
        log: ['Vous avez fui !'],
        outcome: 'fled',
      };
    }

    const log = [];

    const heroDmg = Math.max(1, GameState.hero.atk - _enemy.def);
    _enemy.hp = Math.max(0, _enemy.hp - heroDmg);
    log.push(`Vous infligez ${heroDmg} dégât${heroDmg > 1 ? 's' : ''} à ${_enemy.name}.`);

    if (_enemy.hp <= 0) {
      return { heroHp: GameState.hero.hp, enemyHp: 0, log, outcome: 'victory' };
    }

    const enemyDmg = Math.max(1, _enemy.atk - GameState.hero.def);
    GameState.hero.hp = Math.max(0, GameState.hero.hp - enemyDmg);
    log.push(`${_enemy.name} vous inflige ${enemyDmg} dégât${enemyDmg > 1 ? 's' : ''}.`);

    const outcome = GameState.hero.hp <= 0 ? 'defeat' : null;
    return { heroHp: GameState.hero.hp, enemyHp: _enemy.hp, log, outcome };
  },

  getEnemy() {
    return _enemy;
  },
};

export default CombatEngine;
