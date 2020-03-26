import Phaser from 'phaser';

import { createUtilityScene, forEach, GPS_SCENE_KEY } from '@pixelburp/phaser3-utils';

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

  get scenePlugin() {
    return this.scene.scene;
  }

  addEngineToGameObject(gameObject, config = {}) {
    const pxlEngine = new GameObjectEngine(gameObject, this, config);
    gameObject.pxlEngine = pxlEngine;
    this.cache.push(pxlEngine);
    return pxlEngine;
  }

  createGpsScene() {
    const scenePlugin = this.scenePlugin;
    this.gpsScene = createUtilityScene(GPS_SCENE_KEY, scenePlugin, this);
    this.gpsScene.enable();
  }

  setup(scene, camera) {
    this.camera = camera;
    this.scene = scene;
    this.createGpsScene()
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
    this.scenePlugin.stop(GPS_SCENE_KEY);
  }
}
