const DEFAULT_HEALTH_PROPS = {
  current: 'health',
  max: 'maxHealth',
  min: 'minHealth',
};

export default class HealthBarConfig {
  /**
   * @name backgroundColor
   * @type Number|Array
   */
  backgroundColor = 0x000000;
  /**
   * @name barHeight
   * @type Number
   */
  barHeight = 15;
  /**
   * @name currentValueColor
   * @type Number|Array
   */
  currentValueColor = 0x33ff33;
  /**
   * @name propsToWatch
   * @type Object
   */
  propsToWatch = DEFAULT_HEALTH_PROPS;

  constructor(props = {}) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
}
