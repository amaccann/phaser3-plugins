import Phaser from 'phaser';
import { DragSelectPlugin } from '@pixelburp/phaser3-drag-select';

import { GameObjectBrainPlugin } from '../index.exports';

import DemoScene from './scene/demo-scene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [
      { key: 'GameObjectBrainPlugin', plugin: GameObjectBrainPlugin },
      { key: 'DragSelectPlugin', plugin: DragSelectPlugin },
    ],
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

const game = new Phaser.Game(config);
console.log('game', game);
