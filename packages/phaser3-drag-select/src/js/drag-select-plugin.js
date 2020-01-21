import Phaser from 'phaser';

import InterfaceScene from './lib/interface-scene';
import { EVENT_MAP } from './lib/constants';
import PluginConfig from './lib/plugin-config';


export default class DragSelectPlugin extends Phaser.Plugins.BasePlugin {
  config;
  interfaceScene;

  enabled = true;

  constructor(pluginManager) {
    // console.log('constructor', scene);
    console.log('pluginManager', pluginManager);
    super(pluginManager);
    this.active = true;

    // console.log('targetScene', scene);
    console.log('this', this);
  }

  get scenePlugin() {
    return this.pluginManager.scene;
  }

  init(config = {}) {
    PluginConfig.setConfig(config);

    this.createInterfaceScene();
    this.addEmitterEventCallbacks();
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;

    this.interfaceScene = new InterfaceScene(scenePlugin, this.config);
  }

  addEmitterEventCallbacks() {
    const eventEmitter = this.pluginManager.sys.events;

    eventEmitter.on('update', this.update, this);

    eventEmitter.on('start', this.start, this);

    eventEmitter.on('preupdate', this.preUpdate, this);
    eventEmitter.on('postupdate', this.postUpdate, this);

    eventEmitter.on('pause', this.pause, this);
    eventEmitter.on('resume', this.resume, this);

    eventEmitter.on('sleep', this.sleep, this);
    eventEmitter.on('wake', this.wake, this);

    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);

    this.interfaceScene.sys.events.on(EVENT_MAP.ON_MOUSE_UP, this.onMouseUp);
  }

  onMouseUp = rectangle => {
    const { manager } = this.scenePlugin;
    const activeScenes = manager.getScenes();

    const items = activeScenes.reduce((list, scene) => {
      if (scene === this.interfaceScene) {
        return list;
      }

      return list.concat(
        scene.children.getChildren().filter(child => {
          const canSelectChild = PluginConfig.get('childSelector')(child);

          // If the child cannot be selected, or has not got any bounds
          if (!canSelectChild || !child.getBounds) {
            return;
          }

          const camera = scene.cameras.main;
          const childBounds = child.getBounds();
          const x = (childBounds.x - camera.worldView.x) * camera.zoom;
          const y = (childBounds.y - camera.worldView.y) * camera.zoom;
          const width = childBounds.width * camera.zoom;
          const height = childBounds.height * camera.zoom;
          const childRect = new Phaser.Geom.Rectangle(x, y, width, height);

          return Phaser.Geom.Rectangle.Overlaps(rectangle, childRect);
        })
      );
    }, []);
    console.log('activeScenes', activeScenes);
    console.log('items', items);
    PluginConfig.get('onSelect')(items);
  };

  //  Called when the Plugin is booted by the PluginManager.
  //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
  boot() {
    // this.createInterfaceScene();
    // this.addEmitterEventCallbacks();
  }

  //  Called every Scene step - phase 1
  preUpdate = (time, delta) => {};

  //  Called every Scene step - phase 2
  update(time, delta) {
    if (!this.active) {
      return;
    }
  }

  //  Called every Scene step - phase 3
  postUpdate(time, delta) {}

  //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
  pause() {
    console.log('pause');
    this.enabled = false;
  }

  //  Called when a Scene is resumed from a paused state.
  resume() {
    console.log('resume');
    this.enabled = true;
  }

  //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
  sleep() {
    this.enabled = false;
  }

  //  Called when a Scene is woken from a sleeping state.
  wake() {
    // @TODO - is the game paused?
    this.enabled = true;
  }

  //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
  shutdown() {}

  //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
  destroy() {
    this.shutdown();
    this.interfaceScene.destroy();
    this.interfaceScene = undefined;
  }

  //  Custom method for this plugin
  setDelay(delay) {}

  //  Custom method for this plugin
  reset() {}
}
