import Phaser from 'phaser';

/**
 * @class HealthBarPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, Drag Selection plugin
 */
export default class HealthBarPlugin extends Phaser.Plugins.BasePlugin {
  scene;

  stop() {
    super.stop();
    console.log('plugin started');
  }

  start() {
    super.start();
    console.log('🤖 DragSelect Plugin started...');
  }

}
