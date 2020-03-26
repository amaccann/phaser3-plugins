import Phaser from 'phaser';

import { isStaticType, setGameObjectRadius } from './utils';
import WayPoint from './way-point';
import { GameObjectRadar } from './game-object-radar';

const APPROACHING_SPEED = 60;
const STOPPING_THRESHOLD = 5;
const DEFAULT_CONFIG = {
  speed: 240,
  stoppingThreshold: STOPPING_THRESHOLD,
};

/**
 * @class GameObjectEngine
 */
export class GameObjectEngine {
  config;
  gameObject;
  gameObjectRadius;
  isPaused = false;
  plugin;
  scene;
  wayPoints = [];

  /**
   * @constructor
   */
  constructor(gameObject, plugin, config = {}) {
    // super(plugin.gpsScene, { runChildUpdate: true });

    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    this.gameObject = gameObject;
    this.gameObjectRadius = setGameObjectRadius(gameObject);
    this.gameObject.addWayPoint = this.addWayPoint;
    this.gameObject.removeWayPoint = this.removeWayPoint;
    this.plugin = plugin;
    this.scene = plugin.gpsScene;

    this.radar = new GameObjectRadar(this, plugin);
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
    const currentWayPoint = this.getCurrentWayPoint();
    if (!currentWayPoint) {
      return;
    }

    this.updateVelocity(currentWayPoint, true);
  }

  stop() {
    const { gameObject } = this;
    gameObject.body.reset(gameObject.x, gameObject.y)
  }

  updateVelocity(currentWayPoint, isApproaching) {
    const { config, gameObject, radar } = this;
    const { avoidance, alignment, cohesion } = radar;

    // If we're approach the current way-point, don't worry about flocking. Just slow up.
    if (isApproaching) {
      const angle = Math.atan2(currentWayPoint.y - gameObject.y, currentWayPoint.x - gameObject.x);
      return gameObject.body.velocity.setToPolar(angle, APPROACHING_SPEED);
    }

    const newVelocity = new Phaser.Math.Vector2(currentWayPoint).subtract(gameObject).normalize().scale(config.speed);

    newVelocity.add(avoidance);
    newVelocity.add(alignment);
    newVelocity.add(cohesion);

    gameObject.body.velocity.copy(newVelocity).normalize().scale(config.speed);
  }

  update(time, delta) {
    const { config, gameObject, radar } = this;
    const currentWayPoint = this.getCurrentWayPoint();

    // Update the radar that figures out neighbours and "flocking" logic.
    radar.update();

    // No way point? Just stop.
    if (!currentWayPoint) {
      radar.resetAdjustments();
      return this.stop();
    }

    // Get the distance between you and the current way point.
    const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, currentWayPoint.x, currentWayPoint.y);
    // If distance is less than the "radius" of GameObject's size
    const isApproaching = distance <= this.gameObjectRadius;

    if (isApproaching) {
      this.slowOnApproachToWayPoint(); // Slow approach to help accuracy.

      if (distance <= config.stoppingThreshold) {
        this.stop();
        this.removeWayPoint(currentWayPoint);
      }
    // } else if (!currentWayPoint.isStaticLocation) {
      // Only re-calculate the velocity if this is a "dynamic" way-point (like a GameObject)
      // const angle = Math.atan2(currentWayPoint.y - gameObject.y, currentWayPoint.x - gameObject.x);
      // gameObject.body.velocity.setToPolar(angle, config.speed);
    } else {
      this.updateVelocity(currentWayPoint);
    }
  }
}
