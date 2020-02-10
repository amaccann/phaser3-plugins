import BarSprite from './bar-sprite';
import getFromChild from '../util/get-from-child';

const DEFAULT_WIDTH = 50;

export default class ForegroundSprite extends BarSprite {
  constructor(scene, child, config, index) {
    super(scene, child, config, index);

    const { currentValueColor, currentValueColorGradient } = config;
    const gradiated = currentValueColor * currentValueColorGradient;
    this.setTint(currentValueColor, currentValueColor, gradiated, gradiated);
  }

  get childWidth() {
    return this.child?.width || DEFAULT_WIDTH;
  }

  calculateWidth() {
    const { child, config } = this;
    const { propsToWatch } = config;
    const { current, max, min } = propsToWatch;
    const currentValue = getFromChild(child, current);
    const maxValue = getFromChild(child, max);
    const minValue = getFromChild(child, min);
    const width = this.childWidth;

    if (currentValue <= minValue) {
      return this.setDisplaySize(0, config.barHeight);
    }

    const percentageWidth = width * (currentValue / maxValue);
    const finalWidth = percentageWidth >= width ? width : percentageWidth;

    this.setDisplaySize(finalWidth, config.barHeight);
  }

  update(time, delta) {
    const { child } = this;
    const { offsetY } = this.calculateOffset();
    const { x, y } = this.calculatePosition();
    const offsetX = child.originX * child.width;
    super.update(time, delta);
    this.setPosition(x - offsetX, y - offsetY);

    this.calculateWidth();
  }
}
