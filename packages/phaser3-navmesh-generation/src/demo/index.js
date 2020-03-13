import Phaser from 'phaser';

import DemoState from './demo-state';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    // global: [{ key: 'DragSelectPlugin', plugin: DragSelectPlugin }],
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: DEBUG.ARCADE,
      gravity: { y: 200 },
    },
  },
  scene: [DemoState],
};

window.DEMO_GAME = new Phaser.Game(config);
