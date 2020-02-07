import Phaser from 'phaser';

import HealthBarPlugin from '../js/health-bar-plugin';
import DemoScene from './scene/demo-scene';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  parent: 'mycanvas',
  plugins: {
    global: [{ key: 'HealthBarPlugin', plugin: HealthBarPlugin }],
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
