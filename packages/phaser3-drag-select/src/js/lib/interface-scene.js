import MouseInterface from './mouse-interface';

export const SCENE_KEY = 'DragSelectPlugin:InterfaceScene';

export default class InterfaceScene extends Phaser.Scene {
  isDisabled = false;

  dragPlugin;
  mouseInterface;

  constructor() {
    super({ key: SCENE_KEY });
  }

  setDragPlugin(dragPlugin) {
    this.dragPlugin = dragPlugin;
  }

  disable() {
    if (!this.isDisabled) {
      this.isDisabled = true;
      this.mouseInterface.disable();
    }
  }

  enable() {
    if (this.isDisabled) {
      this.isDisabled = false;
      this.mouseInterface.enable();
    }
  }

  create() {
    if (this.mouseInterface) {
      this.mouseInterface.destroy();
    }
    this.mouseInterface = new MouseInterface(this);
  }
}
