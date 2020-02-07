import PluginConfig from './plugin-config';
import BarGraphics from './bar-graphic';

export default class ForegroundBar extends BarGraphics {
  drawAll() {
    const barHeight = PluginConfig.get('barHeight');
    const currentValueColor = PluginConfig.get('currentValueColor');

    this.clear();
    this.fillStyle(currentValueColor, 1);
    this.fillRect(0, 0, 30, barHeight);
  }
}
