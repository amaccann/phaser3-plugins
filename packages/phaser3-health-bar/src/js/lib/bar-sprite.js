import Phaser from 'phaser';

import HealthBarConfig from './health-bar-config';
import PluginConfig from './plugin-config';
import { ONE_PX_PNG_KEY } from './health-bar-scene';

export default class BarSprite extends Phaser.GameObjects.Sprite {
  /**
   * @name child
   */
  child;
  /**
   * @name config
   * @type HealthBarConfig
   */
  config;
  /**
   * @name index
   * @type Number
   */
  index;

  constructor(scene, child, config, index) {
    const { x, y } = child;
    super(scene, x, y, ONE_PX_PNG_KEY);
    this.child = child;
    this.config = config;
    this.index = index;
    this.setDisplaySize(child.width, config.barHeight);
    this.setOrigin(0, 0.5);
  }

  get halfHeight() {
    return this.config.barHeight / 2;
  }

  calculatePosition() {
    const { child } = this;
    const camera = PluginConfig.getGlobal('camera');
    const x = (child.x - camera.worldView.x) * camera.zoom;
    const y = (child.y - camera.worldView.y) * camera.zoom;

    return { x, y };
  }

  calculateOffset() {
    const { child, config, index } = this;

    const globalOffset = PluginConfig.getGlobal('offsetY');
    const halfChildHeight = child.originY * child.height;
    const totalOffset = index * config.barHeight;
    const offsetY = halfChildHeight + this.halfHeight + globalOffset + totalOffset;
    const offsetX = child.originX * child.width;

    return {
      offsetX,
      offsetY,
    };
  }

  update(time, delta) {
    const { offsetX, offsetY } = this.calculateOffset();
    const { x, y } = this.calculatePosition();
    super.update(time, delta);
    const visibleOnSelector = PluginConfig.getGlobal('visibleOnSelector')(this.child);

    this.setAlpha(visibleOnSelector ? 1 : 0);
    this.setPosition(x - offsetX, y - offsetY);
  }
}
