import GpsScene, { GPS_SCENE_KEY } from './gps-scene';
import InterfaceScene, { INTERFACE_SCENE_KEY } from './interface-scene';

const ALL_SCENES = {
  [GPS_SCENE_KEY]: GpsScene,
  [INTERFACE_SCENE_KEY]: InterfaceScene,
};

/**
 * @function createUtilityScene
 * @param {String} key
 * @param {Phaser.Scenes.ScenePlugin} scenePlugin
 * @param {Phaser.Plugins.BasePlugin|Phaser.Plugins.ScenePlugin} plugin
 * @returns Phaser.Scene
 */
export function createUtilityScene(key, scenePlugin, plugin) {
  if (scenePlugin.get(key)) {
    const isActive = scenePlugin.isActive(key);
    if (!isActive) {
      scenePlugin.launch(key);
    }

    return scenePlugin.get(key);
  }

  scenePlugin.add(key, ALL_SCENES[key], true);
  scenePlugin.bringToTop(key);

  const interfaceScene = scenePlugin.get(key);
  if (interfaceScene) {
    interfaceScene.setPlugin(plugin);
  }
  return interfaceScene;
}
