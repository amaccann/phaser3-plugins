import HealthBar from './health-bar';
import PluginConfig from './plugin-config';

export const SCENE_KEY = 'HealthBarPlugin:HealthBarScene';

export default class HealthBarScene extends Phaser.Scene {
  isDisabled = false;

  plugin;
  groups = new Set();
  // mouseInterface;

  constructor() {
    super({ key: SCENE_KEY });
  }

  setPlugin(plugin) {
    this.plugin = plugin;
  }

  addHealthBar(child) {
    const healthBarGroup = new HealthBar(this, child);
    child.healthBar = healthBarGroup;
  }

  disable() {
    this.isDisabled = true;
  }

  enable() {
    this.isDisabled = false;
  }

  update(time, delta) {
    this.children.each(bar => bar.update(time, delta));
  }
}
