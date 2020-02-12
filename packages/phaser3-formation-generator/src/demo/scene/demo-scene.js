import Phaser, { Scene } from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';

import FormationGeneratorPlugin from 'src/js/formation-generator-plugin';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Scene {
  fpsText;

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
      maxSpeed: 1.0,
    };

    this.myControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  preload() {
  }

  create() {
    console.log('DemoScene scene', this);
    this.formationMovement = this.plugins.start('FormationGeneratorPlugin', 'formationMovement');

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);


    this.createCamera();
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
