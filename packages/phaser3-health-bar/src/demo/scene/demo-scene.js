import Phaser, { Scene } from 'phaser';

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
        this.physics.world.enable([sprite]);
        sprite.health = 55;
        sprite.maxHealth = 100;
        sprite.minHealth = 0;
        sprite.body
          .setVelocity(-50, 100)
          .setBounce(1, 1)
          .setCollideWorldBounds(true);

        if (setAsInteractive) {
          sprite.setInteractive();
        }

        this.add.existing(sprite);
        this.mySprites.push(sprite);
      }
    }
  }

  setDemoKeyEvents() {
    const { input, mySprites } = this;
    const { keyboard } = input;

    // Test on killing a sprite
    keyboard.on('keydown-R', () => {
      const randomIndex = Phaser.Math.Between(0, mySprites.length - 1);
      const sprite = mySprites[randomIndex];

      if (sprite) {
        sprite.destroy();
        this.mySprites = mySprites.filter(s => s !== sprite);
      }
    });
  }

  preload() {
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
    this.load.spritesheet('fullscreen', 'src/assets/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.createCamera();
    this.createSprites();
    this.setDemoKeyEvents();

    this.healthBarPlugin = this.plugins.start('HealthBarPlugin', 'healthBarPlugin');
    this.healthBarPlugin.setup(this, {
      barHeight: 15,
      backgroundColor: 0xff00ff,
      camera: this.cameras.main,
      currentValueColor: 0x00ff00,
      offsetY: 10,
      outlineColor: 0xffffff,
      outlineWidth: 2,
      // childSelector: (child) => child.input?.enabled,
      propToWatch: {
        current: 'health',
        max: 'maxHealth',
        min: 'minHealth',
      },
      visibleOnSelector: child => {
        const { input } = this;
        const { activePointer } = input;
        // If pointer overlaps with child, or other conditions
        return child.isSelected || child.input?.enabled;
      },
    });

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.physics.world.collide(this.mySprites);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
