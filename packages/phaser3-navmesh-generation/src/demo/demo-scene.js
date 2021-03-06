import Phaser from 'phaser';

import DemoTileMap from './tile-map';
import PathLine from './path-line';

const { KeyCodes } = Phaser.Input.Keyboard;

export default class DemoScene extends Phaser.Scene {
  closestPolyByClick;
  closestPolyByClickGfx;
  fpsText;
  mySprite;
  moveTo = null;
  isLeftDown = false;
  navMeshPlugin;
  pathGraphics;
  rectangle;
  tileMap;

  constructor() {
    super();
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

  createGameObjects() {
    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);

    this.rectangle = this.add.rectangle(96, 96, 24, 38, 0xffff00);
    this.physics.add.existing(this.rectangle);
    this.physics.add.collider(this.rectangle, this.tileMap.collisionLayer);

    this.mySprite = this.add.sprite(200, 500, 'agent');
    this.physics.add.existing(this.mySprite);
    this.physics.add.collider(this.mySprite, this.tileMap.collisionLayer);

    this.pathGraphics = new PathLine(this);
  }

  onPointerDown = pointer => {
    this.isLeftDown = pointer.buttons === 1;
  };

  onPointerMove = pointer => {
    if (this.isLeftDown) {
      this.placeTileAt(pointer);
    }
  };

  onPointerUp = pointer => {
    const isShift = pointer?.event?.shiftKey;
    console.log('isShift', isShift);

    if (this.isLeftDown && isShift) {
      this.placeTileAt(pointer);
      this.updateNavMesh();
    } else if (this.isLeftDown) {
      this.calculateClosestNavMeshPoly(pointer);
    } else {
      this.moveSpriteTo(pointer);
    }
    this.isLeftDown = false;
  };

  placeTileAt(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);

    this.tileMap.placeTileAtWorldPoint(worldPoint);
  }

  calculateClosestNavMeshPoly(pointer) {
    console.log('check poly');
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    this.closestPolyByClick = this.navMeshPlugin.getClosestPolygon(undefined, true);
    console.log('closestPolyByClick', this.closestPolyByClick);

    this.closestPolyByClickGfx.clear();

    this.closestPolyByClickGfx.fillStyle(0xffff00);
    this.closestPolyByClickGfx.fillCircle(worldPoint.x, worldPoint.y, 10);

    this.closestPolyByClickGfx.fillStyle(0x0000ff, 0.6);
    if (this.closestPolyByClick) {
      this.closestPolyByClickGfx.fillPoints(this.closestPolyByClick.points);
    }
  }

  moveSpriteTo(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    this.moveTo = new Phaser.Math.Vector2(worldPoint.x, worldPoint.y);

    const size = Math.max(this.mySprite.width, this.mySprite.height);
    const position = new Phaser.Math.Vector2(this.mySprite.x, this.mySprite.y);
    const path = this.navMeshPlugin.getPath(position, this.moveTo, size);
    console.log('path', path);
    this.pathGraphics.drawPath(path);
  }

  updateNavMesh() {
    this.navMeshPlugin.buildFromTileLayer({
      collisionIndices: this.tileMap.collisionIndices,
      debug: {
        hulls: false,
        navMesh: true,
        navMeshNodes: true,
        polygonBounds: false,
        aStarPath: false,
      },
      midPointThreshold: 0,
      offsetHullsBy: 250,
      scene: this,
      tileMap: this.tileMap.map,
      tileLayer: this.tileMap.collisionLayer,
      timingInfo: true,
    });
  }

  /**
   * @method preload
   */
  preload() {
    this.load.image('ground_1x1', 'src/assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('agent', 'src/assets/agent.png');
  }

  /**
   * @method create
   */
  create() {
    this.navMeshPlugin = this.plugins.start('NavMeshPlugin', 'navMeshPlugin');

    this.input.on('pointerdown', this.onPointerDown);
    this.input.on('pointermove', this.onPointerMove);
    this.input.on('pointerup', this.onPointerUp);
    this.input.keyboard.on('keydown-Z', () => {
      const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

      this.navMeshPlugin.addSprite(worldPoint.x, worldPoint.y, 64, 32);
    });
    this.input.keyboard.on('keydown-X', () => {
      const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

      this.navMeshPlugin.removeSprite(worldPoint.x, worldPoint.y, 64, 32);
    });

    this.game.canvas.oncontextmenu = e => e.preventDefault();

    this.tileMap = new DemoTileMap(this);

    this.createCamera();
    this.createGameObjects();
    this.updateNavMesh();
    this.closestPolyByClickGfx = this.add.graphics();
    this.closestPolyByClickGfx.setDepth(9999);
  }

  update(time, delta) {
    this.myControls.update(time, delta);

    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
    if (!this.moveTo) {
      return this.mySprite.body.velocity.setTo(0);
    }

    const direction = this.moveTo.clone();
    direction.subtract(this.mySprite);

    this.mySprite.body.velocity.add(direction);
    this.mySprite.body.velocity.normalize();
    this.mySprite.body.velocity.scale(200);
  }
}
