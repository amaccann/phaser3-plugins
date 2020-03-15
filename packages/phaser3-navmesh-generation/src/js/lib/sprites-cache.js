export default class SpritesCache extends WeakMap {
  set(tile, index) {
    super.set(tile, index);
  }

  has(tile) {
    return !!this.get(tile);
  }

  delete(tile) {
    super.delete(tile);
  }

  getOriginalIndex(tile) {
    return this.get(tile);
  }
}
