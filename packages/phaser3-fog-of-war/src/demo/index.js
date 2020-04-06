import Phaser from 'phaser';
import { DragSelectPlugin } from '@pixelburp/phaser3-drag-select';
import { GameObjectEnginePlugin } from '@pixelburp/phaser3-game-object-engine';

import DemoScene from './scene/demo-scene';
import FogOfWarPlugin from '../js/phaser3-fog-of-war-plugin';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [
      { key: 'DragSelectPlugin', plugin: DragSelectPlugin },
      { key: 'GameObjectEnginePlugin', plugin: GameObjectEnginePlugin },
      { key: 'FogOfWarPlugin', plugin: FogOfWarPlugin },
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

window.DEMO_GAME = new Phaser.Game(config);
