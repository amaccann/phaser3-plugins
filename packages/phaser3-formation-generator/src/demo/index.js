import Phaser from 'phaser';
import { DragSelectPlugin } from '@pixelburp/phaser3-drag-select';
import { GameObjectEnginePlugin } from '@pixelburp/phaser3-game-object-engine';

import DemoScene from './scene/demo-scene';
import FormationGeneratorPlugin from '../js/formation-generator-plugin';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [
      { key: 'DragSelectPlugin', plugin: DragSelectPlugin },
      { key: 'GameObjectEnginePlugin', plugin: GameObjectEnginePlugin },
      { key: 'FormationGeneratorPlugin', plugin: FormationGeneratorPlugin },
    ],
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

const game = new Phaser.Game(config);
