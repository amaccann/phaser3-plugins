import Phaser from 'phaser';

import { isStaticType, setGameObjectRadius } from './utils';
import WayPoint from './way-point';

const STOPPING_THRESHOLD = 5;
const DEFAULT_CONFIG = {
  speed: 240,
  stoppingThreshold: STOPPING_THRESHOLD,
};

/**
 * @class GameObjectEngine
 */
export class GameObjectEngine extends Phaser.GameObjects.Group {
  config;
  gameObject;
  gameObjectRadius;
  isPaused = false;
  scene;
  wayPoints = [];

  /**
   * @constructor
   */
  constructor(gameObject, config = {}) {
    super(gameObject.scene, { runChildUpdate: true });

    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    this.gameObject = gameObject;
    this.gameObjectRadius = setGameObjectRadius(gameObject);
    this.gameObject.addWayPoint = this.addWayPoint;
    this.gameObject.removeWayPoint = this.removeWayPoint;
    this.scene = gameObject.scene;
  }

  getCurrentWayPoint() {
    return (this.wayPoints || [])[0];
  }

  addWayPoint = (item) => {
    // if (this.wayPoints.includes(item)) {
    //   return;
    // }

    const wayPoint = new WayPoint(item);
    this.wayPoints.push(wayPoint);
    if (wayPoint.isStaticLocation) {
      this.setStaticVelocity();
    }
  };

  removeWayPoint = wayPoint => {
    this.wayPoints = this.wayPoints.filter(wp => wp !== wayPoint);

    // If no way-points remain, stop!
    if (!this.wayPoints || !this.wayPoints.length) {
      return this.stop();
    }

    // If there's another way-point, check if it's static
    const currentWayPoint = this.getCurrentWayPoint();
    if (currentWayPoint && currentWayPoint.isStaticLocation) {
      this.setStaticVelocity();
    }
  };

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  clearAll() {
    this.stop();
    this.wayPoints = [];
  }

  setStaticVelocity() {
    const { config, gameObject } = this;
    const currentWayPoint = this.getCurrentWayPoint();
    if (currentWayPoint) {
      this.scene.physics.moveToObject(gameObject, currentWayPoint, config.speed);
    }
  }

  slowOnApproachToWayPoint() {
    const { gameObject } = this;
    const currentWayPoint = this.getCurrentWayPoint();
    if (!currentWayPoint) {
      return;
    }

    const angle = Math.atan2(currentWayPoint.y - gameObject.y, currentWayPoint.x - gameObject.x);
    gameObject.body.velocity.setToPolar(angle, 60);
  }

  stop() {
    const { gameObject } = this;
    gameObject.body.reset(gameObject.x, gameObject.y)
  }

  update() {
    const { config, gameObject } = this;
    const currentWayPoint = this.getCurrentWayPoint();

    if (!currentWayPoint) {
      return this.stop();
    }

    const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, currentWayPoint.x, currentWayPoint.y);

    // If distance is less than the "radius" of GameObject's size
    if (distance <= this.gameObjectRadius) {
      this.slowOnApproachToWayPoint(); // Slow approach to help accuracy.

      if (distance <= config.stoppingThreshold) {
        this.stop();
        this.removeWayPoint(currentWayPoint);
      }
    } else if (!currentWayPoint.isStaticLocation) {
      // Only re-calculate the velocity if this is a "dynamic" way-point (like a GameObject)
      const angle = Math.atan2(currentWayPoint.y - gameObject.y, currentWayPoint.x - gameObject.x);
      gameObject.body.velocity.setToPolar(angle, config.speed);
    }
  }
}
