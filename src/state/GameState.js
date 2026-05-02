// GameState — singleton JS pur (PAS une Phaser.Scene, AUCUN import Phaser)

import { SAVE_KEY } from '../constants.js';

const _initialHeroState = {
  name: 'Guerrier',
  level: 1,
  xp: 0,
  gils: 50,
  hp: 30,
  maxHp: 30,
  atk: 8,
  def: 4,
  skillPoints: 0,
  currentMapLevel: 1,
};

const GameState = {
  hero: { ..._initialHeroState },
  inventory: [],

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        hero: this.hero,
        inventory: this.inventory,
      }));
    } catch (e) {
      // silencieux — le jeu continue en mémoire
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.hero) return null;
      this.hero = data.hero;
      this.inventory = data.inventory ?? [];
      return data;
    } catch (e) {
      return null;
    }
  },

  reset() {
    this.hero = { ..._initialHeroState };
    this.inventory = [];
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      // silencieux
    }
  },

  hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (e) {
      return false;
    }
  },
};

export default GameState;
