import Phaser from 'phaser';
import { DragSelectPlugin } from '@pixelburp/phaser3-drag-select';

import GameObjectEnginePlugin from '../js/game-object-engine-plugin';
import DemoScene from './scene/demo-scene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [
      { key: 'GameObjectEnginePlugin', plugin: GameObjectEnginePlugin },
      { key: 'DragSelectPlugin', plugin: DragSelectPlugin },
    ],
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: DEBUG.ARCADE,
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [DemoScene],
};

const game = new Phaser.Game(config);
console.log('game', game);
