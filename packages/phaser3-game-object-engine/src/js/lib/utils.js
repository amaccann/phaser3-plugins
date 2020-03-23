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
