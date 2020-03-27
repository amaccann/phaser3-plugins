import Phaser from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';

import { projectAheadOfGameObjectByVelocity, rotateAndShuffle } from './utils';

/**
 * @class GameObjectRadar
 * @description "Radar" class that acts as a way to track neighbouring GameObjects, and adjust accordingly
 */
export class GameObjectRadar {
  alignment = new Phaser.Math.Vector2();
  avoidance = new Phaser.Math.Vector2();
  cohesion = new Phaser.Math.Vector2();

  engine;
  gameObject;
  neighbours;
  plugin;

  constructor(engine, plugin) {
    const { gameObject } = engine;

    this.engine = engine;
    this.gameObject = gameObject;
    this.plugin = plugin;
  }

  get radius() {
    return this.engine.gameObjectRadius;
  }

  updateAllNeighbours() {
    const { engine, gameObject } = this;
    const ahead = projectAheadOfGameObjectByVelocity(gameObject);

    this.neighbours = [];

    if (!engine.body) {
      return;
    }

    const myAngle = engine.velocity.angle();
    const myVelocity = engine.velocity.length();
    const isMyEngineMoving = myVelocity > 0;

    forEach(this.plugin.cache, otherEngine => {
      if (engine === otherEngine || !otherEngine?.body) {
        return false;
      }

      // Does the "ahead" overlap with the gameObject?
      const distanceAhead = Phaser.Math.Distance.BetweenPoints(ahead, otherEngine.gameObject);
      const isOtherInTheWay = distanceAhead <= otherEngine.gameObjectRadius;
      const isOtherSlower = myVelocity > otherEngine.velocity.length();

      // ATM, if you're moving, and the neighbour isn't moving but in the way, shuffle him.
      // @TODO - Make this tidier, more readable and more efficient
      // @TODO - Consider the engine-gameObject-radar relationship - it's a bit tangled ATM
      if (
        !engine.isShuffling &&
        !otherEngine.isShuffling &&
        isOtherInTheWay &&
        isMyEngineMoving &&
        isOtherSlower
      ) {
        const shuffleDistance = (this.radius) + (otherEngine.gameObjectRadius);
        const shuffleTo = rotateAndShuffle(otherEngine.gameObject, myAngle, shuffleDistance * 2);
        otherEngine.shuffle(shuffleTo);
      }

      const distance = Phaser.Math.Distance.BetweenPoints(gameObject, otherEngine.gameObject);
      if (distance > 0 && distance <= (this.radius + otherEngine.gameObjectRadius)) {
        this.neighbours.push(otherEngine);
      }
    });
  }

  resetAdjustments() {
    this.alignment.reset();
    this.avoidance.reset();
    this.cohesion.reset();
  }

  /**
   * @method updateAllAdjustments
   */
  updateAllAdjustments() {
    const { alignment, avoidance, cohesion, engine, gameObject, neighbours } = this;

    this.resetAdjustments();
    if (!neighbours.length) {
      return;
    }

    forEach(neighbours, (otherEngine) => {
      // If you, or the other guy is shuffling, ignore him.
      if (this.engine.isShuffling || otherEngine.isShuffling) {
        return;
      }

      alignment.add(otherEngine.gameObject.body.velocity);
      avoidance.add({
        x: gameObject.x - otherEngine.gameObject.x,
        y: gameObject.y - otherEngine.gameObject.y
      });
      cohesion.add(otherEngine.gameObject);
    });

    alignment.divide({ x: neighbours.length, y: neighbours.length }).normalize().scale(engine.config.speed);
    avoidance.normalize().scale(engine.config.speed);
    cohesion.divide({ x: neighbours.length, y: neighbours.length }).normalize().scale(engine.config.speed);
  }

  update() {
    const { gameObject } = this;
    // this.setTo(gameObject.x, gameObject.y);

    this.updateAllNeighbours();

    if (!this.neighbours.length) {
      return this.resetAdjustments();
    }

    this.updateAllAdjustments();
  }
}
