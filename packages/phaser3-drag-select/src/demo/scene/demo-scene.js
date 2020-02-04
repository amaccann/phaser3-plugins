import Phaser, { Scene } from 'phaser';

import DragSelectPlugin from 'src/js/drag-select-plugin';
import { forEach } from 'src/js/util';

const { KeyCodes } = Phaser.Input.Keyboard;

const ROTATE_BY = 0.025;
const TINT_PREVIEW = 0x00ff00;
const TINT_SELECTION = 0xff00ff;

export default class DemoScene extends Scene {
  dragSelect;
  fpsText;
  fullScreenBtn;
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
      maxSpeed: 1.0,
    };

    this.myControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  createFullScreenButton() {
    const { game } = this;
    const { width } = game.config;
    const offset = 32;
    this.fullScreenBtn = this.add
      .image(width - offset, offset, 'fullscreen', 0)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setInteractive();

    this.input.keyboard.on('keydown-F', this.toggleFullScreenMode, this);

    this.fullScreenBtn.on('pointerup', this.toggleFullScreenMode, this);
  }

  createSprites() {
    let sprite, setAsInteractive, spriteKey, y, worldX, worldY;
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

        if (setAsInteractive) {
          sprite.setInteractive();
        }

        this.add.existing(sprite);
        this.mySprites.push(sprite);
      }
    }
  }

  onPreview = sprites => {
    forEach(this.children.getChildren(), sprite => {
      // Ignore if already selected...
      if (sprite.tintTopLeft === TINT_SELECTION) {
        return;
      }

      // If one of the sprites under the selection, set tint
      if (sprites.includes(sprite)) {
        return sprite.setTint(TINT_PREVIEW);
      }

      // Otherwise, clear it.
      sprite.setTint(0xffffff);
    });

    // sprites.forEach(sprite => sprite.setTint(0x00ff00));
  };

  onSelect = sprites => {
    console.warn('sprites', sprites);

    this.children.getChildren().forEach(s => s.setTint(0xffffff));

    sprites.forEach(sprite => sprite.setTint(0xff00ff));
    this.setSelectedSpritesText(sprites);
  };

  setSelectedSpritesText(sprites = []) {
    this.selectedSpritesText.setText(`${sprites.length} sprites selected`);
  }

  setDemoKeyEvents() {
    const { input, plugins, scene } = this;
    const { keyboard } = input;

    // Test pausing / disabling the plugin
    keyboard.on('keydown-P', () => {
      if (this.dragSelect.isEnabled) {
        this.dragSelect.disable();
      } else {
        this.dragSelect.enable();
      }
    });

    // Test swapping scenes to show the Plugin being stopped / restarted
    keyboard.on('keydown-R', () => {
      scene.stop('DemoScene');
      scene.launch('DemoScene2');
      plugins.stop('dragSelect');
    });
  }

  toggleFullScreenMode = () => {
    if (this.scale.isFullscreen) {
      this.fullScreenBtn.setFrame(0);

      this.scale.stopFullscreen();
    } else {
      this.fullScreenBtn.setFrame(1);

      this.scale.startFullscreen();
    }
  };

  preload() {
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
    this.load.spritesheet('fullscreen', 'src/assets/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    console.log('DemoScene scene', this);
    this.dragSelect = this.plugins.start('DragSelectPlugin', 'dragSelect');
    this.dragSelect.setup(this, {
      camera: this.cameras.main,
      // cameraEdgeAcceleration: false, // set to false if you want to disable
      // cameraEdgeBuffer: 50,
      // childSelector: () => true, // select everything! :-)
      // dragCameraBy: false, // disable drag camera
      onPreview: this.onPreview,
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
    this.createFullScreenButton();
    this.createSprites();
    this.setDemoKeyEvents();
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    forEach(this.mySprites, sprite => {
      sprite.rotation += ROTATE_BY;
    });

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
