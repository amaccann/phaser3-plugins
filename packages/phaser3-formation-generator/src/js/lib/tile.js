import Phaser from 'phaser';
import PluginConfig from './plugin-config';

export default class Tile extends Phaser.Math.Vector2 {
  centerX = 0;
  centerY = 0;

  tileX = 0;
  tileY = 0;

  constructor() {
    super();
  }

  get worldX() {
    return this.x;
  }

  get worldY() {
    return this.y;
  }

  setTo(x, y) {
    super.setTo(x, y);
    const gridSize = PluginConfig.get('gridSize');
    const halfGrid = gridSize / 2;
    const tileX = Math.floor(x / gridSize);
    const tileY = Math.floor(y / gridSize);

    this.centerX = (tileX * gridSize) + halfGrid;
    this.centerY = (tileY * gridSize) + halfGrid;

    this.tileX = tileX;
    this.tileY = tileY;
  }

  reset() {
    super.reset();

    this.centerX = 0;
    this.centerY = 0;

    this.tileX = 0;
    this.tileY = 0;
  }
}
