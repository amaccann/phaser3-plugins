
const NOOP = () => {};
const DEFAULT_CONFIG = {
  outlineColor: 0x00ff00,
  outlineWidth: 2,
  onSelect: NOOP,
  rectBgColor: 0x33ff33,
  rectAlpha: 0.5,
};

class PluginConfig {
  data = {};

  setConfig(data = {}) {
    this.data = {
      ...DEFAULT_CONFIG,
      ...data
    };
  }

  get(key) {
    return this.data[key];
  }
}

export default new PluginConfig();
