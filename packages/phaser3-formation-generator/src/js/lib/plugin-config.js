import Phaser from 'phaser';
import { MOUSE_BUTTONS } from '@pixelburp/phaser3-utils';

class PluginConfig {
  /**
   * @name camera
   * @type Phaser.Cameras.Scene2D.Camera
   */
  camera = null;

  collisionIndices = [];

  gridSize = 1;

  mouseClickToTrack = MOUSE_BUTTONS.RIGHT;

  onComplete = () => true;

  scene = null;

  tileLayer = null;

  setConfig(props = {}) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }

  get(key) {
    return this[key];
  }
}

export default new PluginConfig();
