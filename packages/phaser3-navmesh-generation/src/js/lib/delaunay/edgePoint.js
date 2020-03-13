/**
 * @class EdgePoint
 * @extends Phaser.Math.Vector2
 */
export default class EdgePoint extends Phaser.Math.Vector2 {
  constructor(point) {
    super(point.x, point.y);
    this.sources = [point];
  }

  /**
   * @method addSource
   * @description Add a reference to a matching {Phaser.Math.Vector2} object
   * @param {Phaser.Math.Vector2} point
   */
  addSource(point) {
    this.sources.push(point);
  }

  /**
   * @method updateSources
   * @description Update all the source {Phaser.Math.Vector2] instances that were originally matched to this.
   */
  updateSources() {
    const { sources, x, y } = this;
    sources.forEach(point => point.setTo(x, y));
  }
}
