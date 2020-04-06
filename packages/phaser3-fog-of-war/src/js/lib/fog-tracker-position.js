export default class FogTrackerPosition {
  constructor(gameObject, viewDistance) {
    this.position = new Phaser.Math.Vector2(gameObject.x, gameObject.y);
    this.viewDistance = viewDistance;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}
