const NOOP = () => {};

// 0: No button or un-initialized
// 1: Left button
// 2: Right button
// 4: Wheel button or middle button
// 8: 4th button (typically the "Browser Back" button)
// 16: 5th button (typically the "Browser Forward" button)
export const MOUSE_BUTTONS = {
  NO_BUTTON: 0,
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4,
  FOURTH_BUTTON: 8,
  FIFTH_BUTTON: 16
};

const MOUSE_BUTTONS_VALUES = Object.values(MOUSE_BUTTONS);

export const PLUGIN_DEFAULT_CONFIG = {
  mouseClickToTrack: MOUSE_BUTTONS.LEFT,
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
      ...PLUGIN_DEFAULT_CONFIG,
      ...data
    };
  }

  get(key) {
    return this.data[key];
  }
}

export default new PluginConfig();
