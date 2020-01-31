import Phaser from 'phaser';

import InterfaceScene, { SCENE_KEY } from './lib/interface-scene';
import PluginConfig from './lib/plugin-config';

function doesSpriteOverlapWithSelection(child, rectangle) {
  const camera = PluginConfig.get('camera');
  const childBounds = child.getBounds();
  const x = (childBounds.x - camera.worldView.x) * camera.zoom;
  const y = (childBounds.y - camera.worldView.y) * camera.zoom;
  const width = childBounds.width * camera.zoom;
  const height = childBounds.height * camera.zoom;
  const childRect = new Phaser.Geom.Rectangle(x, y, width, height);

  return Phaser.Geom.Rectangle.Overlaps(rectangle, childRect);
}

export default class DragSelectPlugin extends Phaser.Plugins.BasePlugin {
  previewCache = [];
  selectionCache = [];
  interfaceScene;
  scene;

  setup(scene, config = {}) {
    PluginConfig.setConfig(config);

    this.scene = scene;
    this.createInterfaceScene();
  }

  get scenePlugin() {
    return this.scene.scene;
  }

  createInterfaceScene() {
    const scenePlugin = this.scenePlugin;
    if (scenePlugin.get(SCENE_KEY)) {
      return scenePlugin.launch(SCENE_KEY);
    }

    scenePlugin.add(SCENE_KEY, InterfaceScene, true);
    scenePlugin.bringToTop(SCENE_KEY);

    this.interfaceScene = scenePlugin.get(SCENE_KEY);
    if (this.interfaceScene) {
      this.interfaceScene.setDragPlugin(this);
    }
  }

  getEachValidChildFromScene(rectangle) {
    return this.scene.children.getChildren().filter(child => {
      const canSelectChild = PluginConfig.get('childSelector')(child);

      // If the child cannot be selected, has not got any bounds
      if (!canSelectChild || !child.getBounds) {
        return false;
      }

      return doesSpriteOverlapWithSelection(child, rectangle);
    });
  }

  /**
   * @param {Phaser.Geom.Rectangle} rectangle Selection rectangle
   */
  onPointerMove = rectangle => {
    this.previewCache = this.getEachValidChildFromScene(rectangle);

    PluginConfig.get('onPreview')(this.previewCache);
  };

  /**
   * @param {Phaser.Geom.Rectangle} rectangle Selection rectangle
   * @param {Boolean} isAmendActive "shift" key by default
   * @param {Boolean} isToggleSelect "ctrl" key by default
   */
  onPointerUp = (rectangle, isAmendActive, isToggleSelect) => {
    this.previewCache = [];
    const items = this.getEachValidChildFromScene(rectangle);

    // If amend is active, ensure no duplicate references added.
    if (isAmendActive) {
      this.selectionCache = this.selectionCache.concat(items.filter(i => !this.selectionCache.includes(i)));
      // If toggle is active, flip the selected / deselected list
    } else if (isToggleSelect) {
      const itemsToAdd = items.filter(i => !this.selectionCache.includes(i));
      const cacheWithItemsRemoved = this.selectionCache.filter(i => !items.includes(i));
      this.selectionCache = [...cacheWithItemsRemoved, ...itemsToAdd];
    } else {
      this.selectionCache = items;
    }

    PluginConfig.get('onSelect')(this.selectionCache);
  };

  stop() {
    super.stop();
    this.scenePlugin.stop(SCENE_KEY);
  }

  //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
  pause() {
    console.log('pause');
  }

  //  Called when a Scene is resumed from a paused state.
  resume() {
    console.log('resume');
  }
}
