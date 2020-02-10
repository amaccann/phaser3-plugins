import HealthBar from './health-bar';

export const SCENE_KEY = 'HealthBarPlugin:HealthBarScene';
export const ONE_PX_PNG_KEY = `${SCENE_KEY}:ONE_PX_PNG_KEY`;

export default class HealthBarScene extends Phaser.Scene {
  isDisabled = false;

  plugin;
  groups = new Set();
  // mouseInterface;

  constructor() {
    super({ key: SCENE_KEY });
  }

  createOnePixelTexture() {
    const graphics = this.make
      .graphics()
      .fillStyle(0xffffff)
      .fillRect(0, 0, 1, 1);
    graphics.generateTexture(ONE_PX_PNG_KEY, 1, 1);
    graphics.destroy();
  }

  setPlugin(plugin) {
    this.plugin = plugin;
  }

  addHealthBar(child) {
    child.healthBar = new HealthBar(this, child);
  }

  disable() {
    this.isDisabled = true;
  }

  enable() {
    this.isDisabled = false;
  }

  create() {
    this.createOnePixelTexture();
  }

  update(time, delta) {
    this.children.each(bar => bar.update(time, delta));
  }
}
