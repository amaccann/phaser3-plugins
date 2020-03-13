import NavMesh, { defaultOptions } from './lib/navMesh';
import Config from './lib/config';
import Debug from './lib/debug';

function err() {
  return console.error('[NavMeshPlugin] no TileMap / TileLayer found');
}

export default class NavMeshPlugin extends Phaser.Plugins.BasePlugin {
  navMesh;

  /**
   * @method buildFromTileLayer
   * @param {Object} options
   */
  buildFromTileLayer(options = {}) {
    if (!options.tileMap || !options.tileLayer) {
      return err();
    }

    Config.set(options);
    Debug.set(options.scene, options.tileLayer, options.debug);

    if (this.navMesh) {
      this.navMesh.generate();
    } else {
      this.navMesh = new NavMesh(this.game);
    }

    return this.navMesh;
  }

  getPath(startPosition, endPosition, offset) {
    if (!this.navMesh) {
      return false;
    }

    return this.navMesh.getPath(startPosition, endPosition, offset);
  }

  /**
   * @method addSprite
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Boolean} refresh
   */
  addSprite(x, y, width, height, refresh = true) {
    const tileLayer = Config.get('tileLayer');
    if (!tileLayer) {
      return err();
    }

    const sprite = Config.mapGrid.addSprite(x, y, width, height);
    if (sprite && refresh) {
      this.navMesh.generate();
    }

    return sprite;
  }

  /**
   * @method removeSprite
   * @param {String} uuid
   * @param {Boolean} refresh
   */
  removeSprite(uuid, refresh = true) {
    const tileLayer = Config.get('tileLayer');
    if (!tileLayer) {
      return err();
    }

    Config.mapGrid.removeSprite(uuid);
    if (refresh) {
      this.navMesh.generate();
    }
  }
}

window.NavMeshPlugin = NavMeshPlugin;
