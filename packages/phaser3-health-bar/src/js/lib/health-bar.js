import Phaser from 'phaser';

import PluginConfig from './plugin-config';

export default class HealthBar extends Phaser.GameObjects.Group {
  background;
  child;
  foreground;

  constructor(scene, child) {
    super(scene);

    this.child = child;
    this.background = new Phaser.GameObjects.Graphics(scene);
    this.foreground = new Phaser.GameObjects.Graphics(scene);
    this.foreground.update = () => {
      console.log('blah');
    };

    this.add(this.background, true);
    this.add(this.foreground, true);

    this.drawBackground();
    this.drawForeground();
  }

  drawBackground() {
    const { background, child } = this;
    const { x, y } = child;
    const backgroundColor = PluginConfig.get('backgroundColor');
    const outlineColor = PluginConfig.get('outlineColor');
    const outlineWidth = PluginConfig.get('outlineWidth');

    background.clear();
    background.lineStyle(outlineWidth, outlineColor, 1);
    background.fillStyle(backgroundColor, 1);
    background.fillRect(x, y, 50, 20);
    background.strokeRect(x, y, 50, 20);
  }

  drawForeground() {
    const { foreground, child } = this;
    const { x, y } = child;
    const currentValueColor = PluginConfig.get('currentValueColor');

    foreground.clear();
    foreground.fillStyle(currentValueColor, 1);
    foreground.fillRect(x, y, 30, 20);
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
