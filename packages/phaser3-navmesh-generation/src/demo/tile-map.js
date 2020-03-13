const WIDTH_TILES = 40;
const HEIGHT_TILES = 30;
const TILE_SIZE = 32;
const MAP_CONFIG = {
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  width: WIDTH_TILES,
  height: HEIGHT_TILES
};

import Phaser from 'phaser';

export default class DemoTileMap {
  bgLayer;
  collisionLayer;
  map;
  scene;
  tileSet;

  constructor(scene) {
    this.scene = scene;
    this.map = scene.make.tilemap(MAP_CONFIG);

    this.tileSet = this.map.addTilesetImage('demo-ground-tile-set', 'ground_1x1', TILE_SIZE, TILE_SIZE);

    this.initLayers();
    this.drawBackgroundLayer();

    // Must be after we add the layer / tileSet
    const collisionIndices = new Array(24).fill('').map((d, i) => i);
    this.map.setCollision(collisionIndices);
  }

  initLayers() {
    this.bgLayer = this.map.createBlankDynamicLayer('demo-bg-layer-id', this.tileSet);
    this.collisionLayer = this.map.createBlankDynamicLayer('demo-layer-id', this.tileSet);
  }

  drawBackgroundLayer() {
    const { width, height } = this.map;
    let y = 0;
    let x;

    for (y; y < height; y++) {
      x = 0;
      for (x; x < width; x++) {
        this.map.putTileAt(24, x, y, true, this.bgLayer);
      }
    }
  }

  placeTileAtWorldPoint(worldPoint) {
    // Rounds down to nearest tile
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);

    const tileIndex = Phaser.Math.Between(0, 23);
    this.map.putTileAt(tileIndex, pointerTileX, pointerTileY, true, this.collisionLayer);
  }
}
