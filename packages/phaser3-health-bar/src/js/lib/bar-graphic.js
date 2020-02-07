import Phaser from 'phaser';
import PluginConfig from './plugin-config';

export default class BarGraphics extends Phaser.GameObjects.Graphics {
  child;

  constructor(scene, child) {
    super(scene);
    this.child = child;
    this.drawAll();
  }

  drawAll() {}

  preDestroy() {}

  destroy(fromScene) {
    super.destroy(fromScene);
  }

  update(time, delta) {
    const { child } = this;
    // const visibleOnSelector = PluginConfig.get('visibleOnSelector');
    // const isVisible = visibleOnSelector(child);

    const camera = PluginConfig.get('camera');
    const offsetX = PluginConfig.get('offsetX');
    const offsetY = PluginConfig.get('barHeight') + PluginConfig.get('offsetY');
    const childBounds = child.getBounds();
    const x = (childBounds.x - camera.worldView.x) * camera.zoom;
    const y = (childBounds.y - camera.worldView.y) * camera.zoom;

    this.setPosition(x - offsetX, y - offsetY);
  }
}
