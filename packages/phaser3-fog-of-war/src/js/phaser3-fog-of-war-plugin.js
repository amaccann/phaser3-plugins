import Phaser from 'phaser';

import { forEach } from '@pixelburp/phaser3-utils';
// import FogMap from './lib/fog-map';

export default class Phaser3FogOfWarPlugin extends Phaser.Plugins.BasePlugin {
  scene;

  setup(config = {}) {
    const { scene } = config;
    const { width, height } = scene.sys.game.canvas;
    console.log(width, height);
    this.scene = scene;

    // this.fogMap = new FogMap(scene, {
    //   width: 100,
    //   height: 100,
    // });

    // this.shape = scene.make.graphics();
    //
    // this.mask = new Phaser.Display.Masks.GeometryMask(scene, this.shape);
    // this.mask.setInvertAlpha(true);
    //
    // this.texture = scene.add.renderTexture(0, 0, width, height);
    // this.texture.fill(0xff00ff, 0.5);
    // this.texture.setScrollFactor(0);
    // this.texture.setMask(this.mask);
  }

  start() {
    console.log('started');
  }

  update() {
    // this.shape.clear();
    // this.shape.fillStyle(0xffffff);
    //
    const children = this.scene.children.getChildren();
    forEach(children, gameObject => {
      // this.shape.fillCircle(gameObject.x, gameObject.y, 75);
      // this.fogMap.revealForGameObject(gameObject);
    })
  }
}
