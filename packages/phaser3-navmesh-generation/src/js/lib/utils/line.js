import Phaser from 'phaser';

/**
 * @TODO instancing new Vectors each time the getter is invoked isn't great. Fix this later
 */
export default class Line extends Phaser.Geom.Line {
  static RotateAroundPointByAngle(line, point, angle) {
    const rotated = Phaser.Geom.Line.RotateAroundPoint(line, point, (angle / 2));
    return new Line(rotated.x1, rotated.y1, rotated.x2, rotated.y2);
  }

  get length() {
    return Phaser.Geom.Line.Length(this);
  }

  get start() {
    return new Phaser.Math.Vector2(this.x1, this.y1);
  }

  get end() {
    return new Phaser.Math.Vector2(this.x2, this.y2);
  }
}
