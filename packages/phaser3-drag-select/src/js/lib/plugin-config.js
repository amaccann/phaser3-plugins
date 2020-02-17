import { MOUSE_BUTTONS } from '@pixelburp/phaser3-utils';

const NOOP = () => {};

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
  singleClickThreshold: 20,
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
