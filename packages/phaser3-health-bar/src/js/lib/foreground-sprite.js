import { getFromChild } from '@pixelburp/phaser3-utils';
// import { getFromChild } from '../../../../phaser3-utils/src/index.exports';
import BarSprite from './bar-sprite';

const DEFAULT_WIDTH = 50;

export default class ForegroundSprite extends BarSprite {
  constructor(scene, child, config, index) {
    super(scene, child, config, index);

    const { currentValueColor } = config;
    if (Array.isArray(currentValueColor)) {
      this.setTint.apply(this, currentValueColor);
    } else {
      this.setTint(currentValueColor);
    }
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
