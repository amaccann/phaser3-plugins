import Phaser, { Scene } from 'phaser';

export default class DemoScene extends Scene {
  fpsText;

  constructor() {
    super({ key: 'DemoScene', active: true });
  }

  preload() {

  }

  create() {
    this.healthBarPlugin = this.plugins.start('HealthBarPlugin', 'healthBarPlugin');
    console.log('healthBarPlugin', this.healthBarPlugin);

    this.fpsText = this.add.text(10, 10, '');
    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(3)}`);
  }
}
