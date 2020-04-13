import * as clipping from 'polygon-clipping';
import { createPolygonFromSides, forEach, sortPointsClockwise } from '@pixelburp/phaser3-utils';

import PluginConfig from './plugin-config';
import { getCanClearFog, getViewDistanceByGameObject } from './util';
import { DEBUG_SELECTION_COLOR, IMAGE_DEPTH } from './constants';
import FogTrackerPosition from './fog-tracker-position';

const distanceBetween = Phaser.Math.Distance.BetweenPoints;

export default class FogTracker {
  debug;
  scene;
  positions = [];
  cache = [];
  polygons = [];

  constructor(scene) {
    this.debug = scene.add.graphics();
    this.debug.setDepth(IMAGE_DEPTH + 1);
    this.scene = scene;
  }

  get allChildren() {
    return this.displayList.getChildren();
  }

  get scene() {
    return PluginConfig.getGlobal('scene');
  }

  get displayList() {
    return this.scene.children;
  }

  addToPositions(gameObject, viewDistance) {
    const polygon = createPolygonFromSides(gameObject.x, gameObject.y, 8, viewDistance);
    const sortedPolygon = new Phaser.Geom.Polygon(sortPointsClockwise(polygon));
    const flattened = sortedPolygon.points.map(p => [p.x, p.y]);

    if (!this.polygons.length) {
      this.polygons = [flattened];
    } else {
      this.polygons = clipping.union([flattened], this.polygons);
    }

    this.positions.push(new FogTrackerPosition(gameObject, viewDistance));
    // this.updateDebug();
  }

  onDisplayListAdd = gameObject => {
    const canClearFog = getCanClearFog(gameObject);
    if (canClearFog) {
      const viewDistance = getViewDistanceByGameObject(gameObject);
      this.addToPositions(gameObject, viewDistance);
    }
  };

  onDisplayListRemove = () => {};

  updateDebug() {
    const { debug, positions } = this;
    debug.clear();

    debug.lineStyle(2, 0xff0000);
    debug.fillStyle(0xff0000, 0.4);

    forEach(this.polygons, group => {
      forEach(group, polygon => {
        debug.strokePoints(
          polygon.map(p => ({ x: p[0], y: p[1] })),
          true
        );
        debug.fillPoints(polygon.map(p => ({ x: p[0], y: p[1] })));
      });
    });
  }

  updatePositions() {
    forEach(this.allChildren, gameObject => {
      const canClearFog = getCanClearFog(gameObject);
      if (!canClearFog) {
        return false;
      }

      const viewDistance = getViewDistanceByGameObject(gameObject, true);
      const isNearPosition = this.positions.some(pos => distanceBetween(pos, gameObject) < viewDistance);
      if (isNearPosition) {
        return false;
      }

      this.addToPositions(gameObject, viewDistance);
    });
  }

  update() {
    this.updatePositions();
  }
}
