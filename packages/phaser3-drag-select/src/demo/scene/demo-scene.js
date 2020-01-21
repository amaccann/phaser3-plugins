import Phaser, { Scene } from 'phaser';

import DragSelectPlugin from 'src/js/drag-select-plugin';
import { forEach } from 'src/js/util';

const { KeyCodes } = Phaser.Input.Keyboard;

const ROTATE_BY = 0.025;

export default class DemoScene extends Scene {
  dragSelect;
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

  createSprites() {
    this.mySprites = [];
    let x = 1;
    const length = 5;
    let sprite;
    let setAsInteractive;
    let spriteKey;
    let y;

    for (x; x <= length; x+=1) {
      y = 1;
      for (y; y <= length; y+=1) {
        // Every even numbered item will be set as "interactive"
        setAsInteractive = x % 2 === 0;
        spriteKey = setAsInteractive ? 'enabled-sprite' : 'disabled-sprite';
        sprite = new Phaser.GameObjects.Sprite(this, x * 100, y * 100, spriteKey);

        if (setAsInteractive) {
          sprite.setInteractive();
        }

        this.add.existing(sprite);
        this.mySprites.push(sprite);
      }
    }
  }

  onSelect = sprites => {
    console.warn('sprites', sprites);

    this.children.getChildren().forEach(obj => {
      obj.setTint(0xffffff);
    });

    sprites.forEach(sprite => sprite.setTint(0xff00ff));
    this.setSelectedSpritesText(sprites);
  };

  setSelectedSpritesText(sprites = []) {
    this.selectedSpritesText.setText(`${sprites.length} sprites selected`);
  }

  preload() {
    this.load.scenePlugin('DragSelectPlugin', DragSelectPlugin, 'dragSelect', 'dragSelect');

    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
  }

  create() {
    console.log('dragSelect', this.dragSelect);
    this.dragSelect.init({
      // childSelector: () => true, // select everything! :-)
      onSelect: this.onSelect,
      outlineColor: 0x00ff00,
      outlineWidth: 2,
      rectBgColor: 0x33ff00,
      rectAlpha: 0.2,
    });

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);

    this.selectedSpritesText = this.add.text(200, 10, '');
    this.selectedSpritesText.setScrollFactor(0);
    this.setSelectedSpritesText();

    this.createCamera();
    this.createSprites();
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    forEach(this.mySprites, sprite => {
      sprite.rotation += ROTATE_BY;
    });

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
