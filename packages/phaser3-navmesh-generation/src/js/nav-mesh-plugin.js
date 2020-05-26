import { forEach } from '@pixelburp/phaser3-utils';
import NavMesh from './lib/navMesh';
import Config from './lib/config';
import Debug from './lib/debug';
import SpritesCache from './lib/sprites-cache';

function err() {
  return console.error('[NavMeshPlugin] no TileMap / TileLayer found');
}

export default class NavMeshPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * @name navMesh
   * @type NavMesh
   */
  navMesh;
  spritesCache = new SpritesCache();

  /**
   * @method buildFromTileLayer
   * @param {Object} options
   */
  buildFromTileLayer(options = {}) {
    if (!options.tileMap || !options.tileLayer) {
      return err();
    }

    Config.set(options);
    Debug.set(options.scene, options.tileLayer, options.debug);

    if (this.navMesh) {
      this.navMesh.generate();
    } else {
      this.navMesh = new NavMesh(this.game);
    }

    return this.navMesh;
  }

  /**
   * @method getClosestPolygon
   * @description Finds the closest NavMesh polygon, based on world point
   * @param position The world point
   * @param position.x {Number}
   * @param position.y {Number}
   * @param includeOutOfBounds {Boolean} whether to include "out of bounds" searches
   */
  getClosestPolygon(position, includeOutOfBounds = false) {
    if (!this.navMesh) {
      return false;
    } else if (!position || !position.x || !position.y) {
      return false;
    }

    const poly = this.navMesh.getPolygonByXY(position.x, position.y);
    if (!includeOutOfBounds) {
      return poly || false;
    }

    // If no poly (ie, out of bounds), try finding the closest polygon in the whole nav-mesh
    return poly || this.navMesh.findClosestPolygonToPoint(position) || false;
  }

  getPath(startPosition, endPosition, offset) {
    if (!this.navMesh) {
      return false;
    }

    return this.navMesh.getPath(startPosition, endPosition, offset);
  }

  /**
   * @method getAllTilesWithin
   * @description Given world coords & "sprite" size, find all overlapping Tiles in the tileLayer
   * @returns Array
   */
  getAllTilesWithin(worldX, worldY, spriteWidth, spriteHeight) {
    const tileLayer = Config.get('tileLayer');
    const tileAtXY = tileLayer.getTileAtWorldXY(worldX, worldY, true);
    if (!tileAtXY) {
      return [];
    }

    const { x, y } = tileAtXY;
    const tileWidth = Math.floor(spriteWidth / tileAtXY.width);
    const tileHeight = Math.floor(spriteHeight / tileAtXY.height);
    return tileLayer.getTilesWithin(x, y, tileWidth, tileHeight);
  }

  /**
   * @method addSprite
   * @description Adds a "sprite" (like an immovable prop), that navmesh should include in its calculations.
   * @param {Number} worldX
   * @param {Number} worldY
   * @param {Number} spriteWidth
   * @param {Number} spriteHeight
   * @param {Boolean} refresh
   */
  addSprite(worldX, worldY, spriteWidth, spriteHeight, refresh = true) {
    const tileLayer = Config.get('tileLayer');
    const tileMap = Config.get('tileMap');
    if (!tileLayer || !tileMap) {
      return err();
    }

    const tileAtXY = tileLayer.getTileAtWorldXY(worldX, worldY, true);
    if (!tileAtXY) {
      return;
    }

    const tilesWithin = this.getAllTilesWithin(worldX, worldY, spriteWidth, spriteHeight);
    forEach(tilesWithin, tile => {
      const isAlreadyCached = this.spritesCache.has(tile);
      if (isAlreadyCached) {
        return;
      }

      // Save the original index of the Tile in a WeakMap
      this.spritesCache.set(tile, tile.index);

      // Pick a random collision index
      // @TODO - Maybe make this configurable?
      const randomIndex = Phaser.Math.Between(0, tileLayer.layer.collideIndexes.length - 1);
      tile.index = tileLayer.layer.collideIndexes[randomIndex];
      tile.setCollision(true, true, true, true, true);
    });

    if (tilesWithin.length) {
      this.navMesh.generate();
    }
  }

  /**
   * @method removeSprite
   * @description Find any previously cached "sprites" within these bounds, and reset to the original value
   */
  removeSprite(worldX, worldY, spriteWidth, spriteHeight) {
    const tileLayer = Config.get('tileLayer');
    const tileMap = Config.get('tileMap');
    if (!tileLayer || !tileMap) {
      return err();
    }

    const tilesWithin = this.getAllTilesWithin(worldX, worldY, spriteWidth, spriteHeight);
    forEach(tilesWithin, tile => {
      const cachedTileIndex = this.spritesCache.get(tile);
      if (cachedTileIndex) {
        tileLayer.putTileAt(cachedTileIndex, tile.x, tile.y);
        this.spritesCache.delete(tile);
      }
    });

    if (tilesWithin.length) {
      this.navMesh.generate();
    }
  }

  start() {
    console.log('start');
  }

  stop() {
    console.log('stop');
  }
}

window.NavMeshPlugin = NavMeshPlugin;
