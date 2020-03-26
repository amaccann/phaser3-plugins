import Phaser from 'phaser';
import { forEach } from '@pixelburp/phaser3-utils';

function getSize(gameObject) {
  return Math.max(gameObject.width, gameObject.height) / 2;
}

export class GameObjectRadar extends Phaser.GameObjects.Graphics {
  alignment = new Phaser.Math.Vector2();
  avoidance = new Phaser.Math.Vector2();
  cohesion = new Phaser.Math.Vector2();

  engine;
  gameObject;
  neighbours;
  plugin;
  scene;

  radius = 0;

  constructor(engine, plugin) {
    const scene = plugin.gpsScene;
    super(scene);
    const { gameObject } = engine;

    this.engine = engine;
    this.gameObject = gameObject;
    this.plugin = plugin;
    this.scene = scene;
    this.radius = getSize(gameObject);

    scene.add.existing(this);
  }

  updateAllNeighbours() {
    const { gameObject, scene } = this;
    const allChildren = scene.children.getChildren();
    this.neighbours = [];

    forEach(allChildren, otherRadar => {
      if (otherRadar === gameObject) {
        return false;
      }

      const distance = Phaser.Math.Distance.BetweenPoints(this, otherRadar);
      if (distance > 0 && distance <= (this.radius + otherRadar.radius)) {
        this.neighbours.push(otherRadar);
      }
    });
  }

  resetAdjustments() {
    this.alignment.reset();
    this.avoidance.reset();
    this.cohesion.reset();
  }

  /**
   * @method updateAlignment
   */
  updateAlignment() {
    const { alignment, engine, neighbours } = this;
    alignment.setTo(0);

    if (!neighbours.length) {
      return;
    }

    forEach(neighbours, n => alignment.add(n.gameObject.body.velocity));
    alignment.divide({ x: neighbours.length, y: neighbours.length }).normalize().scale(engine.config.speed);
  }

  /**
   * @method updateAvoidance
   */
  updateAvoidance() {
    const { gameObject, avoidance, engine, neighbours } = this;
    avoidance.setTo(0);

    forEach(neighbours, n => {
      avoidance.add({
        x: gameObject.x - n.gameObject.x,
        y: gameObject.y - n.gameObject.y
      });
    });

    avoidance.normalize().scale(engine.config.speed);
  }

  /**
   * @method updateCohesion
   */
  updateCohesion() {
    const { cohesion, engine, neighbours } = this;
    cohesion.setTo(0);

    if (!neighbours.length) {
      return;
    }

    forEach(neighbours, n => cohesion.add(n.gameObject));
    cohesion.divide({ x: neighbours.length, y: neighbours.length }).normalize().scale(engine.config.speed);
  }


  update() {
    const { gameObject } = this;
    this.setPosition(gameObject.x, gameObject.y);

    this.updateAllNeighbours();

    if (!this.neighbours.length) {
      return this.resetAdjustments();
    }

    this.updateAlignment();
    this.updateAvoidance();
    this.updateCohesion();
  }
}
