import Phaser from 'phaser';

import DemoTileMap from '../tile-map';
import { forEach } from '@pixelburp/phaser3-utils';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Phaser.Scene {
  myControls;
  mySprites = [];
  tileMap;

  createAutoMovingSprites() {
    let i = 0;
    let sprite;

    this.mySprites = [];

    for (i; i < 10; i+= 1) {
      sprite = this.add.image(i * 100, 100, 'enabled-sprite');
      this.physics.world.enable([sprite]);
      sprite.body.setVelocity(-50, 100).setBounce(1, 1).setCollideWorldBounds(true);
      this.mySprites.push(sprite);
    }
  }

  createCamera() {
    const { keyboard } = this.input;

    const controlConfig = {
      camera: this.cameras.main,
      left: keyboard.addKey(KeyCodes.A),
      right: keyboard.addKey(KeyCodes.D),
      up: keyboard.addKey(KeyCodes.W),
      down: keyboard.addKey(KeyCodes.S),
      zoomIn: keyboard.addKey(KeyCodes.Q),
      zoomOut: keyboard.addKey(KeyCodes.E),
      acceleration: 0.001,
      drag: 0.0005,
      maxSpeed: 0.5,
    };

    this.myControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  preload() {
    this.load.image('ground_1x1', 'src/assets/ground_1x1.png');
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
  }

  create() {
    this.tileMap = new DemoTileMap(this);

    this.createAutoMovingSprites();
    this.createCamera();

    this.plugin = this.plugins.start('FogOfWarPlugin', 'fogOfWar');
    this.plugin.setup({
      scene: this
    });

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.physics.world.collide(this.mySprites);

    this.plugin.update(time, delta);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
