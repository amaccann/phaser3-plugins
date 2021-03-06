import Phaser, { Scene } from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';
import DemoSprite from '../sprite/demo-sprite';

const { KeyCodes } = Phaser.Input.Keyboard;
const TINT_PREVIEW = 0x00ff00;
const TINT_SELECTION = 0xff00ff;

export default class DemoScene extends Scene {
  dummySprite;
  fpsText;
  gameObjectEnginePlugin;
  isPaused = false;
  mySprites;

  selectedSprites = [];

  constructor() {
    super({ key: 'DemoScene', active: true });
  }

  onPreview = ({ items }) => {
    forEach(this.children.getChildren(), sprite => {
      // Ignore if already selected...
      if (sprite.tintTopLeft === TINT_SELECTION) {
        return;
      }

      // If one of the sprites under the selection, set tint
      if (items.includes(sprite)) {
        return sprite.setTint(TINT_PREVIEW);
      }

      // Otherwise, clear it.
      if (!!sprite.input) {
        sprite.setTint(0xffffff);
      }
    });

    // sprites.forEach(sprite => sprite.setTint(0x00ff00));
  };

  onSelect = ({ items }) => {
    console.warn('items', items);

    this.children.getChildren().forEach(s => s.input && s.setTint(0xffffff));

    items.forEach(sprite => sprite.setTint(0xff00ff));
    this.selectedSprites = items;
  };

  onPointerUp = (pointer) => {
    const { cameras, dummySprite } = this;
    const { shiftKey } = pointer.event;

    if (!this.selectedSprites.length || pointer.button !== 2) {
      return;
    }


    const worldPoint = pointer.positionToCamera(cameras.main);
    const containsSprite = Phaser.Geom.Rectangle.Contains(dummySprite.getBounds(), worldPoint.x, worldPoint.y);
    console.warn('containsSprite', containsSprite);
    const wayPoint = containsSprite ? dummySprite : worldPoint;

    forEach(this.selectedSprites, sprite => {
      sprite.pxlEngine.addWayPoint(wayPoint);
    });
  };

  bindMouseEvents = () => {
    this.input.on('pointerup', this.onPointerUp);
  };

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

  createDragSelect() {
    this.dragSelect = this.plugins.start('DragSelectPlugin', 'dragSelect');
    this.dragSelect.setup(this, {
      camera: this.cameras.main,
      onPreview: this.onPreview,
      onSelect: this.onSelect,
      outlineColor: 0x00ff00,
      outlineWidth: 2,
      rectBgColor: 0x33ff00,
      rectAlpha: 0.2,
    });

  }

  createSprites() {
    let sprite, y, worldX, worldY;
    this.mySprites = [];
    let x = 1;
    const length = 2;
    const OFFSET = 200;

    for (x; x <= length; x += 1) {
      y = 1;
      for (y; y <= length; y += 1) {
        // Every even numbered item will be set as "interactive"
        worldX = x * 200 + OFFSET;
        worldY = y * 200 + OFFSET;
        sprite = new DemoSprite(this, worldX, worldY);
        this.mySprites.push(sprite);
      }
    }
  }

  createAutoMovingSprite() {
    this.dummySprite = this.add.image(600, 100, 'enabled-sprite');
    this.physics.world.enable([this.dummySprite]);

    this.dummySprite.body.setVelocity(-50, 100).setBounce(1, 1).setCollideWorldBounds(true);
  }

  setDemoKeyEvents() {
    const { input, mySprites } = this;
    const { keyboard } = input;

    keyboard.on('keydown-P', () => {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.gameObjectEnginePlugin.pauseAll();
      } else {
        this.gameObjectEnginePlugin.resumeAll();
      }
    });

    // Test on killing a sprite
    keyboard.on('keydown-R', () => {
      const randomIndex = Phaser.Math.Between(0, mySprites.length - 1);
      const sprite = this.mySprites[randomIndex];

      if (sprite) {
        sprite.destroy();
        this.mySprites = this.mySprites.filter(s => s !== sprite);
      }
      console.log('this', this);
    });
  }

  preload() {
    this.load.image('enabled-sprite', 'src/assets/demo/enabled-sprite-50x50.png');
  }

  create() {
    this.gameObjectEnginePlugin = this.plugins.start('GameObjectEnginePlugin', 'gameObjectEnginePlugin');
    this.gameObjectEnginePlugin.setup(this, this.cameras.main);

    this.createDragSelect();
    this.bindMouseEvents();
    this.createCamera();
    this.createSprites();
    this.createAutoMovingSprite();
    this.setDemoKeyEvents();

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.gameObjectEnginePlugin.update(time, delta);
    // this.physics.world.collide(this.mySprites);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
