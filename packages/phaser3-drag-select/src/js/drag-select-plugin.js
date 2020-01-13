import Phaser from 'phaser';

import MouseInterface from './lib/mouse-interface';
import InterfaceScene from './lib/interface-scene';
import { EVENT_MAP } from './lib/constants';

let tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
let tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();

export default class DragSelectPlugin extends Phaser.Plugins.BasePlugin {
  interfaceScene;

  enabled = true;

  constructor(pluginManager) {
    // console.log('constructor', scene);
    console.log('pluginManager', pluginManager);
    super(pluginManager);
    this.counter = 0;
    this.countDelay = 300;
    this.nextCount = 0;
    this.textObject = null;
    this.active = true;

    // console.log('targetScene', scene);
    console.log('this', this);
  }

  get scenePlugin() {
    return this.pluginManager.scene;
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;

    this.interfaceScene = new InterfaceScene(scenePlugin);
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

  onMouseUp = (rectangle) => {
    console.group('onMouseUp');
    const { manager } = this.scenePlugin;
    console.log('rectangle', rectangle);

    console.log('sceneManager', manager);
    const activeScenes = manager.getScenes();
    const items = activeScenes.reduce((list, scene) => {
      console.warn('scene', scene);
      return list.concat(scene.children.getChildren().filter(child => {
        if (!child.input?.enabled) {
          return;
        }
        child.getWorldTransformMatrix(tempMatrix, tempParentMatrix);
        const d = tempMatrix.decomposeMatrix();
        console.log('d', d);
        console.log('child', child);
        console.log('getBounds', child.input?.enabled && child.getBounds());
        return Phaser.Geom.Rectangle.Overlaps(rectangle, child.getBounds());
      }));
    }, []);
    console.log('activeScenes', activeScenes);
    console.log('items', items);
    console.groupEnd();
  };

  //  Called when the Plugin is booted by the PluginManager.
  //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
  boot() {
    this.createInterfaceScene();
    this.addEmitterEventCallbacks();

    this.text = this.interfaceScene.add.text(100, 200, 'Phaser', {
      fontFamily: 'Arial',
      fontSize: 64,
      color: '#00ff00'
    });
  }

  //  Called every Scene step - phase 1
  preUpdate = (time, delta) => {}

  //  Called every Scene step - phase 2
  update(time, delta) {
    if (!this.active) {
      return;
    }
    if ((this.nextCount -= delta) < 0) {
      if (++this.counter > 99) {
        this.counter = 0;
      }
      this.text.setText(this.counter);
      this.nextCount = this.countDelay;
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
  setDelay(delay) {
    this.countDelay = delay;
  }

  //  Custom method for this plugin
  reset() {
    this.counter = 0;
    this.text.setText(0);
  }
}
