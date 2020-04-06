import { forEach } from '@pixelburp/phaser3-utils';
import PluginConfig from './plugin-config';
import { getCanClearFog, getViewDistanceByGameObject } from './util';
import { BYTE_LENGTH, IMAGE_DEPTH } from './constants';

const CANVAS_KEY = 'PxlBrp:Phaser3Plugins:FogOfWar';

export default class FogCanvasTexture {
  canvas;
  fogColor;
  image;
  scene;
  tracker;
  visitedFogColor;

  constructor(scene, tracker) {
    const { width, height } = scene.sys.game.canvas;
    this.canvas = scene.textures.createCanvas(CANVAS_KEY, width, height);
    this.canvas.refresh();

    this.image = scene.add.image(0, 0, CANVAS_KEY);
    this.image.setDepth(IMAGE_DEPTH);
    this.image.setOrigin(0, 0);
    this.image.setScrollFactor(0);

    this.scene = scene;
    this.tracker = tracker;

    this.setFogColour();
    this.drawBackground(true);
  }

  get context() {
    return this.canvas.context;
  }

  get fogRGBA() {
    return this.fogColor.rgba;
  }

  get visitedFogRGBA() {
    return this.visitedFogColor.rgba;
  }

  get isCameraMoving() {
    const camera = this.scene.cameras.main;

    return camera.scrollX || camera.scrollY;
  }

  getWorldPoint(object) {
    const { scene } = this;
    const camera = scene.cameras.main;
    const x = (object.x - camera.worldView.x) * camera.zoom;
    const y = (object.y - camera.worldView.y) * camera.zoom;

    return { x, y };
  }

  // getScreenDimensions() {
  //   const { scene } = this;
  //   const camera = scene.cameras.main;
  //   const { width, height } = scene.sys.game.canvas;
  //   const world = this.getWorldPoint({ x: 0, y: 0 });
  //   const adjustedWidth = width + (width * camera.zoom);
  //   const adjustedHeight = height + (height * camera.zoom);
  //
  //   return { ...world, height: adjustedHeight, width: adjustedWidth };
  // }

  destroy() {
    // TODO do stuff?
  }

  getGradientByGameObject(gameObject, viewDistance) {
    const ctx = this.context;
    const innerRadius = 0.8 * viewDistance;
    const { x, y } = gameObject;

    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, viewDistance);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 255)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    return gradient;
  }

  setFogColour() {
    const fogBgHex = PluginConfig.get('fogBgColor');
    const fogBgOpacity = PluginConfig.get('fogBgOpacity');
    const visitedFogBgHex = PluginConfig.get('visitedFogColor');
    const visitedFogOpacity = PluginConfig.get('visitedFogOpacity');

    this.fogColor = Phaser.Display.Color.HexStringToColor(fogBgHex);
    this.fogColor.alpha = fogBgOpacity * BYTE_LENGTH;

    this.visitedFogColor = Phaser.Display.Color.HexStringToColor(visitedFogBgHex);
    this.visitedFogColor.alpha = visitedFogOpacity * BYTE_LENGTH;
  }

  onDisplayListAdd = gameObject => {
    const canClearFog = getCanClearFog(gameObject);
    this.drawValidGameObjects(true);
  };

  onDisplayListRemove = gameObject => {
    console.log('onDisplayListRemove', gameObject);
  };

  clearAll() {
    const { canvas, scene } = this;
    const { width, height } = scene.sys.game.canvas;
    const ctx = this.context;

    ctx.clearRect(0, 0, width, height);
  }

  drawBackground(refresh = false) {
    const { canvas, scene } = this;
    const { width, height } = scene.sys.game.canvas;
    const ctx = this.context;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.fogRGBA;
    ctx.fillRect(0, 0, width, height);

    if (refresh) {
      canvas.refresh();
    }
  }

  drawVisitedPositions(refresh = false) {
    const { canvas, tracker } = this;
    const ctx = this.context;
    const FIELD_OF_VIEW = 100; // @TODO - Tether as configurable

    ctx.globalCompositeOperation = 'destination-out';
    // For each tracked position
    forEach(tracker.positions, position => {
      ctx.globalCompositeOperation = 'destination-out';
      const rgr = ctx.createRadialGradient(position.x, position.y, 80, position.x, position.y, FIELD_OF_VIEW);
      rgr.addColorStop(0, 'rgba(0, 0, 0, 1)');
      rgr.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = this.getGradientByGameObject(position, position.viewDistance);
      ctx.arc(position.x, position.y, position.viewDistance, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Reset composite operations back to default
    ctx.globalCompositeOperation = 'source-over';
    if (refresh) {
      canvas.refresh();
    }
  }

  drawValidGameObjects(refresh = false) {
    const { canvas, scene } = this;
    const children = scene.children.getChildren();
    const ctx = this.context;

    ctx.globalCompositeOperation = 'destination-out';

    forEach(children, gameObject => {
      const canClearFog = getCanClearFog(gameObject);

      // If this isn't a gameObject that can 'Clear' fog, do nothing
      if (!canClearFog) {
        return;
      }

      const viewDistance = getViewDistanceByGameObject(gameObject);
      const position = this.getWorldPoint(gameObject);
      ctx.fillStyle = this.getGradientByGameObject(position, viewDistance);
      ctx.beginPath();
      ctx.arc(position.x, position.y, viewDistance, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Reset composite operations back to default
    ctx.globalCompositeOperation = 'source-over';
    if (refresh) {
      canvas.refresh();
    }
  }

  update = () => {
    const { canvas, scene } = this;
    const children = scene.children.getChildren();

    // @TODO - Make this more efficient or faster?
    const isNobodyMoving = !children.some(go => getCanClearFog(go) && !!go?.body?.velocity?.length());
    const isCameraStatic = !this.isCameraMoving;

    // If the camera hasn't moved, or nobody's moving, then don't waste time re-rendering
    if (isCameraStatic && isNobodyMoving) {
      return;
    }

    this.clearAll(); // First clear and redraw the fog filled
    this.drawBackground(); // Draw the fixed background
    // this.drawVisitedPositions(); // Draw the "visited" areas in lighter shade
    this.drawValidGameObjects(); // Draw each valid game-object that should see through the fog

    canvas.refresh();
  };
}
