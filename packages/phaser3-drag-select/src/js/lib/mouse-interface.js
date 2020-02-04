import PluginConfig, { MOUSE_BUTTONS } from './plugin-config';
import MouseCameraDrag from './mouse-camera-drag';

const PREVENT_DEFAULT = e => e.preventDefault();

export default class MouseInterface extends Phaser.GameObjects.Graphics {
  cameraDrag;
  isDisabled = false;
  isDragging = false;
  isMouseDown = false;

  start = new Phaser.Math.Vector2();
  end = new Phaser.Math.Vector2();
  rectangle = new Phaser.Geom.Rectangle();

  constructor(scene) {
    super(scene);

    scene.add.existing(this);
    this.enableInputEvents();
    this.cameraDrag = new MouseCameraDrag(this);
  }

  /**
   * @return InterfaceScene
   */
  get dragPlugin() {
    return this.scene.dragPlugin;
  }

  disable() {
    this.isDisabled = true;
    this.isDragging = false;
    this.isMouseDown = false;

    this.start.reset();
    this.end.reset();
    this.rectangle.setEmpty();
    this.clear();

    this.disableInputEvents();
    this.cameraDrag.disableInputEvents();

    this.dragPlugin.onPointerUp(this.rectangle, false, false);
  }

  enable() {
    this.isDisabled = false;

    this.enableInputEvents();
    this.cameraDrag.enableInputEvents();
  }

  getIsValidClickToTrack = button => {
    const mouseClickToTrack = PluginConfig.get('mouseClickToTrack');
    return button === mouseClickToTrack;
  };

  disableInputEvents() {
    const { scene } = this;

    scene.game.canvas.oncontextmenu = undefined;
    scene.input.off('pointerdown', this.onPointerDown);
    scene.input.off('pointerup', this.onPointerUp);
    scene.input.off('pointermove', this.onPointerMove);
    scene.input.off('gameover', this.onGameOver);
  }

  enableInputEvents() {
    const { scene } = this;

    this.enableRightClick();

    scene.input.on('pointerdown', this.onPointerDown);
    scene.input.on('pointerup', this.onPointerUp);
    scene.input.on('pointermove', this.onPointerMove);
    scene.input.on('gameover', this.onGameOver);
  }

  enableRightClick(enable = true) {
    const { scene } = this;
    if (enable) {
      scene.game.canvas.oncontextmenu = PREVENT_DEFAULT;
    } else {
      scene.game.canvas.oncontextmenu = undefined;
    }
  }

  onGameOver = (time, event) => {
    const isClickTypeToTrack = this.getIsValidClickToTrack(event.buttons);
    if (!isClickTypeToTrack) {
      this.cameraDrag.setIsDown(false);
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

  onPointerUp = ({ event }) => {
    const { rectangle } = this;
    const amendKey = PluginConfig.get('mouseAmendSelectWith');
    const toggleKey = PluginConfig.get('mouseToggleSelectWith');
    const isAmendActive = event[`${amendKey}Key`];
    const isToggleActive = event[`${toggleKey}Key`];

    this.isDragging = false;
    this.isMouseDown = false;
    if (this.cameraDrag.isDown) {
      return;
    }

    this.updateSelectionRectangle();
    this.dragPlugin.onPointerUp(rectangle, isAmendActive, isToggleActive);
  };

  onPointerMove = ({ buttons, event, worldX, worldY }) => {
    const isClickTypeToTrack = this.getIsValidClickToTrack(buttons);
    const amendKey = PluginConfig.get('mouseAmendSelectWith');
    const toggleKey = PluginConfig.get('mouseToggleSelectWith');
    const isAmendActive = event[`${amendKey}Key`];
    const isToggleActive = event[`${toggleKey}Key`];

    if (!this.isMouseDown || !isClickTypeToTrack) {
      return this;
    }

    this.isDragging = true;
    this.end.setTo(worldX, worldY);

    this.updateSelectionRectangle();
    this.dragPlugin.onPointerMove(this.rectangle, isAmendActive, isToggleActive);
  };

  updateSelectionRectangle() {
    const { end, rectangle, start } = this;
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

    rectangle.setTo(minX, minY, width, height);
  }

  preDestroy() {
    this.disableInputEvents();
  }

  destroy(fromScene) {
    super.destroy(fromScene);
    this.cameraDrag.destroy(fromScene);
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
