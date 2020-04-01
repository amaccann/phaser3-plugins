import Phaser from 'phaser';

import { forEach } from '@pixelburp/phaser3-utils';
import { INTERFACE_SCENE_KEY, createUtilityScene } from '@pixelburp/phaser3-utils';

/**
 * @class GameObjectBrainPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, GameObjectPlugin
 */
export default class GameObjectBrainPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
  }

  setup(config) {

  }

  start() {
    super.start();
    console.warn('plugin started');
  }

  stop() {
    console.warn('plugin stopped');
  }
}
