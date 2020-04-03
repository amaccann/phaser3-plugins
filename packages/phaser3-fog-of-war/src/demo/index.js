import Phaser from 'phaser';

import DemoScene from './scene/demo-scene';
import FogOfWarPlugin from '../js/phaser3-fog-of-war-plugin';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [{ key: 'FogOfWarPlugin', plugin: FogOfWarPlugin }],
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 },
    },
  },
  scene: [DemoScene],
};

window.DEMO_GAME = new Phaser.Game(config);
