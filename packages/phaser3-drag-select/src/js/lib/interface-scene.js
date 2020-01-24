import MouseInterface from './mouse-interface';

export const SCENE_KEY = 'DragSelectPlugin:InterfaceScene';

export default class InterfaceScene extends Phaser.Scene {
  dragPlugin;
  mouseInterface;

  constructor(scenePlugin, dragPlugin) {
    super({ key: SCENE_KEY, active: true });

    this.dragPlugin = dragPlugin;
    scenePlugin.add(SCENE_KEY, this, true);
    scenePlugin.bringToTop(SCENE_KEY);
  }

  create() {
    this.mouseInterface = new MouseInterface(this);
  }
}
