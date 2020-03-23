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
    let sprite, setAsInteractive, y, worldX, worldY;
    this.mySprites = [];
    let x = 1;
    const length = 5;
    const OFFSET = 200;

    for (x; x <= length; x += 1) {
      y = 1;
      for (y; y <= length; y += 1) {
        // Every even numbered item will be set as "interactive"
        setAsInteractive = x % 2 === 0;
        worldX = x * 100 + OFFSET;
        worldY = y * 100 + OFFSET;
        sprite = new Phaser.GameObjects.Sprite(this, worldX, worldY, 'enabled-sprite');
        this.physics.world.enable([sprite]);

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

  getIsChildVisible = child => {
    const { input } = this;
    const camera = this.cameras.main;
    const { activePointer } = input;
    const childBounds = child.getBounds();
    // const x = (activePointer.x - camera.worldView.x) * camera.zoom;
    // const y = (activePointer.y - camera.worldView.y) * camera.zoom;

    const x = (childBounds.x - camera.worldView.x) * camera.zoom;
    const y = (childBounds.y - camera.worldView.y) * camera.zoom;
    const width = childBounds.width * camera.zoom;
    const height = childBounds.height * camera.zoom;

    // console.log('x', x);
    // console.log('y', y);
    // console.log('bounds', child.getBounds());
    const childRect = new Phaser.Geom.Rectangle(x, y, width, height);
    const contains = childRect.contains(activePointer.x, activePointer.y);

    // const contains = Phaser.Geom.Rectangle.Overlaps(rectangle, childRect);

    // If pointer overlaps with child, or other any other conditions you wish to display bar
    return contains || child.isSelected;
  };

  preload() {
    this.load.image('enabled-sprite', 'src/assets/demo/enabled-sprite-50x50.png');
  }

  create() {
    this.createCamera();
    this.createSprites();
    this.setDemoKeyEvents();

    this.gameObjectPlugin = this.plugins.start('GameObjectPlugin', 'gameObjectPlugin');


    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    // this.physics.world.collide(this.mySprites);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
