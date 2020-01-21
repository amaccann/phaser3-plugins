import { EVENT_MAP } from './constants';
import PluginConfig, { MOUSE_BUTTONS } from './plugin-config';

const PREVENT_DEFAULT = e => e.preventDefault();

export default class MouseInterface extends Phaser.GameObjects.Graphics {
  isDisabled = false;
  isDragging = false;
  isMouseDown = false;
  isCameraDragDown = false;

  start = new Phaser.Math.Vector2();
  end = new Phaser.Math.Vector2();

  constructor(scene) {
    super(scene);

    scene.add.existing(this);
    this.initialiseInputEvents();
    this.initialiseCameraDrag();
  }

  get isRightClickDisabled() {
    return !!this.scene.game.canvas.oncontextmenu;
  }

  getIsValidClickToTrack = button => {
    const mouseClickToTrack = PluginConfig.get('mouseClickToTrack');
    return button === mouseClickToTrack;
  };

  initialiseCameraDrag() {
    const { scene } = this;
    const isContextMenuEnabled = !this.isRightClickDisabled;
    const dragCameraBy = PluginConfig.get('dragCameraBy');
    const isRightClickToDrag = dragCameraBy === MOUSE_BUTTONS.RIGHT;

    // If the context menu is enabled && we set drag camera to "Right" click, ignore
    if (!dragCameraBy || (isRightClickToDrag && isContextMenuEnabled)) {
      return;
    }

    scene.input.on('pointerdown', this.onCameraDragPointerDown);
    scene.input.on('pointerup', this.onCameraDragPointerUp);
    scene.input.on('pointermove', this.onCameraDragPointerMove);
  }

  initialiseInputEvents() {
    const { scene } = this;

    this.enableRightClick();

    scene.input.on('pointerdown', this.onPointerDown);
    scene.input.on('pointerup', this.onPointerUp);
    scene.input.on('pointermove', this.onPointerMove);
    scene.input.on('gameover', this.onGameOver);
  }

  onCameraDragPointerDown = pointer => {
    this.isCameraDragDown = PluginConfig.get('dragCameraBy') === pointer.buttons;
  };

  onCameraDragPointerUp = () => {
    this.isCameraDragDown = false;
  };

  onCameraDragPointerMove = pointer => {
    if (!this.isCameraDragDown) {
      return;
    }

    const cam = PluginConfig.get('camera');

    // const ACCELERATION = 0.025;
    // const { x, y } = pointer.velocity;
    // cam.scrollX -= (x * ACCELERATION) / cam.zoom;
    // cam.scrollY -= (y * ACCELERATION) / cam.zoom;
    cam.scrollX -= (pointer.position.x - pointer.prevPosition.x) / cam.zoom;
    cam.scrollY -= (pointer.position.y - pointer.prevPosition.y) / cam.zoom;
  };

  onGameOver = (time, event) => {
    const isClickTypeToTrack = this.getIsValidClickToTrack(event.buttons);
    if (!isClickTypeToTrack) {
      this.isCameraDragDown = false;
      this.isDragging = false;
      this.isMouseDown = false;
    }
    this.end.setTo(event.x, event.y);
  };

  onPointerDown = pointer => {
    const isClickTypeToTrack = this.getIsValidClickToTrack(pointer.buttons);

    if (this.isDisabled || !isClickTypeToTrack) {
      return;
    }

    this.start.setTo(pointer.worldX, pointer.worldY);
    this.end.setTo(pointer.worldX, pointer.worldY);
    this.isMouseDown = true;
  };

  onPointerUp = pointer => {
    const { start, end } = this;

    this.isDragging = false;
    this.isMouseDown = false;
    if (this.isCameraDragDown) {
      return;
    }

    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;

    // Find the respective topLeft & bottomRight coordinates
    const minX = Math.min(startX, endX);
    const minY = Math.min(startY, endY);
    const maxX = Math.max(startX, endX);
    const maxY = Math.max(startY, endY);

    const width = maxX - minX;
    const height = maxY - minY;
    const rectangle = new Phaser.Geom.Rectangle(minX, minY, width, height);

    this.scene.sys.events.emit(EVENT_MAP.ON_MOUSE_UP, rectangle);
  };

  enableRightClick(enable = true) {
    const { scene } = this;
    if (enable) {
      scene.game.canvas.oncontextmenu = PREVENT_DEFAULT;
    } else {
      scene.game.canvas.oncontextmenu = undefined;
    }
  }

  onPointerMove = pointer => {
    const isClickTypeToTrack = this.getIsValidClickToTrack(pointer.buttons);

    if (!this.isMouseDown || !isClickTypeToTrack) {
      return this;
    }

    this.isDragging = true;
    this.end.setTo(pointer.worldX, pointer.worldY);
  };

  destroy(fromScene) {
    const { scene } = this;
    super.destroy(fromScene);

    scene.input.off('pointerdown', this.onCameraDragPointerDown);
    scene.input.off('pointerup', this.onCameraDragPointerUp);
    scene.input.off('pointermove', this.onCameraDragPointerMove);

    scene.input.off('pointerdown', this.onPointerDown);
    scene.input.off('pointerup', this.onPointerUp);
    scene.input.off('pointermove', this.onPointerMove);
    scene.input.off('gameover', this.onGameOver);
  }

  preUpdate() {
    const { start, end } = this;
    this.clear();
    if (!this.isMouseDown) {
      return;
    }

    const color = PluginConfig.get('rectBgColor');
    const alpha = PluginConfig.get('rectAlpha');
    const lineWidth = PluginConfig.get('outlineWidth');
    const lineColor = PluginConfig.get('outlineColor');

    this.lineStyle(lineWidth, lineColor, 1);
    this.fillStyle(color, alpha);
    this.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    this.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }
}
