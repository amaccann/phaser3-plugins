const WIDTH_TILES = 40;
const HEIGHT_TILES = 30;
const TILE_SIZE = 32;
const MAP_CONFIG = {
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  width: WIDTH_TILES,
  height: HEIGHT_TILES
};
const COLLISION_INDICES = new Array(24).fill('').map((d, i) => i); // Ignore the last item in ground_1x1 (grass)

const STAGGERED_TILES = [
  [20, 20], [21, 20],
  [21, 21], [22, 21],
  [22, 22], [23, 22],

  [25, 20], [26, 20],
  [26, 21], [27, 21],
  [27, 22], [28, 22],
];

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
    this.drawGrid();

    // Must be after we add the layer / tileSet
    this.map.setCollision(COLLISION_INDICES);
  }

  get collisionIndices() {
    return COLLISION_INDICES;
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

  /**
   * @description Draws a random shape on the map for testing
   */
  drawGrid() {
    const { map } = this;
    const startAtX = 5;
    const startAtY = 5;
    const yLength = startAtY + 10;
    let y = startAtY;
    let xLength;
    let x;
    let tileIndex;

    for (y; y < yLength; y++) {
      x = startAtX;
      xLength = startAtX + 20;
      for (x; x < xLength; x++) {
        if (x !== startAtX && y !== startAtY && x !== xLength - 4 && y !== yLength - 1) {
          continue;
        }

        tileIndex = Math.floor(Phaser.Math.Between(0, COLLISION_INDICES.length - 1));
        map.putTileAt(tileIndex, x, y, true, this.collisionLayer);
      }
    }

    STAGGERED_TILES.forEach(([tileX, tileY]) => {
      tileIndex = Math.floor(Phaser.Math.Between(0, COLLISION_INDICES.length - 1));
      map.putTileAt(tileIndex, tileX, tileY, true, this.collisionLayer);
    });
  }

  placeTileAtWorldPoint(worldPoint) {
    // Rounds down to nearest tile
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);

    const tileIndex = Phaser.Math.Between(0, 23);
    this.map.putTileAt(tileIndex, pointerTileX, pointerTileY, true, this.collisionLayer);
  }
}
