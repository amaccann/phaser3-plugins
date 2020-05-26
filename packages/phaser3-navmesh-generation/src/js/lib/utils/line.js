import Phaser from 'phaser';

function sqr(x) {
  return x * x;
}
function dist2(start, end) {
  return sqr(start.x - end.x) + sqr(start.y - end.y);
}

function distToSegmentSquared(point, start, end) {
  const l2 = dist2(start, end);
  if (l2 === 0) {
    return dist2(point, start);
  }

  let t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / l2;
  t = Math.max(0, Math.min(1, t));

  return dist2(point, { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) });
}

/**
 * @TODO instancing new Vectors each time the getter is invoked isn't great. Fix this later
 */
export default class Line extends Phaser.Geom.Line {
  static RotateAroundPointByAngle(line, point, angle) {
    const rotated = Phaser.Geom.Line.RotateAroundPoint(line, point, angle / 2);
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

  distanceToPoint(point) {
    return Math.sqrt(distToSegmentSquared(point, this.start, this.end));
  }
}
