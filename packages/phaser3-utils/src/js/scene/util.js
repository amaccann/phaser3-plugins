import InterfaceScene, { INTERFACE_SCENE_KEY } from './interface-scene';

/**
 * @function createInterfaceScene
 * @param {Phaser.Scenes.ScenePlugin} scenePlugin
 * @param {Phaser.Plugins.BasePlugin|Phaser.Plugins.ScenePlugin} plugin
 * @returns Phaser.Scene
 */
export function createInterfaceScene(scenePlugin, plugin) {
  if (scenePlugin.get(INTERFACE_SCENE_KEY)) {
    const isActive = scenePlugin.isActive(INTERFACE_SCENE_KEY);
    if (!isActive) {
      scenePlugin.launch(INTERFACE_SCENE_KEY);
    }

    return scenePlugin.get(INTERFACE_SCENE_KEY);
  }

  scenePlugin.add(INTERFACE_SCENE_KEY, InterfaceScene, true);
  scenePlugin.bringToTop(INTERFACE_SCENE_KEY);

  const interfaceScene = scenePlugin.get(INTERFACE_SCENE_KEY);
  if (interfaceScene) {
    interfaceScene.setPlugin(plugin);
  }
  return interfaceScene;
}
