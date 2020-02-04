export default class DemoScene2 extends Phaser.Scene {
  constructor() {
    super('DemoScene2');
  }

  create() {
    this.fpsText = this.add.text(500, 500, 'This is a scene with no drag-selection; press [R] to swap scenes');
    this.fpsText.setScrollFactor(0);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.stop('DemoScene2');
      this.scene.launch('DemoScene');
    });
  }
}
