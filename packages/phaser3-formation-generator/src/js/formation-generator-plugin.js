import Phaser from 'phaser';
import { INTERFACE_SCENE_KEY, createUtilityScene, forEach, sortPointsClockwise } from '@pixelburp/phaser3-utils';

import PluginConfig from './lib/plugin-config';
import MouseInterface from './lib/mouse-interface';

/**
 * @class FormationGeneratorPlugin
 * @extends Phaser.Plugins.BasePlugin
 * @description Phaser3, Drag Selection plugin
 */
export default class FormationGeneratorPlugin extends Phaser.Plugins.BasePlugin {
  interfaceScene;
  mouseInterface;

  /**
   * @method setup
   */
  setup(config = {}) {
    this.setConfig(config);
    console.log('config', PluginConfig);
    this.createInterfaceScene();
  }

  get scenePlugin() {
    return PluginConfig.get('scene')?.scene;
  }

  /**
   * @method disable
   * @description If enabled, disable the plugin
   */
  disable() {}

  /**
   * @method enable
   * @description If not already enabled, enable the plugin
   */
  enable() {}

  /**
   * @method setConfig
   * @description Updates the plugin's configuration with new values
   * @param {Object} config - new configuration object
   */
  setConfig(config = {}) {
    PluginConfig.setConfig(config);
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;
    this.interfaceScene = createUtilityScene(INTERFACE_SCENE_KEY, scenePlugin, this);
    this.interfaceScene.enable();

    if (this.mouseInterface) {
      this.mouseInterface.destroy();
    }
    this.mouseInterface = new MouseInterface(this.interfaceScene, this);

    this.testGraphics = this.interfaceScene.add.graphics();
  }

  getCentroidTile(centroid) {
    console.group('getCentroidTile');
    const tileLayer = PluginConfig.get('tileLayer');
    const camera = PluginConfig.get('camera');
    console.log('tileLayer', tileLayer);
    const centroidTile = tileLayer.getTileAtWorldXY(centroid.worldX, centroid.worldY, true, camera);
    // const centroidTile = tileLayer.getTileAt(1, 1);
    console.log('centroidTile', centroidTile);
    console.log('collides', centroidTile && centroidTile.collides);
    if (centroidTile) {
      centroidTile.tint = 0xff00ff;
    }
    console.groupEnd('getCentroidTile');
    return centroidTile;
  }

  calculate(gameObjects = [], config) {
    const result = [];

    const tileLayer = PluginConfig.get('tileLayer');
    const camera = PluginConfig.get('camera');
    const pointer = this.interfaceScene.input.activePointer.positionToCamera(camera);

    const centroid = Phaser.Geom.Point.GetCentroid(gameObjects);
    const centroidTile = tileLayer.getTileAtWorldXY(centroid.x, centroid.y, true, camera);

    const squareRoot = Math.round(Math.sqrt(gameObjects.length));
    // If 9, then 3 x 3 grid?

    console.log('centroid', centroid);
    console.log('centroidTile', centroidTile);
    console.log('squareRoot', squareRoot);
    sortPointsClockwise(gameObjects, centroid);

    this.renderPolygon(gameObjects);

    forEach(gameObjects, gameObject => {
      const line = new Phaser.Geom.Line(centroid.x, centroid.y, gameObject.x, gameObject.y);
      const offsetLine = Phaser.Geom.Line.Clone(line);
      const angle = Phaser.Geom.Line.Angle(line);
      const length = Phaser.Geom.Line.Length(line);
      Phaser.Geom.Line.SetToAngle(offsetLine, pointer.x, pointer.y, angle, length);
      const tile = tileLayer.getTileAtWorldXY(offsetLine.x2, offsetLine.y2, camera);
      // const coords = Phaser.Geom.Line.BresenhamPoints(offsetLine, 5);
      // console.log('coords', coords);

      if (tile) {
        tile.tint = 0xff00ff;
        result.push({ gameObject, tile });
      }
    });

    // this.renderLines(lines);
    return result;
  }

  renderPolygon(gameObjects) {
    this.testGraphics.clear();
    this.testGraphics.lineStyle(3, 0xff00ff, 0.5);
    this.testGraphics.beginPath();

    forEach(gameObjects, (gameObject, index) => {
      if (index === 0) {
        this.testGraphics.moveTo(gameObject.x, gameObject.y);
      } else {
        this.testGraphics.lineTo(gameObject.x, gameObject.y);
      }
    });

    this.testGraphics.closePath();
    this.testGraphics.strokePath();
  }

  renderLines(lines) {
    const pointer = this.interfaceScene.input.activePointer;
    this.testGraphics.clear();
    this.testGraphics.lineStyle(3, 0xff00ff, 0.5);
    this.testGraphics.fillStyle(0xff00ff);

    lines.forEach(line => {
      this.testGraphics.beginPath();
      this.testGraphics.moveTo(line.x1, line.y1);
      this.testGraphics.lineTo(line.x2, line.y2);
      this.testGraphics.closePath();
      this.testGraphics.strokePath();
    });

    this.testGraphics.lineStyle(3, 0x00ff00);
    this.testGraphics.fillStyle(0x00ff00);

    lines.forEach(line => {
      const angle = Phaser.Geom.Line.Angle(line);
      const length = Phaser.Geom.Line.Length(line);

      // Transpose the line to the new relative angle & length;
      Phaser.Geom.Line.SetToAngle(line, pointer.x, pointer.y, angle, length);

      this.testGraphics.beginPath();
      this.testGraphics.moveTo(line.x1, line.y1);
      this.testGraphics.lineTo(line.x2, line.y2);
      this.testGraphics.closePath();
      this.testGraphics.strokePath();
    });
  }

  stop() {
    super.stop();
    console.warn('Plugin stopped');
  }

  start() {
    super.start();
    console.warn('Plugin started');
  }
}
