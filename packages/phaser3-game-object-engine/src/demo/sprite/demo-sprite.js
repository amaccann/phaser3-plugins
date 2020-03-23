import Phaser from 'phaser';

const TEMP_SPEED = 400;

export default class DemoSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enabled-sprite');
    scene.gameObjectEnginePlugin.addEngineToGameObject(this, {
      speed: TEMP_SPEED,
    });
    scene.add.existing(this);
    this.setInteractive();
  }

  update(time, delta) {
    console.log('time', time);
  }
}
