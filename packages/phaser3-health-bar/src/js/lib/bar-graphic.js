import Phaser from 'phaser';
import HealthBarConfig from './health-bar-config';
import PluginConfig from './plugin-config';

const DEFAULT_WIDTH = 50;

export default class BarGraphics extends Phaser.GameObjects.Graphics {
  child;
  /**
   * @name config
   * @type HealthBarConfig
   */
  config;
  offset;

  constructor(scene, child, config, offset) {
    super(scene);
    this.child = child;
    this.config = config;
    this.offset = offset;
    this.drawAll();
  }

  get childWidth() {
    return this.child?.width || DEFAULT_WIDTH;
  }

  drawAll() {}

  preDestroy() {}

  destroy(fromScene) {
    super.destroy(fromScene);
  }

  update(time, delta) {
    const { child, config, offset } = this;
    const visibleOnSelector = PluginConfig.getGlobal('visibleOnSelector')(child);

    this.setAlpha(visibleOnSelector ? 1 : 0);

    const totalOffset = offset * config.barHeight;
    const camera = config.camera;
    const offsetY = config.barHeight + totalOffset;
    const childBounds = child.getBounds();
    const x = (childBounds.x - camera.worldView.x) * camera.zoom;
    const y = (childBounds.y - camera.worldView.y) * camera.zoom;

    this.setPosition(x, y - offsetY);
  }
}
