import Phaser from 'phaser';
import { createInterfaceScene } from '@pixelburp/phaser3-utils';

import PluginConfig from './lib/plugin-config';
import MouseInterface from './lib/mouse-interface';

/**
 * @class FormationGeneratorPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, Drag Selection plugin
 */
export default class FormationGeneratorPlugin extends Phaser.Plugins.BasePlugin {

  interfaceScene;
  mouseInterface;

  /**
   * @method setup
   */
  setup(config = {}) {
    this.setConfig(config);
    console.log('config', PluginConfig);
    this.createInterfaceScene();
  }

  get scenePlugin() {
    return PluginConfig.get('scene')?.scene;
  }

  /**
   * @method disable
   * @description If enabled, disable the plugin
   */
  disable() {
  }

  /**
   * @method enable
   * @description If not already enabled, enable the plugin
   */
  enable() {
  }

  /**
   * @method setConfig
   * @description Updates the plugin's configuration with new values
   * @param {Object} config - new configuration object
   */
  setConfig(config = {}) {
    PluginConfig.setConfig(config);
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;
    this.interfaceScene = createInterfaceScene(scenePlugin, this);
    this.interfaceScene.enable();

    if (this.mouseInterface) {
      this.mouseInterface.destroy();
    }
    this.mouseInterface = new MouseInterface(this.interfaceScene, this);
  }

  calculate(sprites = [], config) {
    console.log('formationMovement', sprites);
    this.mouseInterface?.calculate(sprites, config);
  }

  stop() {
    super.stop();
    console.warn('Plugin stopped');
  }

  start() {
    super.start();
    console.warn('Plugin started');
  }
}
