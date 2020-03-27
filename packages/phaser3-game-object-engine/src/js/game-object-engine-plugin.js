import Phaser from 'phaser';

import { forEach } from '@pixelburp/phaser3-utils';

import { GameObjectEngine } from './lib/game-object-engine';

/**
 * @class GameObjectEnginePlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, GameObjectPlugin
 */
export default class GameObjectEnginePlugin extends Phaser.Plugins.BasePlugin {
  cache = [];
  camera;
  gpsScene;
  scene;

  onGameObjectDestroy = (evt) => {
    const { pxlEngine } = evt;
    if (pxlEngine) {
      return;
    }

    // Pause so that we don't crash a cycle updating the radar on a destroyed GameObject
    pxlEngine.pause();
    this.cache = this.cache.filter(px => px !== pxlEngine);
  };

  // @TODO - ondestroy of GameObject, we need to scrub this.cache of this object
  addEngineToGameObject(gameObject, config = {}) {
    const pxlEngine = new GameObjectEngine(gameObject, this, config);
    gameObject.pxlEngine = pxlEngine;
    gameObject.once('destroy', this.onGameObjectDestroy);
    this.cache.push(pxlEngine);
    return pxlEngine;
  }

  pauseAll() {
    forEach(this.cache, (pxlEngine) => pxlEngine.pause());
  }

  resumeAll() {
    forEach(this.cache, (pxlEngine) => pxlEngine.resume());
  }

  setup(scene, camera) {
    this.camera = camera;
    this.scene = scene;
  }

  update(time, delta) {
    forEach(this.cache, (pxlEngine) => {
      pxlEngine.update(time, delta);
    });
  }

  start() {
    super.start();
  }

  stop() {
    console.warn('plugin stopped');
  }
}
