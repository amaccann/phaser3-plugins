import Phaser from 'phaser';

const NOOP = () => {};

export const IS_SPRITE = child => child instanceof Phaser.GameObjects.Sprite;
export const IS_SELECTED = child => child.isEnabled;

export const PLUGIN_DEFAULT_CONFIG = {
  camera: null,
  childSelector: IS_SPRITE,
  backgroundColor: 0x000000,
  barHeight: 15,
  currentValueColor: 0x33ff33,
  offsetX: 0,
  offsetY: 10,
  outlineColor: 0xffffff,
  outlineWidth: 2,
  propToWatch: {
    current: 'health',
    max: 'maxHealth',
    min: 'minHealth',
  },
  visibleOnSelector: IS_SELECTED,
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
