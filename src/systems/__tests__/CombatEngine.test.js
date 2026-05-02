import { describe, it, expect, beforeEach } from 'vitest';
import CombatEngine from '../CombatEngine.js';
import GameState from '../../state/GameState.js';

beforeEach(() => {
  GameState.reset();
});

// --- initCombat ---

describe('CombatEngine.initCombat', () => {
  it('retourne un ennemi avec les champs requis', () => {
    const enemy = CombatEngine.initCombat(1);
    expect(enemy).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      hp: expect.any(Number),
      atk: expect.any(Number),
      def: expect.any(Number),
      xpReward: expect.any(Number),
      gilsReward: expect.any(Number),
    });
    expect(enemy.hp).toBeGreaterThan(0);
  });

  it('ne sélectionne que des ennemis dont minLevel <= mapLevel', () => {
    for (let i = 0; i < 20; i++) {
      const enemy = CombatEngine.initCombat(1);
      expect(enemy.minLevel).toBeLessThanOrEqual(1);
    }
  });

  it('au niveau 1 seul le gobelin est éligible', () => {
    for (let i = 0; i < 10; i++) {
      expect(CombatEngine.initCombat(1).id).toBe('gobelin');
    }
  });

  it('retourne une copie indépendante à chaque appel', () => {
    const e1 = CombatEngine.initCombat(1);
    const e2 = CombatEngine.initCombat(1);
    expect(e1).not.toBe(e2);
  });
});

// --- resolveTurn : fuite ---

describe('CombatEngine.resolveTurn — flee', () => {
  it('retourne outcome "fled"', () => {
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('flee');
    expect(result.outcome).toBe('fled');
  });

  it('ne modifie pas les PV du héros', () => {
    CombatEngine.initCombat(1);
    const hpBefore = GameState.hero.hp;
    CombatEngine.resolveTurn('flee');
    expect(GameState.hero.hp).toBe(hpBefore);
  });

  it('retourne heroHp et enemyHp corrects', () => {
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('flee');
    expect(result.heroHp).toBe(GameState.hero.hp);
    expect(result.enemyHp).toBeGreaterThan(0);
  });
});

// --- resolveTurn : attaque ---

describe('CombatEngine.resolveTurn — attack', () => {
  it('réduit les PV de l\'ennemi d\'au moins 1', () => {
    CombatEngine.initCombat(1);
    const enemyHpBefore = CombatEngine.getEnemy().hp;
    GameState.hero.atk = 1;
    CombatEngine.resolveTurn('attack');
    expect(CombatEngine.getEnemy().hp).toBeLessThan(enemyHpBefore);
  });

  it('inflige minimum 1 dégât même si atk < def ennemi', () => {
    GameState.hero.atk = 0;
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    expect(result.log[0]).toMatch(/1 dégât/);
  });

  it('retourne un log non vide', () => {
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    expect(result.log.length).toBeGreaterThanOrEqual(1);
  });

  it('outcome null si le combat continue', () => {
    GameState.hero.hp = 200;
    GameState.hero.atk = 1;
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    expect(result.outcome).toBe(null);
  });

  it('outcome "victory" et enemyHp 0 quand l\'ennemi est tué', () => {
    GameState.hero.atk = 999;
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    expect(result.outcome).toBe('victory');
    expect(result.enemyHp).toBe(0);
  });

  it('pas de contre-attaque si l\'ennemi est tué', () => {
    GameState.hero.atk = 999;
    GameState.hero.hp = 30;
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    expect(result.heroHp).toBe(30);
    expect(GameState.hero.hp).toBe(30);
  });

  it('outcome "defeat" et heroHp 0 quand le héros est tué', () => {
    GameState.hero.hp = 1;
    GameState.hero.def = 0;
    GameState.hero.atk = 1;
    CombatEngine.initCombat(1);
    const result = CombatEngine.resolveTurn('attack');
    if (result.outcome !== 'victory') {
      expect(result.outcome).toBe('defeat');
      expect(result.heroHp).toBe(0);
      expect(GameState.hero.hp).toBe(0);
    }
  });

  it('met à jour GameState.hero.hp après contre-attaque', () => {
    GameState.hero.hp = 100;
    GameState.hero.def = 0;
    GameState.hero.atk = 1;
    CombatEngine.initCombat(1);
    const hpBefore = GameState.hero.hp;
    const result = CombatEngine.resolveTurn('attack');
    if (result.outcome !== 'victory') {
      expect(GameState.hero.hp).toBeLessThan(hpBefore);
      expect(result.heroHp).toBe(GameState.hero.hp);
    }
  });
});

// --- getEnemy ---

describe('CombatEngine.getEnemy', () => {
  it('retourne l\'ennemi courant après initCombat', () => {
    const enemy = CombatEngine.initCombat(1);
    expect(CombatEngine.getEnemy()).toBe(enemy);
  });
});
