import BarSprite from './bar-sprite';

export default class BackgroundSprite extends BarSprite {
  constructor(scene, child, config, index) {
    super(scene, child, config, index);
    const { backgroundColor } = config;

    if (Array.isArray(backgroundColor)) {
      this.setTint.apply(this, backgroundColor);
    } else {
      this.setTint(backgroundColor);
    }
  }
}
