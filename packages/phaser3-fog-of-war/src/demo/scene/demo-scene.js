import Phaser from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';

import DemoTileMap from '../tile-map';
import DemoSprite from '../sprite/demo-sprite';
import { DEBUG_PREVIEW_COLOR, DEBUG_SELECTION_COLOR, IMAGE_DEPTH } from '../../js/lib/constants';
import { getViewDistanceByGameObject } from '../../js/lib/util';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Phaser.Scene {
  myControls;
  mySprites = [];
  otherSprites = [];
  selectedSprites = [];
  tileMap;

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
    this.children.getChildren().forEach(s => s.input && s.setTint(0xffffff));

    items.forEach(sprite => sprite.setTint(DEBUG_SELECTION_COLOR));
    this.selectedSprites = items;
  };

  onPointerUp = pointer => {
    const { cameras, otherSprites } = this;

    if (!this.selectedSprites.length || pointer.button !== 2) {
      return;
    }

    const worldPoint = pointer.positionToCamera(cameras.main);
    const targetSprite = otherSprites.find(dummySprite => Phaser.Geom.Rectangle.Contains(dummySprite.getBounds(), worldPoint.x, worldPoint.y));
    const wayPoint = targetSprite ? targetSprite : worldPoint;

    forEach(this.selectedSprites, sprite => {
      sprite.pxlEngine.addWayPoint(wayPoint);
    });
  };

  bindMouseEvents = () => {
    this.input.on('pointerup', this.onPointerUp);
  };

  bindKeyEvents = () => {
    const { input, plugins, scene } = this;
    const { keyboard } = input;

    keyboard.on('keydown-R', () => {
      scene.stop('DemoScene');
      plugins.stop('fogOfWarPlugin');
    });
  };

  createAutoMovingSprites() {
    let i = 0;
    let sprite;

    this.otherSprites = [];

    for (i; i < 5; i += 1) {
      sprite = this.add.image(i * 200, 100, 'enabled-sprite');
      this.physics.world.enable([sprite]);
      sprite.isEnemy = true;
      sprite.body
        .setVelocity(-50, 100)
        .setBounce(1, 1)
        .setCollideWorldBounds(true);
      this.otherSprites.push(sprite);
    }
  }

  createMySprites() {
    let sprite, y, worldX, worldY;
    this.mySprites = [];
    let x = 1;
    const length = 2;
    const OFFSET = 200;

    for (x; x <= length; x += 1) {
      y = 1;
      for (y; y <= length; y += 1) {
        // Every even numbered item will be set as "interactive"
        worldX = x * 250 + OFFSET;
        worldY = y * 250 + OFFSET;
        sprite = new DemoSprite(this, worldX, worldY);
        this.mySprites.push(sprite);
      }
    }
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
      maxSpeed: 0.5,
    };

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.myControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  createAllPlugins() {
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

    this.fogOfWarPlugin = this.plugins.start('FogOfWarPlugin', 'fogOfWar');
    this.fogOfWarPlugin.setup({
      canClearFogSelector: this.canClearFogSelector,
      fogBgColor: '#333',
      fogBgOpacity: 0.5,
      scene: this,
      viewDistanceProp: 'viewDistance',
      visibleGameObjectSelector: this.visibleGameObjectSelector,
      visitedFogColor: '#333',
      visitedFogOpacity: 0.5,
    });

    this.gameObjectEnginePlugin = this.plugins.start('GameObjectEnginePlugin', 'gameObjectEnginePlugin');
    this.gameObjectEnginePlugin.setup(this, this.cameras.main);
  }

  canClearFogSelector = gameObject => {
    return gameObject instanceof DemoSprite;
  };

  // Is this gameObject visible under the map?
  visibleGameObjectSelector = (gameObject, sceneChildren) => {
    const isEnemySprite = gameObject.isEnemy;

    // We only want to toggle visibility of "enemy" sprites
    if (!isEnemySprite) {
      return false;
    }

    const isVisibleToOtherGameObject = sceneChildren.some(go => {
      if (go === gameObject || !(go instanceof DemoSprite)) {
        return false; // Ignore if not a Sprite
      }

      // Is the GameObject visible within the viewDistance of the other gameObject
      const viewDistance = getViewDistanceByGameObject(go);
      return Phaser.Math.Distance.BetweenPoints(gameObject, go) <= viewDistance;
    });

    gameObject.setAlpha(isVisibleToOtherGameObject ? 1 : 0);
  };

  preload() {
    this.load.image('ground_1x1', 'src/assets/ground_1x1.png');
    this.load.image('disabled-sprite', 'src/assets/disabled-sprite-50x50.png');
    this.load.image('enabled-sprite', 'src/assets/enabled-sprite-50x50.png');
  }

  create() {
    // Plugins first
    this.createAllPlugins();

    this.tileMap = new DemoTileMap(this);
    // Now the gameObjects
    this.bindMouseEvents();
    this.bindKeyEvents();
    this.createAutoMovingSprites();
    this.createMySprites();
    this.createCamera();

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
    this.fpsText.setDepth(IMAGE_DEPTH + 1);
    console.warn('scene', this);
  }

  update(time, delta) {
    this.myControls.update(time, delta);
    this.physics.world.collide(this.otherSprites);

    this.gameObjectEnginePlugin.update(time, delta);

    this.fogOfWarPlugin.update(time, delta);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
