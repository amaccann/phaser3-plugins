import { isStaticType } from './utils';

export default class WayPoint {
  isShuffle = false;
  isStaticLocation;
  item;

  constructor(item, isShuffle = false) {
    this.isShuffle = isShuffle;
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
