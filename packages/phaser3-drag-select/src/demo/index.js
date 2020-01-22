import Phaser from 'phaser';

import DemoScene from './scene/demo-scene';
import DemoScene2 from './scene/demo-scene-2';
import DragSelectPlugin from '../js/drag-select-plugin';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [{ key: 'DragSelectPlugin', plugin: DragSelectPlugin }],
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: DEBUG.ARCADE,
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [DemoScene, DemoScene2],
};

const game = new Phaser.Game(config);

console.warn('game', game);
