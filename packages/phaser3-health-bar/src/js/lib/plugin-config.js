import HealthBarConfig from './health-bar-config';
import PluginGlobalConfig from './plugin-global-config';

class PluginConfig {
  config = {};
  data = [];

  setConfig(config = {}, data = []) {
    this.config = new PluginGlobalConfig(config);
    this.data = data.map(d => new HealthBarConfig(d));
  }

  forEachConfig(callback) {
    const length = this.data.length;
    let i = 0;

    for (i; i < length; i += 1) {
      callback(this.data[i], i);
    }
  }

  getGlobal(key) {
    return this.config[key];
  }

  isValidChild(child) {
    return this.data.some(config => config.childSelector(child));
  }
}

export default new PluginConfig();
