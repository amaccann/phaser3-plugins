import Phaser from 'phaser';
import PluginConfig from './lib/plugin-config';
import HealthBar from './lib/health-bar';

/**
 * @class HealthBarPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, Drag Selection plugin
 */
export default class HealthBarPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * @name scene
   * @type Phaser.Scene
   */
  scene;
  cache = new Set();

  setup(scene, config = {}) {
    this.scene = scene;
    console.log('scene', scene);
    this.setConfig(config);
    this.setInitialCache();
    this.bindToDisplayList();
  }

  get displayList() {
    return this.scene.children;
  }

  bindToDisplayList() {
    const displayList = this.displayList;

    displayList.addCallback = this.addHealthBarToChild;
    displayList.removeCallback = this.removeHealthBarFromChild;
  }

  addHealthBarToChild = child => {
    const { cache, scene } = this;
    const isValidChild = PluginConfig.get('childSelector')(child);
    const isAlreadyInCache = cache.has(child);
    if (isAlreadyInCache || !isValidChild) {
      return;
    }

    child.healthBar = new HealthBar(scene, child);
    cache.add(child);
  };

  removeHealthBarFromChild = child => {
    this.cache.delete(child);
    child.healthBar?.destroy();
  };

  /**
   * @method setConfig
   * @description Updates the plugin's configuration with new values
   * @param {Object} config - new configuration object
   */
  setConfig(config = {}) {
    PluginConfig.setConfig(config);
  }

  setInitialCache() {
    this.displayList.each(this.addHealthBarToChild, this);
  }

  stop() {
    super.stop();
    console.log('plugin stopped');
  }

  // start() {
  //   super.start();
  //   console.log('🤖 DragSelect Plugin started...');
  // }
}
