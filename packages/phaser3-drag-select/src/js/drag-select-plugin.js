import Phaser from 'phaser';

import InterfaceScene, { SCENE_KEY } from './lib/interface-scene';
import { EVENT_MAP } from './lib/constants';
import PluginConfig from './lib/plugin-config';

export default class DragSelectPlugin extends Phaser.Plugins.BasePlugin {
  interfaceScene;
  scene;
  // scenePlugin;

  constructor(pluginManager) {
    // console.log('constructor', scene);
    console.log('pluginManager', pluginManager);
    super(pluginManager);

    // console.log('targetScene', scene);
    console.log('this', this);
    console.log('this', this.setup);
  }

  setup(scene, config = {}) {
    PluginConfig.setConfig(config);

    this.scene = scene;
    this.createInterfaceScene();
    this.addEmitterEventCallbacks();
  }

  get scenePlugin() {
    return this.scene.scene;
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;
    this.interfaceScene = scenePlugin.get(SCENE_KEY) || new InterfaceScene(scenePlugin, this.config);
    scenePlugin.launch(SCENE_KEY);
  }

  addEmitterEventCallbacks() {
    const eventEmitter = this.game.events;
    // this.scenePlugin.events.on('shutdown', () => {
    //   console.log('hi there')
    // });

    // eventEmitter.on('update', this.update, this);
    //
    //
    // eventEmitter.on('pause', this.pause, this);
    // eventEmitter.on('resume', this.resume, this);
    //
    // eventEmitter.on('shutdown', this.shutdown, this);
    // eventEmitter.on('destroy', this.destroy, this);
    //
    this.interfaceScene.sys.events.on(EVENT_MAP.ON_MOUSE_UP, this.onMouseUp);
  }

  onMouseUp = rectangle => {
    const items = this.scene.children.getChildren().filter(child => {
      const canSelectChild = PluginConfig.get('childSelector')(child);

      // If the child cannot be selected, or has not got any bounds
      if (!canSelectChild || !child.getBounds) {
        return;
      }

      const camera = PluginConfig.get('camera');
      const childBounds = child.getBounds();
      const x = (childBounds.x - camera.worldView.x) * camera.zoom;
      const y = (childBounds.y - camera.worldView.y) * camera.zoom;
      const width = childBounds.width * camera.zoom;
      const height = childBounds.height * camera.zoom;
      const childRect = new Phaser.Geom.Rectangle(x, y, width, height);

      return Phaser.Geom.Rectangle.Overlaps(rectangle, childRect);
    });

    console.log('items', items);
    PluginConfig.get('onSelect')(items);
  };

  stop() {
    super.stop();
    this.scenePlugin.stop(SCENE_KEY);
  }

  //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
  pause() {
    console.log('pause');
  }

  //  Called when a Scene is resumed from a paused state.
  resume() {
    console.log('resume');
  }
}
