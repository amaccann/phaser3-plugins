import Phaser from 'phaser';

import DemoScene from './demo-scene';
import NavMeshPlugin from '../js/nav-mesh-plugin';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [{ key: 'NavMeshPlugin', plugin: NavMeshPlugin }],
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: DEBUG.ARCADE,
      gravity: { y: 200 },
    },
  },
  scene: [DemoScene],
};

window.DEMO_GAME = new Phaser.Game(config);
