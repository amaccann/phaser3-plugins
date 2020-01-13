export default class DragSelectPlugin extends Phaser.Plugins.ScenePlugin {
  enabled = true;

  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    this.scene = scene;
    this.counter = 0;
    this.countDelay = 300;
    this.nextCount = 0;
    this.textObject = null;
    this.active = true;
  }

  //  Called when the Plugin is booted by the PluginManager.
  //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
  boot() {
    let eventEmitter = this.systems.events;
    console.log('eventEmitter', eventEmitter);

    eventEmitter.on('update', this.update, this);
    this.text = this.scene.add.text(100, 200, 'Phaser', {
      fontFamily: 'Arial',
      fontSize: 64,
      color: '#00ff00'
    });

    /*
        List of unused eventEmitters to activate matching methods of this plugin
    */

    eventEmitter.on('start', this.start, this);

    eventEmitter.on('preupdate', this.preUpdate, this);
    eventEmitter.on('postupdate', this.postUpdate, this);

    eventEmitter.on('pause', this.pause, this);
    eventEmitter.on('resume', this.resume, this);

    eventEmitter.on('sleep', this.sleep, this);
    eventEmitter.on('wake', this.wake, this);

    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  }

  //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
  start() {
    console.warn('Plugin started!!');
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
    this.enabled = false;
  }

  //  Called when a Scene is resumed from a paused state.
  resume() {
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
    this.scene = undefined;
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
