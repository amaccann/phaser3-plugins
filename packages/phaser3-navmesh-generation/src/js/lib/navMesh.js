/* eslint-disable no-console */

import AStar from './astar/aStar';
import Debug from './debug';
import { offsetFunnelPath } from './utils';
import DelaunayGenerator from './delaunay/delaunayGenerator';
import Config from './config';

/**
 * @class NavMesh
 */
export default class NavMesh {
  constructor(game) {
    this.game = game;

    this.delaunay = new DelaunayGenerator();
    this.generate();
  }

  /**
   * @method generate
   */
  generate() {
    const timerName = '[NavMeshPlugin] 🛠 Building NavMesh. Beep Boop Boop 🤖';
    const collisionIndices = Config.get('collisionIndices');

    if (!collisionIndices || !collisionIndices.length) {
      console.error('[NavMeshPlugin] No collision-indices found, cannot generate NavMesh. Exiting...');
    }

    Config.get('timingInfo') && console.time(timerName);
    this.delaunay.generate();
    this.aStar = new AStar(this); // Calculate the a-star grid for the polygons.
    this.updatedAt = Date.now();

    Config.get('timingInfo') && console.timeEnd(timerName);
    Debug.draw(this.delaunay);
  }

  /**
   * @method getPath
   * @param {Phaser.Math.Vector2} startPosition
   * @param {Phaser.Math.Vector2} endPosition
   * @param {Number} offset
   */
  getPath(startPosition, endPosition, offset) {
    const timerName = '[NavMeshPlugin] 🛠 Search for optimal path...';
    const { aStar } = this;
    Config.get('timingInfo') && console.time(timerName);

    const aStarPath = aStar.search(startPosition, endPosition);
    if (!aStarPath) {
      Config.get('timingInfo') && console.timeEnd(timerName);
      return false;
    }

    const { path, polygons, uuid } = aStarPath;
    const offsetPath = offsetFunnelPath(path, offset);
    const createdAt = Date.now();
    Config.get('timingInfo') && console.timeEnd(timerName);

    return { createdAt, path, polygons, offsetPath, uuid };
  }

  /**
   * @method getPolygonByXY
   */
  getPolygonByXY(x, y) {
    return this.delaunay.polygons.find(polygon => polygon.contains(x, y));
  }

  /**
   * @method findClosestPolygonToPoint
   * @description Finds the closest NavMesh polygon to the given world point
   * @param point
   * @param point.x {Number}
   * @param point.y {Number}
   */
  findClosestPolygonToPoint(point) {
    const { polygons } = this.delaunay;
    let length = polygons.length;
    let poly;
    let distanceToLine;
    let distance = Number.MAX_SAFE_INTEGER;
    let closest;
    let i = 0;
    let edgesLength;
    let j;

    for (i; i < length; i += 1) {
      poly = polygons[i];
      j = 0;
      edgesLength = poly.edges.length;

      for (j; j < edgesLength; j += 1) {
        distanceToLine = poly.edges[j].distanceToPoint(point);
        if (distanceToLine < distance) {
          distance = distanceToLine;
          closest = poly;
        }
      }
    }

    return closest;
  }
}
