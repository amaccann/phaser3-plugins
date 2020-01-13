import Phaser, { Scene } from 'phaser';

import DragSelectPlugin from 'src/js/drag-select-plugin';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Scene {
  fpsText;
  myControls;
  mySprite;

  constructor() {
    super({ key: 'DemoScene', active: true });
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
      maxSpeed: 1.0
    };

    this.myControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  createSprite() {
    this.mySprite = new Phaser.GameObjects.Sprite(this, 100, 100, 'temp');
    this.mySprite.setInteractive();
    this.add.existing(this.mySprite);
  }

  preload() {
    this.load.scenePlugin('dragSelect', DragSelectPlugin);

    this.load.image('temp', 'src/assets/temp-crowd-50x50.png');
  }

  create() {
    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);

    this.createCamera();
    this.createSprite();
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.mySprite.rotation += 0.05;

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps}`);
  }
}
