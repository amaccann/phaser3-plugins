import Phaser from 'phaser';

/**
 * @class FormationGeneratorPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, Drag Selection plugin
 */
export default class FormationGeneratorPlugin extends Phaser.Plugins.BasePlugin {

  /**
   * @method setup
   */
  setup(scene, config = {}) {
  }

  stop() {
    super.stop();
    console.warn('Plugin stopped');
  }

  start() {
    super.start();
    console.warn('Plugin started');
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
}
