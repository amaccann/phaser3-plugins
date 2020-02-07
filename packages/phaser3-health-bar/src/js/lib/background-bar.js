import PluginConfig from './plugin-config';
import BarGraphics from './bar-graphic';

export default class BackgroundBar extends BarGraphics {
  drawAll() {
    const backgroundColor = PluginConfig.get('backgroundColor');
    const barHeight = PluginConfig.get('barHeight');
    const outlineColor = PluginConfig.get('outlineColor');
    const outlineWidth = PluginConfig.get('outlineWidth');

    this.clear();
    this.lineStyle(outlineWidth, outlineColor, 1);
    this.fillStyle(backgroundColor, 1);
    let TEMP_HEIGHT = 50;
    this.fillRect(0, 0, TEMP_HEIGHT, barHeight);
    this.strokeRect(0, 0, TEMP_HEIGHT, barHeight);
  }
}
