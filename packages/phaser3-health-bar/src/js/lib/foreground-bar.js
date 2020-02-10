import BarGraphics from './bar-graphic';
import getFromChild from '../util/get-from-child';

export default class ForegroundBar extends BarGraphics {
  isForeground = true;

  drawAll() {
    const { config } = this;
    const { barHeight, currentValueColor } = config;

    this.clear();
    this.fillStyle(currentValueColor, 1);
  }

  update(time, delta) {
    super.update(time, delta); // Update position

    const { child, config } = this;
    const { barHeight, currentValueColor, outlineWidth, outlineColor, propsToWatch } = config;
    const { current, max, min } = propsToWatch;
    const currentValue = getFromChild(child, current);
    const maxValue = getFromChild(child, max);
    const minValue = getFromChild(child, min);
    const width = this.childWidth;

    if (currentValue <= minValue) {
      return this.clear();
    }

    const percentageWidth = width * (currentValue / maxValue);
    const finalWidth = percentageWidth >= width ? width : percentageWidth;

    this.clear();
    this.lineStyle(outlineWidth, outlineColor, 1);
    this.fillStyle(currentValueColor, 1);
    this.fillRect(0, 0, finalWidth, barHeight);
    this.strokeRect(0, 0, finalWidth, barHeight);
  }
}
