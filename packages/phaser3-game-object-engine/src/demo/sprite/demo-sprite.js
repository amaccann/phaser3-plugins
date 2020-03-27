import Phaser from 'phaser';
import { v4 } from 'uuid';

const TEMP_SPEED = 250;

export default class DemoSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enabled-sprite');
    this.id = v4();

    scene.gameObjectEnginePlugin.addEngineToGameObject(this, {
      speed: TEMP_SPEED,
      gameObjectStoppingDistance: 128,
    });
    scene.add.existing(this);
    this.setInteractive();
  }
}
