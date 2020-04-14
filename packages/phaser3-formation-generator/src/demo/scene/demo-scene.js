import Phaser, { Scene } from 'phaser';
import { forEach, MOUSE_BUTTONS } from '@pixelburp/phaser3-utils';

import FormationGeneratorPlugin from 'src/js/formation-generator-plugin';
import DemoTileMap from './tile-map.js';
import DemoSprite from './demo-sprite';

const { KeyCodes } = Phaser.Input.Keyboard;
const DEBUG_PREVIEW_COLOR = 0x00ff00;
const DEBUG_SELECTION_COLOR = 0xff00ff;

export default class DemoScene extends Scene {
  fpsText;
  mySprites = [];
  selectedSprites = [];

  constructor() {
    super({ key: 'DemoScene', active: true });
  }

  onPreview = ({ items }) => {
    forEach(this.children.getChildren(), sprite => {
      // Ignore if already selected...
      if (sprite.tintTopLeft === DEBUG_SELECTION_COLOR) {
        return;
      }

      // If one of the sprites under the selection, set tint
      if (items.includes(sprite)) {
        return sprite.setTint(DEBUG_PREVIEW_COLOR);
      }

      // Otherwise, clear it.
      if (!!sprite.input) {
        sprite.setTint(0xffffff);
      }
    });
  };

  onSelect = ({ items }) => {
    console.warn('items', items);
    this.children.getChildren().forEach(s => s.input && s.setTint(0xffffff));

    items.forEach(sprite => sprite.setTint(DEBUG_SELECTION_COLOR));
    this.selectedSprites = items;
  };

  onPointerUp = pointer => {
    const { cameras, dummySprite } = this;
    const { shiftKey } = pointer.event;

    if (!this.selectedSprites.length || pointer.button !== 2) {
      return;
    }

    const result = this.formationMovement.calculate(this.selectedSprites, {
      maxCols: 15,
      minCols: 3,
    });

    result.forEach(item => {
      const x = item.tile.getCenterX(cameras.main);
      const y = item.tile.getCenterY(cameras.main);
      item.gameObject.pxlEngine.addWayPoint(new Phaser.Geom.Point(x, y));
    });
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

  createAllPlugins() {
    const { cameras } = this;
    const mainCamera = cameras.main;

    this.dragSelect = this.plugins.start('DragSelectPlugin', 'dragSelect');
    this.dragSelect.setup(this, {
      camera: mainCamera,
      dragCameraBy: false,
      onPreview: this.onPreview,
      onSelect: this.onSelect,
      outlineColor: 0x00ff00,
      outlineWidth: 2,
      rectBgColor: 0x33ff00,
      rectAlpha: 0.2,
    });

    this.formationMovement = this.plugins.start('FormationGeneratorPlugin', 'formationMovement');
    this.formationMovement.setup({
      camera: mainCamera,
      collisionIndices: this.tileMap.collisionIndices,
      gridSize: 64,
      scene: this,
      mouseClickToTrack: MOUSE_BUTTONS.RIGHT,
      onComplete: this.onPointerUp,
      tileLayer: this.tileMap.collisionLayer,
    });

    this.gameObjectEnginePlugin = this.plugins.start('GameObjectEnginePlugin', 'gameObjectEnginePlugin');
    this.gameObjectEnginePlugin.setup(this, mainCamera);
  }

  createInputEvents() {
    this.input.on('pointerup', this.onPointerUp);
  }

  createSprites() {
    let sprite, y, worldX, worldY;
    this.mySprites = [];
    let x = 1;
    const length = 5;
    const OFFSET = 200;

    for (x; x <= length; x += 1) {
      y = 1;
      for (y; y <= length; y += 1) {
        worldX = x * 300 + OFFSET;
        worldY = y * 300 + OFFSET;
        sprite = new DemoSprite(this, worldX, worldY);

        this.mySprites.push(sprite);
      }
    }
  }

  preload() {
    this.load.image('ground_1x1', 'src/assets/ground_1x1.png');
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
  }

  create() {
    this.tileMap = new DemoTileMap(this);

    this.createAllPlugins();

    this.createCamera();
    this.createSprites();
    this.createInputEvents();

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.gameObjectEnginePlugin.update(time, delta);
    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
