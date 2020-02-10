import Phaser from 'phaser';
import PluginConfig from './plugin-config';

import ForegroundBar from './foreground-bar';
import BackgroundBar from './background-bar';

export default class HealthBar extends Phaser.GameObjects.Group {
  child;

  constructor(scene, child) {
    super(scene);

    this.child = child;
    PluginConfig.forEachConfig((config, index) => {
      const background = new BackgroundBar(scene, child, config, index);
      const foreground = new ForegroundBar(scene, child, config, index);
      this.add(background, true);
      this.add(foreground, true);
    });
  }

  hide() {
    this.setAlpha(0);
  }

  show() {
    this.setAlpha(1);
  }

  /**
   * @description Destroy, and remove all children from the scene
   */
  destroy() {
    console.log('destroy');
    super.destroy(true);
  }
}
