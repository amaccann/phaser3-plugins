import Phaser from 'phaser';

import ForegroundBar from './foreground-bar';
import BackgroundBar from './background-bar';

export default class HealthBar extends Phaser.GameObjects.Group {
  background;
  child;
  foreground;

  constructor(scene, child) {
    super(scene);

    this.child = child;
    this.background = new BackgroundBar(scene, child);
    this.foreground = new ForegroundBar(scene, child);

    this.add(this.background, true);
    this.add(this.foreground, true);
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
    super.destroy(true);
  }
}
