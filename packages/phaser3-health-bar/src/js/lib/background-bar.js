import BarGraphics from './bar-graphic';

export default class BackgroundBar extends BarGraphics {
  isBackground = true;

  drawAll() {
    const { config } = this;
    const backgroundColor = config.backgroundColor;
    const barHeight = config.barHeight;
    const outlineColor = config.outlineColor;
    const outlineWidth = config.outlineWidth;
    const width = this.childWidth;

    this.clear();
    this.lineStyle(outlineWidth, outlineColor, 1);
    this.fillStyle(backgroundColor, 1);
    this.fillRect(0, 0, width, barHeight);
    this.strokeRect(0, 0, width, barHeight);
  }
}
