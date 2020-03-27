import Phaser from 'phaser';

export function setGameObjectRadius(gameObject) {
  const gameObjectSize = Math.max(gameObject.width, gameObject.height);
  return gameObjectSize / 2;
}

export function isStaticType(item) {
  return item instanceof Phaser.Math.Vector2
    || item instanceof Phaser.Math.Vector3
    || item instanceof Phaser.Math.Vector4
    || item instanceof Phaser.Geom.Point;
}

export function rotateAndShuffle(gameObject, approachingAngle, shuffleBy) {
  const newAngle = approachingAngle + (Math.PI / 2); // Rotate by 90 degrees radians

  return new Phaser.Math.Vector2()
    .copy(gameObject.body.velocity)
    .normalize()
    .setToPolar(newAngle, shuffleBy)
    .add(gameObject);
}

export function projectAheadOfGameObjectByVelocity(gameObject) {
  const { body, x, y } = gameObject;
  if (!body) {
    return Phaser.Math.Vector2();
  }

  return new Phaser.Math.Vector2(
    x + body.velocity.x / 2,
    y + body.velocity.y / 2
  );
}

