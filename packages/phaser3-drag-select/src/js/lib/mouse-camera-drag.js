import PluginConfig, { MOUSE_BUTTONS } from './plugin-config';
import Phaser from 'phaser';

const EMPTY_VALUES = [undefined, null];

export default class MouseCameraDrag extends Phaser.GameObjects.Graphics {
  isCameraDragDown = false;
  isWithinHotZone = false;
  mouseInterface;
  rectangle = new Phaser.Geom.Rectangle();
  scaleManager;

  constructor(mouseInterface) {
    super(mouseInterface.scene);
    mouseInterface.scene.add.existing(this);

    this.mouseInterface = mouseInterface;
    this.scaleManager = mouseInterface.scene.scaleManager;
    this.initialiseCameraDrag();
    this.renderRectangle();
  }

  get screenDimensions() {
    if (this.isFullScreen) {
      return {
        width: window?.screen.availWidth,
        height: window?.screen.availHeight,
      };
    }
    return this.scene?.game?.config;
  }

  get isDown() {
    return this.isCameraDragDown;
  }

  get isFullScreen() {
    return this.scene.scale.isFullscreen;
  }

  get isRightClickDisabled() {
    return !!this.scene.game.canvas.oncontextmenu;
  }

  initialiseCameraDrag() {
    const { scene } = this;
    const isContextMenuEnabled = !this.isRightClickDisabled;
    const dragCameraBy = PluginConfig.get('dragCameraBy');
    const isRightClickToDrag = dragCameraBy === MOUSE_BUTTONS.RIGHT;

    // If the context menu is enabled && we set drag camera to "Right" click, ignore
    if (!dragCameraBy || (isRightClickToDrag && isContextMenuEnabled)) {
      return;
    }

    scene.scale.on('enterfullscreen', this.onToggleFullScreen, this);
    scene.scale.on('leavefullscreen', this.onToggleFullScreen, this);

    scene.input.on('pointerdown', this.onCameraDragPointerDown);
    scene.input.on('pointerup', this.onCameraDragPointerUp);
    scene.input.on('pointermove', this.onCameraDragPointerMove);
  }

  onCameraDragPointerDown = pointer => {
    console.warn('onCameraDragPointerDown', pointer.buttons);
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

  onToggleFullScreen = () => {
    this.renderRectangle();
    console.warn('FullScreen Toggled');
  };

  setIsDown(isCameraDragDown) {
    this.isCameraDragDown = !!isCameraDragDown;
  }

  renderRectangle() {
    const { width, height } = this.screenDimensions;
    const cameraEdgeBuffer = PluginConfig.get('cameraEdgeBuffer');
    if (EMPTY_VALUES.includes(cameraEdgeBuffer)) {
      return this.clear();
    }

    const offsetWidth = width - cameraEdgeBuffer * 2;
    const offsetHeight = height - cameraEdgeBuffer * 2;
    this.clear();
    this.fillStyle(0xffffff, 0.5);
    this.fillRect(cameraEdgeBuffer, cameraEdgeBuffer, offsetWidth, offsetHeight);
    this.rectangle.setTo(cameraEdgeBuffer, cameraEdgeBuffer, offsetWidth, offsetHeight);
  }

  scrollMainCamera() {
    const { mouseInterface } = this;
    const endPointer = mouseInterface.end;
    const startPointer = mouseInterface.start;

    const interfaceRectangle = mouseInterface.rectangle;
    const area = Phaser.Geom.Rectangle.Area(interfaceRectangle);
    const cameraEdgeBuffer = PluginConfig.get('cameraEdgeBuffer');

    // Only move the camera if rectangles area is less than the area of the buffer;
    if (area <= cameraEdgeBuffer * 2) {
      return;
    }

    const cam = PluginConfig.get('camera');
    const acceleration = PluginConfig.get('cameraEdgeAcceleration');
    const velocityX = endPointer.x - startPointer.x;
    const velocityY = endPointer.y - startPointer.y;
    cam.scrollX += (velocityX * acceleration) / cam.zoom;
    cam.scrollY += (velocityY * acceleration) / cam.zoom;
  }

  preDestroy() {
    const { scene } = this;
    console.log('preDestroy');
    scene.scale.off('enterfullscreen', this.onToggleFullScreen, this);
    scene.scale.off('leavefullscreen', this.onToggleFullScreen, this);

    scene.input.off('pointerdown', this.onCameraDragPointerDown);
    scene.input.off('pointerup', this.onCameraDragPointerUp);
    scene.input.off('pointermove', this.onCameraDragPointerMove);
  }

  destroy(fromScene) {
    super.destroy(fromScene);
  }

  preUpdate() {
    const { isCameraDragDown, mouseInterface, rectangle } = this;
    const acceleration = PluginConfig.get('cameraEdgeAcceleration');

    if (!acceleration || isCameraDragDown || !mouseInterface.isDragging) {
      return;
    }

    const endPointer = mouseInterface.end;
    this.isWithinHotZone = !rectangle.contains(endPointer.x, endPointer.y);

    if (this.isWithinHotZone) {
      this.scrollMainCamera();
    }
  }
}
