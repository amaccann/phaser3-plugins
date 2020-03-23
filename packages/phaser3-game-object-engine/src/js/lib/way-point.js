import { isStaticType } from './utils';

export default class WayPoint {
  isStaticLocation;
  item;

  constructor(item) {
    this.isStaticLocation = isStaticType(item);
    this.item = item;
  }

  get x() {
    return this.item?.x;
  }

  get y() {
    return this.item?.y;
  }
}
