import { PLUGIN_DEFAULT_CONFIG } from '@pixelburp/phaser3-drag-select/src/js/lib/plugin-config';

const FIELD_OF_VIEW = 100;

export const DEFAULT_MAP_CONFIG = {
  visibleGameObjectSelector: () => true,
  canClearFogSelector: () => true,

  fogBgColor: '#000',
  fogBgOpacity: 0.8,
  restoreFogAfter: 2000,
  viewDistanceProp: 'viewDistance',
  viewDistanceFallback: FIELD_OF_VIEW,
  visitedFogColor: '#000',
  visitedFogOpacity: 0.5,
};

class PluginConfig {
  data = {};

  set(data = {}) {
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
