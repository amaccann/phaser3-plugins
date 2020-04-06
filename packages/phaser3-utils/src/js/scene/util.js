import GpsScene, { GPS_SCENE_KEY } from './gps-scene';
import InterfaceScene, { INTERFACE_SCENE_KEY } from './interface-scene';
import forEach from '../util/forEach';

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

export const ALL_DISPLAY_LIST_CALLBACKS = {};

export function addDisplayListCallbacks(scene, addCallback, removeCallback) {
  if (ALL_DISPLAY_LIST_CALLBACKS[scene]) {
    return false;
  }

  ALL_DISPLAY_LIST_CALLBACKS[scene] = {
    add: addCallback,
    remove: removeCallback,
  };

  scene.events.once('shutdown', () => {
    ALL_DISPLAY_LIST_CALLBACKS[scene] = undefined;
  });

  scene.children.addCallback = gameObject => {
    forEach(Object.values(ALL_DISPLAY_LIST_CALLBACKS), ({ add }) => add(gameObject));
  };

  scene.children.removeCallback = gameObject => {
    forEach(Object.values(ALL_DISPLAY_LIST_CALLBACKS), ({ remove }) => remove(gameObject));
  };
}

export function createPolygonFromSides(x, y, numberOfSides, size) {
  const points = [];
  let i = 0;

  for (i; i < numberOfSides; i += 1) {
    points.push({
      x: x + size * Math.cos((i * 2 * Math.PI) / numberOfSides),
      y: y + size * Math.sin((i * 2 * Math.PI) / numberOfSides),
    });
  }
  return points;
}

export function sortPointsClockwise(points, center) {
  // Adapted from <https://stackoverflow.com/a/6989383/822138> (ciamej)

  if (!center) {
    // center = this.centroid(points);
    center = Phaser.Geom.Point.GetCentroid(points);
  }

  let cx = center.x;
  let cy = center.y;

  let sort = function(a, b) {
    if (a.x - cx >= 0 && b.x - cx < 0) {
      return -1;
    }

    if (a.x - cx < 0 && b.x - cx >= 0) {
      return 1;
    }

    if (a.x - cx === 0 && b.x - cx === 0) {
      if (a.y - cy >= 0 || b.y - cy >= 0) {
        return a.y > b.y ? 1 : -1;
      }

      return b.y > a.y ? 1 : -1;
    }

    // Compute the cross product of vectors (center -> a) * (center -> b)
    var det = (a.x - cx) * -(b.y - cy) - (b.x - cx) * -(a.y - cy);

    if (det < 0) {
      return -1;
    }

    if (det > 0) {
      return 1;
    }

    // Points a and b are on the same line from the center
    // Check which point is closer to the center
    var d1 = (a.x - cx) * (a.x - cx) + (a.y - cy) * (a.y - cy);
    var d2 = (b.x - cx) * (b.x - cx) + (b.y - cy) * (b.y - cy);

    return d1 > d2 ? -1 : 1;
  };

  return points.sort(sort);
}
