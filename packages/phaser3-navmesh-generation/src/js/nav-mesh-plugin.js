import { forEach } from '@pixelburp/phaser3-utils';
import NavMesh from './lib/navMesh';
import Config from './lib/config';
import Debug from './lib/debug';
import SpritesCache from './lib/sprites-cache';

function err() {
  return console.error('[NavMeshPlugin] no TileMap / TileLayer found');
}

/**
 * @class NavMeshPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description NavMeshPlugin
 * @example
 * In your Phase game config, add it to `plugins: []`
 * ```
 *   plugins: {
 *     global: [{ key: 'NavMeshPlugin', plugin: NavMeshPlugin }],
 *   },
 * ```
 */
export default class NavMeshPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * @name NavMeshPlugin#navMesh
   * @type NavMesh
   */
  navMesh;
  /**
   * @name NavMeshPlugin#spritesCache
   * @type SpritesCache
   */
  spritesCache = new SpritesCache();

  /**
   * @method NavMeshPlugin#buildFromTileLayer
   * @param {Phaser.Tilemaps.Tilemap} options.tileMap
   * @param {Phaser.Tilemaps.TilemapLayer} options.tileLayer
   * @param {Phaser.Scene} options.scene
   * @param {Number[]} options.collisionIndices an Array of collision indices that your tilemap uses for collisions
   * @param {Number} [options.midPointThreshold=0] a Number value telling how narrow a navmesh triangle needs to be before it's ignored during pathing
   * @param {Boolean} [options.timingInfo=false] Show in the console how long it took to build the NavMesh - and search for paths
   * @param {Boolean} [options.useMidPoint=true] a Boolean value on whether to include all triangle edge mid-points in calculating triangulation
   * @param {Number} [options.offsetHullsBy=0.1] a Number value to offset (expand) each hull cluster by. Useful to use a small value to prevent excessively parallel edges
   * @param {Object} options.debug various optional debug options to Render the stages of NavMesh calculation:
   * @param {Boolean} options.debug.hulls: Every (recursive) 'chunk' of impassable tiles found on the tilemap
   * @param {Boolean} options.debug.navMesh: Draw all the actual triangles generated for this navmesh
   * @param {Boolean} options.debug.navMeshNodes: Draw all connections found between neighbouring triangles
   * @param {Boolean} options.debug.polygonBounds: Draw the bonding radius between each navmesh triangle
   * @param {Boolean} options.debug.aStarPath: Draw the aStar path found between points (WIP debug, will remove later)
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
   * @method NavMeshPlugin#getClosestPolygon
   * @description Finds the closest NavMesh polygon, based on world point
   * @param {Phaser.Geom.Point|Phaser.Math.Vector2} position The world point
   * @param [includeOutOfBounds=false] {Boolean} whether to include "out of bounds" searches
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

  /**
   * @method NavMeshPlugin#getPath
   * @description Finds Calculate the shortest path to a given destination
   * @param {Phaser.Geom.Point|Phaser.Math.Vector2} position startPosition
   * @param {Phaser.Geom.Point|Phaser.Math.Vector2} position endPosition
   * @param {Number} offset An offset value to keep a distance (optional, default `0`)
   */
  getPath(startPosition, endPosition, offset) {
    if (!this.navMesh) {
      return false;
    }

    return this.navMesh.getPath(startPosition, endPosition, offset);
  }

  /**
   * @method NavMeshPlugin#getAllTilesWithin
   * @description Given world coords & "sprite" size, find all overlapping Tiles in the tileLayer
   * @param {Number} worldX World X coordinate
   * @param {Number} worldY World Y coordinate
   * @param {Number} spriteWidth width (in pixels) of the Sprite you wish to add
   * @param {Number} spriteHeight height (in pixels) of the Sprite you wish to add
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
   * @method NavMeshPlugin#addSprite
   * @description Adds a "sprite" (like an immovable prop), that navmesh should include in its calculations.
   * @param {Number} worldX World X coordinate
   * @param {Number} worldY World Y coordinate
   * @param {Number} spriteWidth width (in pixels) of the Sprite you wish to add
   * @param {Number} spriteHeight height (in pixels) of the Sprite you wish to add
   */
  addSprite(worldX, worldY, spriteWidth, spriteHeight) {
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
   * @method NavMeshPlugin#removeSprite
   * @description Find any previously cached "sprites" within these bounds, and reset to the original value
   * @param {Number} worldX World X coordinate
   * @param {Number} worldY World Y coordinate
   * @param {Number} spriteWidth width (in pixels) of the Sprite you wish to remove
   * @param {Number} spriteHeight height (in pixels) of the Sprite you wish to remove
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
