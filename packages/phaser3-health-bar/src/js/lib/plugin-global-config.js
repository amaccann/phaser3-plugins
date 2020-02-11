import Phaser from 'phaser';

export const IS_SPRITE = child => child instanceof Phaser.GameObjects.Sprite;
export const IS_VISIBLE = child => child.input?.enabled;

export default class PluginGlobalConfig {
  /**
   * @name camera
   * @type Phaser.Cameras.Scene2D.Camera
   */
  camera = null;
  /**
   * @name childSelector
   * @type Function
   */
  childSelector = IS_SPRITE;
  /**
   * @name offsetX
   * @type Number
   */
  offsetX = 0;
  /**
   * @name offsetY
   * @type Number
   */
  offsetY = 15;
  /**
   * @name scene
   * @type Phaser.Scene
   */
  scene = null;
  /**
   * @name visibleOnSelector
   * @type Function
   */
  visibleOnSelector = IS_VISIBLE;

  constructor(props = {}) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
}
