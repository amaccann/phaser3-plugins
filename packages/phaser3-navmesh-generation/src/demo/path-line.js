import Phaser from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';

export default class PathLine extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);
  }

  drawLine = (funnelPoint, index) => {
    if (index === 0) {
      this.moveTo(funnelPoint.x, funnelPoint.y);
    } else {
      this.lineTo(funnelPoint.x, funnelPoint.y)
    }
  };

  drawPath(navMeshPath) {
    if (!navMeshPath) {
      return this.clear();
    }

    this.clear();
    this.lineStyle(2, 0xff00ff);
    this.beginPath();
    forEach(navMeshPath.path, this.drawLine);
    this.strokePath();

    this.lineStyle(2, 0x0000ff);
    this.beginPath();
    forEach(navMeshPath.offsetPath, this.drawLine);
    this.strokePath();

  }
}
