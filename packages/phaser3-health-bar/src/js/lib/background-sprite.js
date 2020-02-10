import BarSprite from './bar-sprite';

export default class BackgroundSprite extends BarSprite {
  constructor(scene, child, config, index) {
    super(scene, child, config, index);
    const { backgroundColor, backgroundColorGradient } = config;
    const gradiated = backgroundColor * backgroundColorGradient;

    this.setTint(gradiated, gradiated, backgroundColor, backgroundColor);
  }
}
