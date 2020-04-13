import Phaser from 'phaser';
import { v4 } from 'uuid';

const TEMP_SPEED = 250;

export default class DemoSprite extends Phaser.GameObjects.Sprite {
  viewDistance = 80;

  constructor(scene, x, y) {
    super(scene, x, y, 'enabled-sprite');
    this.id = v4();

    scene.gameObjectEnginePlugin.addEngineToGameObject(this, {
      rotateOnMove: false,
      rotateSpeed: 10,
      speed: TEMP_SPEED,
      gameObjectStoppingDistance: 128,
    });
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setInteractive();
  }
}
