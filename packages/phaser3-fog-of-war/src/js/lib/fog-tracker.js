import { forEach } from '@pixelburp/phaser3-utils';

import PluginConfig from './plugin-config';
import { getCanClearFog, getViewDistanceByGameObject } from './util';
import { DEBUG_SELECTION_COLOR, IMAGE_DEPTH } from './constants';
import FogTrackerPosition from './fog-tracker-position';

const distanceBetween = Phaser.Math.Distance.BetweenPoints;

export default class FogTracker {
  debug;
  shouldUpdate = false;
  scene;
  positions = [];
  cache = [];

  constructor(scene) {
    this.debug = scene.add.graphics();
    this.debug.setDepth(IMAGE_DEPTH + 1);
    // this.debug.fillRect(0, 0, 1000, 1000);
    this.scene = scene;
    // this.bindToDisplayList();
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
    // const polygon = createPolygonFromSides(gameObject.x, gameObject.y, 8, FIELD_OF_VIEW);
    // const sortedPolygon = sortPointsClockwise(polygon);
    // console.log('polygon,', polygon);
    // console.log('sortedPolygon,', sortedPolygon);

    this.positions.push(new FogTrackerPosition(gameObject, viewDistance));
    this.shouldUpdate = true;
  }

  onDisplayListAdd = gameObject => {
    // this.scene.children.bringToTop(this.debug);
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

    debug.fillStyle(0x000000, 0);
    debug.lineStyle(2, DEBUG_SELECTION_COLOR, 0.5);

    forEach(positions, position => {
      debug.strokeCircle(position.x, position.y, position.viewDistance);
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
    const { positions, shouldUpdate } = this;

    this.updatePositions();

    if (!shouldUpdate) {
      return;
    }

    this.shouldUpdate = false;
    // this.updateDebug();
  }
}
