import Phaser from 'phaser';

import { addDisplayListCallbacks, forEach } from '@pixelburp/phaser3-utils';
import PluginConfig, { DEFAULT_MAP_CONFIG } from './lib/plugin-config';
import FogTracker from './lib/fog-tracker';
import FogCanvasTexture from './lib/fog-canvas-texture';
import { getVisibleGameObjectSelector } from './lib/util';

export default class Phaser3FogOfWarPlugin extends Phaser.Plugins.BasePlugin {
  scene;
  tracker;

  setup(config = {}) {
    const pluginConfig = {
      ...DEFAULT_MAP_CONFIG,
      ...config,
    };
    const { scene } = config;
    PluginConfig.set(pluginConfig);

    this.scene = scene;
    this.tracker = new FogTracker(scene);
    this.canvas = new FogCanvasTexture(scene, this.tracker);

    addDisplayListCallbacks(this.scene, this.onDisplayListAdd, this.onDisplayListRemove);
  }

  onDisplayListAdd = gameObject => {
    console.log('onDisplayListAdd', gameObject);
    this.tracker.onDisplayListAdd(gameObject);
    this.canvas.onDisplayListAdd(gameObject);
  };

  onDisplayListRemove = gameObject => {
    this.tracker.onDisplayListRemove(gameObject);
    this.canvas.onDisplayListRemove(gameObject);
  };

  start() {
    console.log('started');
  }

  /**
   * @TODO Make sure the fog is removed when the plugin is stopped for any reason
   */
  stop() {
    // this.tracker.unbindFromDisplayList();
    console.log('stopped');
  }

  update(time, alpha) {
    this.tracker.update(time, alpha);
    this.canvas.update();

    // Update visibility of Game Objects within the target scene
    const children = this.scene.children.getChildren();
    forEach(children, gameObject => getVisibleGameObjectSelector(gameObject, children));
  }
}
