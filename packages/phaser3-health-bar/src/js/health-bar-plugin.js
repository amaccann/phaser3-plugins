import Phaser from 'phaser';

import PluginConfig from './lib/plugin-config';
import HealthBarScene, { SCENE_KEY } from './lib/health-bar-scene';

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
  cache = new Set();
  healthBarScene;
  scene;

  setup(scene, globalConfig = {}, config = []) {
    this.scene = scene;
    this.setConfig(globalConfig, config);
    this.createScene();
    this.setInitialCache();
    this.bindToDisplayList();
  }

  /**
   * @method isEnabled
   * @description Returns the current "enabled" status of the Plugin's "interface" scene
   * @returns {Boolean}
   */
  get isEnabled() {
    return !this.healthBarScene.isDisabled;
  }

  get displayList() {
    return this.scene.children;
  }

  get scenePlugin() {
    return this.scene.scene;
  }

  bindToDisplayList() {
    const displayList = this.displayList;

    displayList.addCallback = this.addHealthBarToChild;
    displayList.removeCallback = this.removeHealthBarFromChild;
  }

  createScene() {
    const scenePlugin = this.scenePlugin;

    if (scenePlugin.get(SCENE_KEY)) {
      return scenePlugin.launch(SCENE_KEY);
    }

    scenePlugin.add(SCENE_KEY, HealthBarScene, true);
    scenePlugin.bringToTop(SCENE_KEY);

    this.healthBarScene = scenePlugin.get(SCENE_KEY);
    if (this.healthBarScene) {
      this.healthBarScene.setPlugin(this);
    }
  }

  /**
   * @method disable
   * @description If enabled, disable the plugin
   */
  disable() {
    if (this.isEnabled) {
      this.healthBarScene.disable();
    }
  }

  /**
   * @method enable
   * @description If not already enabled, enable the plugin
   */
  enable() {
    if (!this.isEnabled) {
      this.healthBarScene.enable();
    }
  }

  addHealthBarToChild = child => {
    const { cache, healthBarScene } = this;
    const isValidChild = PluginConfig.getGlobal('childSelector')(child);
    const isAlreadyInCache = cache.has(child);
    if (isAlreadyInCache || !isValidChild) {
      return;
    }

    healthBarScene.addHealthBar(child);
    cache.add(child);
  };

  removeHealthBarFromChild = child => {
    this.cache.delete(child);
    child.healthBar?.destroy();
  };

  /**
   * @method setConfig
   * @description Updates the plugin's configuration with new values
   * @param {Object} globalConfig - new configuration object
   * @param {Array} config - Array of bars to configure
   */
  setConfig(globalConfig = {}, config = []) {
    PluginConfig.setConfig(globalConfig, config);
  }

  setInitialCache() {
    this.displayList.each(this.addHealthBarToChild, this);
  }

  stop() {
    super.stop();
    this.scenePlugin.stop(SCENE_KEY);
  }

  // start() {
  //   super.start();
  //   console.log('🤖 DragSelect Plugin started...');
  // }
}
