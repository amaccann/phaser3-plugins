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
  FIFTH_BUTTON: 16,
};

const MOUSE_BUTTONS_VALUES = Object.values(MOUSE_BUTTONS);

export const IS_INTERACTIVE_CHILD = child => child.input?.enabled;

export const AMEND_SELECT_OPTIONS = {
  ALT: 'alt',
  CTRL: 'ctrl',
  SHIFT: 'shift',
};

export const PLUGIN_DEFAULT_CONFIG = {
  camera: null,
  cameraEdgeAcceleration: 0.009,
  cameraEdgeBuffer: 50,
  childSelector: IS_INTERACTIVE_CHILD,
  dragCameraBy: MOUSE_BUTTONS.RIGHT,
  mouseClickToTrack: MOUSE_BUTTONS.LEFT,
  mouseAmendSelectWith: AMEND_SELECT_OPTIONS.SHIFT,
  mouseToggleSelectWith: AMEND_SELECT_OPTIONS.CTRL,
  outlineColor: 0x00ff00,
  outlineWidth: 2,
  onPreview: NOOP,
  onSelect: NOOP,
  rectBgColor: 0x33ff33,
  rectAlpha: 0.5,
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
