import PluginConfig from './plugin-config';
import { VIEW_DISTANCE_BUFFER } from './constants';

export function getCanClearFog(gameObject) {
  const canClearFogSelector = PluginConfig.get('canClearFogSelector');
  return canClearFogSelector(gameObject);
}

export function getVisibleGameObjectSelector(...args) {
  const visibleGameObjectSelector = PluginConfig.get('visibleGameObjectSelector');
  return visibleGameObjectSelector(...args);
}

export function getViewDistanceByGameObject(gameObject, includeBuffer) {
  const viewDistanceProp = PluginConfig.get('viewDistanceProp');
  const viewDistanceFallback = PluginConfig.get('viewDistanceFallback');

  const viewDistance = gameObject[viewDistanceProp] || viewDistanceFallback;
  return includeBuffer ? viewDistance + VIEW_DISTANCE_BUFFER : viewDistance;
}
