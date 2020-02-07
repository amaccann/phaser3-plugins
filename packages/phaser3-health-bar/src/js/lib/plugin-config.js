import Phaser from 'phaser';

const NOOP = () => {};

export const IS_SPRITE = child => child instanceof Phaser.GameObjects.Sprite;

export const PLUGIN_DEFAULT_CONFIG = {
  childSelector: IS_SPRITE,
};

class PluginConfig {
  data = {};

  setConfig(data = {}) {
    this.data = {
      ...PLUGIN_DEFAULT_CONFIG,
      ...this.data,
      ...data,
    };
  }

  get(key) {
    return this.data[key];
  }
}

export default new PluginConfig();
