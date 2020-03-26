import { forEach } from '@pixelburp/phaser3-utils';

export const GPS_SCENE_KEY = 'PxlBrp:Phaser3Plugins:GpsScene';

export default class GpsScene extends Phaser.Scene {
  isDisabled = false;

  sharedPlugins = new Set();

  constructor() {
    super({ key: GPS_SCENE_KEY });
  }

  setPlugin(plugin) {
    if (!this.sharedPlugins.has(plugin)) {
      this.sharedPlugins.add(plugin);
    }
  }

  eachChildren(callback) {
    const children = this.children.getChildren();
    forEach(children, callback);
  }

  disable() {
    if (!this.isDisabled) {
      this.isDisabled = true;
      this.eachChildren(child => {
        child.disable && child.disable();
      });
    }
  }

  enable() {
    if (this.isDisabled) {
      this.isDisabled = false;
      this.eachChildren(child => {
        child.disable && child.enable();
      });
    }
  }
}
