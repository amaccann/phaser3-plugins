import Phaser, { Scene } from 'phaser';

const { KeyCodes } = Phaser.Input.Keyboard;

const DARK_BLUE = 0x0019c7;
const GREEN = 0x00ff00;

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
        sprite.shields = {
          current: 25,
          max: 50,
          min: 0,
        };
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

    // Test 'damaging' a sprite by a random amount of health
    keyboard.on('keydown-H', () => {
      const randomIndex = Phaser.Math.Between(0, mySprites.length - 1);
      const sprite = mySprites[randomIndex];
      if (!sprite) {
        return;
      }
      const randomDamage = Phaser.Math.Between(8, 20);
      sprite.health -= randomDamage;
    });

    // Test on killing a sprite
    keyboard.on('keydown-R', () => {
      const randomIndex = Phaser.Math.Between(0, this.mySprites.length - 1);
      const sprite = this.mySprites[randomIndex];

      if (sprite) {
        sprite.destroy();
        this.mySprites = this.mySprites.filter(s => s !== sprite);
      }
      console.log('this', this);
    });
  }

  preload() {
    this.load.image('disabled-sprite', 'src/assets/demo/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/demo/enabled-sprite-50x50.png');
  }

  create() {
    this.createCamera();
    this.createSprites();
    this.setDemoKeyEvents();
    const defaultBarConfig = {
      barHeight: 15,
      backgroundColor: [DARK_BLUE * 0.2, DARK_BLUE * 0.2, DARK_BLUE, DARK_BLUE],
      outlineColor: 0xffffff,
      camera: this.cameras.main,
      outlineWidth: 2,
    };

    this.healthBarPlugin = this.plugins.start('HealthBarPlugin', 'healthBarPlugin');
    this.healthBarPlugin.setup(
      this,
      {
        offsetY: 10,
        // childSelector: (child) => child.input?.enabled,
        visibleOnSelector: child => {
          const { input } = this;
          const { activePointer } = input;
          const contains = child.getBounds().contains(activePointer.x, activePointer.y);

          // If pointer overlaps with child, or other any other conditions you wish to display bar
          return contains || child.isSelected;
        },
      },
      [
        {
          ...defaultBarConfig,
          currentValueColor: [GREEN, GREEN, GREEN * 0.8, GREEN * 0.8],
          propsToWatch: {
            current: 'health',
            max: 'maxHealth',
            min: 'minHealth',
          },
        },
        {
          ...defaultBarConfig,
          currentValueColor: 0x00d9c7,
          propsToWatch: {
            current: 'shields.current',
            max: 'shields.max',
            min: 'shields.min',
          },
        },
      ]
    );

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);

    this.helpText = this.add.text(150, 10, 'Press [H] to "damage" a random Sprite; press [R] to kill a random Sprite');
    this.helpText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.physics.world.collide(this.mySprites);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
