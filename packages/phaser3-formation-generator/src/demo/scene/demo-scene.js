import Phaser, { Scene } from 'phaser';
import { forEach, MOUSE_BUTTONS } from '@pixelburp/phaser3-utils';

import FormationGeneratorPlugin from 'src/js/formation-generator-plugin';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Scene {
  fpsText;
  mySprites;

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

  createInputEvents() {
    const { formationMovement, mySprites } = this;

    this.input.on('pointerdown', () => {
      console.log('mySprites', mySprites);
      formationMovement.calculate(mySprites, {
        maxCols: 15,
        minCols: 3
      });
    });
  }

  createSprites() {
    let sprite, setAsInteractive, y, spriteKey, worldX, worldY;
    this.mySprites = [];
    let x = 1;
    const length = 5;
    const OFFSET = 200;

    for (x; x <= length; x += 1) {
      y = 1;
      for (y; y <= length; y += 1) {
        // Every even numbered item will be set as "interactive"
        setAsInteractive = x % 2 === 0;
        spriteKey = setAsInteractive ? 'enabled-sprite' : 'disabled-sprite';
        worldX = x * 100 + OFFSET;
        worldY = y * 100 + OFFSET;
        sprite = new Phaser.GameObjects.Sprite(this, worldX, worldY, spriteKey);
        sprite.isSelected = setAsInteractive; // @TODO temp setting as "selected"

        if (setAsInteractive) {
          sprite.setInteractive();
        }

        this.add.existing(sprite);
        this.mySprites.push(sprite);
      }
    }
  }

  preload() {
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
  }

  create() {
    const { cameras } = this;
    const mainCamera = cameras.main;

    console.log('DemoScene scene', this);
    this.formationMovement = this.plugins.start('FormationGeneratorPlugin', 'formationMovement');
    this.formationMovement.setup({
      camera: mainCamera,
      gridSize: 64,
      scene: this,
      mouseClickToTrack: MOUSE_BUTTONS.RIGHT,
    });

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);


    this.createCamera();
    this.createSprites();
    this.createInputEvents();
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
