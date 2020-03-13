export default class FunnelPoint extends Phaser.Math.Vector2 {
  constructor(x, y, isNarrow = false) {
    super(x, y);
    this.isNarrow = isNarrow;
  }
}
