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

  addEngineToGameObject(gameObject, config = {}) {
    const pxlEngine = new GameObjectEngine(gameObject, config);
    gameObject.pxlEngine = pxlEngine;
    this.cache.push(pxlEngine);
    return pxlEngine;
  }

  update(time, delta) {
    forEach(this.cache, (pxlEngine) => {
      pxlEngine.update(time, delta);
    });
  }

  start() {
  }

  stop() {
    console.warn('plugin stopped');
  }
}
