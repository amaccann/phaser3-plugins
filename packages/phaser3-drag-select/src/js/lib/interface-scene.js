import MouseInterface from './mouse-interface';

export const SCENE_KEY = 'DragSelectPlugin:InterfaceScene';

export default class InterfaceScene extends Phaser.Scene {
  dragPlugin;
  mouseInterface;

  constructor() {
    super({ key: SCENE_KEY });
  }

  setDragPlugin(dragPlugin) {
    this.dragPlugin = dragPlugin;
  }

  create() {
    if (this.mouseInterface) {
      this.mouseInterface.destroy();
    }
    this.mouseInterface = new MouseInterface(this);
  }
}
