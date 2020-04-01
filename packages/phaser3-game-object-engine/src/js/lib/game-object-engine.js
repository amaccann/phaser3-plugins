import Phaser from 'phaser';

import { isStaticType, setGameObjectRadius } from './utils';
import WayPoint from './way-point';
import { GameObjectRadar } from './game-object-radar';

const NINETY_DEGREES_IN_RADIANS = Math.PI / 2;
const THREE_SIXTY_DEGREES_IN_RADIANS = Math.PI * 2;
const ANTI_CLOCKWISE = -1;
const CLOCKWISE = 1;

const APPROACHING_SPEED = 60;
const STOPPING_THRESHOLD = 5;
const DEFAULT_CONFIG = {
  speed: 240,
  gameObjectStoppingDistance: STOPPING_THRESHOLD,
  rotateOnMove: false,
  rotateSpeed: 10,
  stoppingDistance: STOPPING_THRESHOLD,
};

/**
 * @class GameObjectEngine
 */
export class GameObjectEngine {
  config = DEFAULT_CONFIG;
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
    this.setConfig(config);
    this.gameObject = gameObject;
    this.gameObjectRadius = setGameObjectRadius(gameObject);
    this.gameObject.addWayPoint = this.addWayPoint;
    this.gameObject.removeWayPoint = this.removeWayPoint;
    this.plugin = plugin;
    this.scene = plugin.gpsScene;

    this.radar = new GameObjectRadar(this, plugin);
  }

  get body() {
    return this.gameObject?.body;
  }

  get velocity() {
    return this.body?.velocity;
  }

  /**
   * @description Is any way-point marked as a "shuffle" out of the way?
   */
  get isShuffling() {
    return this.wayPoints.some(wp => wp.isShuffle);
  }

  getCurrentWayPoint() {
    return (this.wayPoints || [])[0];
  }

  addWayPoint = (item, isShuffle) => {
    const wayPoint = new WayPoint(item, isShuffle);
    // this.wayPoints.push(wayPoint);
    this.wayPoints = [wayPoint];
  };

  unshiftWayPoint = (item, isShuffle) => {
    const wayPoint = new WayPoint(item, isShuffle);
    this.wayPoints.unshift(wayPoint);
  };

  removeWayPoint = wayPoint => {
    this.wayPoints = this.wayPoints.filter(wp => wp !== wayPoint);

    // If no way-points remain, stop!
    if (!this.wayPoints || !this.wayPoints.length) {
      return this.stop();
    }
  };

  shuffle(shuffleTo) {
    if (this.isShuffling) {
      return;
    }

    const originalLocation = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);

    this.unshiftWayPoint(originalLocation, true);
    this.unshiftWayPoint(shuffleTo, true);
  }

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

  setConfig(config = DEFAULT_CONFIG) {
    this.config = {
      ...this.config,
      ...config
    };
    console.log('this', this.config);
  }

  slowOnApproachToWayPoint() {
    const currentWayPoint = this.getCurrentWayPoint();
    if (!currentWayPoint) {
      return this.stop();
    }

    this.updateVelocity(currentWayPoint, true);
  }

  stop() {
    const { gameObject } = this;
    if (gameObject.body) {
      gameObject.body.reset(gameObject.x, gameObject.y)
    }
  }

  /**
   * @method updateAngle
   * @param {Number} targetAngle
   */
  updateAngle(targetAngle) {
    const { config, gameObject: actor } = this;
    let delta;
    targetAngle += NINETY_DEGREES_IN_RADIANS;

    if (actor.rotation !== targetAngle) {
      // Calculate difference between the current angle and targetAngle
      delta = targetAngle - actor.rotation;

      // Keep it in range from -180 to 180 to make the most efficient turns.
      if (delta > Math.PI) {
        delta -= THREE_SIXTY_DEGREES_IN_RADIANS;
      }

      if (delta < -Math.PI) {
        delta += THREE_SIXTY_DEGREES_IN_RADIANS;
      }

      // Figure out what way to turn
      actor.angle += config.rotateSpeed * (delta > 0 ? CLOCKWISE : ANTI_CLOCKWISE);

      // Just set angle to target angle if they are close
      if (Math.abs(delta) < Phaser.Math.DegToRad(config.rotateSpeed)) {
        actor.rotation = targetAngle;
      }
    }
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

    if (config.rotateOnMove) {
      const targetAngle = Phaser.Math.Angle.BetweenPoints(gameObject, currentWayPoint);
      this.updateAngle(targetAngle);
    }
  }

  update(time, delta) {
    const { config, gameObject, isPaused, radar } = this;
    const currentWayPoint = this.getCurrentWayPoint();

    // If paused, do nothing
    if (isPaused) {
      return this.stop();
    }

    // Update the radar that figures out neighbours and "flocking" logic.
    radar.update();

    // No way point? Just stop.
    if (!currentWayPoint) {
      radar.resetAdjustments();
      return this.stop();
    }

    // Get the distance between you and the current way point.
    const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, currentWayPoint.x, currentWayPoint.y);
    const stoppingDistance = currentWayPoint.isStaticLocation ? config.stoppingDistance : config.gameObjectStoppingDistance;
    // If distance is less than the "radius" of GameObject's size or GameObject stopping threshold
    const isApproaching = distance <= (currentWayPoint.isStaticLocation ? this.gameObjectRadius : config.gameObjectStoppingDistance);

    if (!isApproaching) {
      return this.updateVelocity(currentWayPoint);
    }

    this.slowOnApproachToWayPoint(); // Slow approach to help accuracy.

    if (distance <= stoppingDistance) {
      this.stop();

      // If this is just a static point on the map, remove the waypoint, we're done.
      if (currentWayPoint.isStaticLocation) {
        this.removeWayPoint(currentWayPoint);
      }
    }

  }
}
