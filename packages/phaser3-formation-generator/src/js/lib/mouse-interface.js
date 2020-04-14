import Phaser from 'phaser';
import { forEach, MOUSE_BUTTONS, sortClockwise } from '@pixelburp/phaser3-utils';
import PluginConfig from './plugin-config';
import Tile from './tile';

const PREVENT_DEFAULT = e => e.preventDefault();
const DEFAULT_GRID_CONFIG = {
  maxCols: 0,
  minCols: 0,
};
const NINETY_DEGREES_AS_RADIANS = Math.PI / 2;
const TEST_RADIUS = 16;
const TEST_COLOR = 0xff00ff;

const FLOOD_DIRECTIONS = {
  NORTH: [0, -1],
  // NORTH_WEST: [-1, -1],
  // NORTH_EAST: [1, -1],
  SOUTH: [0, 1],
  // SOUTH_WEST: [-1, 1],
  // SOUTH_EAST: [1, 1],
  WEST: [-1, 0],
  EAST: [1, 0],
};

function flood_fill(pos_x, pos_y, target_color, color) {
  // if there is no wall or if i haven't been there, already go back
  if (a[pos_x][pos_y] == wall || a[pos_x][pos_y] == color) {
    return;
  }

  if (a[pos_x][pos_y] != target_color)
    // if it's not color go back
    return;

  a[pos_x][pos_y] = color; // mark the point so that I know if I passed through it.

  flood_fill(pos_x + 1, pos_y, color); // then i can either go south
  flood_fill(pos_x - 1, pos_y, color); // or north
  flood_fill(pos_x, pos_y + 1, color); // or east
  flood_fill(pos_x, pos_y - 1, color); // or west

  return;
}

export default class MouseInterface extends Phaser.GameObjects.Graphics {
  isDisabled = false;
  isDragging = false;
  isMouseDown = false;

  start = new Tile();
  end = new Tile();
  gridConfig = DEFAULT_GRID_CONFIG;
  targetChildren = [];
  previews = [];

  constructor(scene) {
    super(scene);

    scene.add.existing(this);
    this.enableAllEvents();
  }

  get targetScene() {
    return PluginConfig.get('scene');
  }

  getIsValidClickToTrack = button => {
    const mouseClickToTrack = PluginConfig.get('mouseClickToTrack');
    return button === mouseClickToTrack;
  };

  disable() {
    this.isDisabled = true;
    this.isDragging = false;
    this.isMouseDown = false;

    this.start.reset();
    this.end.reset();
    this.clear();

    this.disableAllEvents();
  }

  enable() {
    this.isDisabled = false;
    this.disableAllEvents();
    this.enableAllEvents();
  }

  disableAllEvents() {
    const { scene } = this;
    this.enableRightClick(false);

    scene.input.off('pointerup', this.onPointerUp);
    scene.input.off('pointermove', this.onPointerMove);
    scene.input.off('gameout', this.onGameOut);
  }

  enableAllEvents() {
    const { scene } = this;
    const mouseClickToTrack = PluginConfig.get('mouseClickToTrack');
    this.enableRightClick(mouseClickToTrack === MOUSE_BUTTONS.RIGHT);
    this.scene.input.on('gameout', this.onGameOut);
    scene.input.on('pointerdown', this.onPointerUp);
  }

  enableRightClick(enable = true) {
    const { game } = this.scene;
    if (enable) {
      game.canvas.oncontextmenu = PREVENT_DEFAULT;
    } else {
      game.canvas.oncontextmenu = undefined;
    }
  }

  calculate(sprites, config) {
    const { isDisabled, scene } = this;
    const { activePointer } = scene.input;
    const isClickTypeToTrack = this.getIsValidClickToTrack(activePointer.buttons);

    if (isDisabled || !isClickTypeToTrack) {
      return;
    }

    this.start.setTo(activePointer.worldX, activePointer.worldY);
    this.end.setTo(activePointer.worldX, activePointer.worldY);
    this.isMouseDown = true;
    this.gridConfig = config;
    this.targetChildren = sprites;

    this.generateFormations();
    this.renderThing();

    scene.input.on('pointermove', this.onPointerMove);
    scene.input.on('pointerup', this.onPointerUp);
  }

  onPointerUp = () => {
    const { scene } = this;
    this.isDragging = false;
    this.isMouseDown = false;
    this.gridConfig = DEFAULT_GRID_CONFIG;
    this.targetChildren = [];

    this.start.reset();
    this.end.reset();

    this.clear();

    scene.input.off('pointerup', this.onPointerUp);
    scene.input.off('pointermove', this.onPointerMove);
  };

  onPointerMove = ({ buttons, worldX, worldY }) => {
    const { tileX, tileY } = this.end;
    const isClickTypeToTrack = this.getIsValidClickToTrack(buttons);
    if (!this.isMouseDown || !isClickTypeToTrack) {
      return this;
    }

    this.isDragging = true;
    this.end.setTo(worldX, worldY);

    const isTileChanged = tileX !== this.end.tileX || tileY !== this.end.tileY;
    if (isTileChanged) {
      this.generateFormations();
      this.renderThing();
    }
  };

  onGameOut = pointer => {
    // If the cursor leaves the viewport ?
    this.onPointerUp();
  };

  /**
   * Calculate the desired combo:
   *  1. Sort the target children by clockwise order
   *  2. Calculate the position from the end[X|Y] for each child, relative to the transposed centroid
   *  3. Calculate possible shapes based on the maxCols and minCols value
   *  4. Profit!
   * Some reading:
   *  1. https://www.reddit.com/r/gamedev/comments/5ypqnb/dynamic_unit_array_depth_change_in_total_war/
   *  2. https://www.gamasutra.com/view/feature/131721/implementing_coordinated_movement.php
   */
  generateFormations() {
    const { end, gridConfig, previews, start, targetChildren } = this;
    const { maxCols, minCols } = gridConfig;
    const gridSize = PluginConfig.get('gridSize');
    const centroid = Phaser.Geom.Point.GetCentroid(targetChildren);
    const sorted = sortClockwise(targetChildren, centroid);

    const line = new Phaser.Geom.Line(start.centerX, start.centerY, end.centerX, end.centerY);

    const midpoint = Phaser.Geom.Line.GetMidPoint(line);
    const rotated = Phaser.Geom.Line.RotateAroundPoint(line, midpoint, NINETY_DEGREES_AS_RADIANS);
    console.log('midpoint', midpoint);
    console.log('line', line);
    console.log('rotated', rotated);
    this.blah = rotated;

    forEach(targetChildren, child => {
      const angle1 = Phaser.Math.Angle.BetweenPoints(child, centroid);
      const angle2 = Phaser.Math.Angle.BetweenPoints(centroid, child);
      const distance = Phaser.Math.Distance.BetweenPoints(centroid, child);
      console.log('angle1', angle1);
      console.log('angle2', angle2);
      console.log('distance', distance);
    });

    return;

    // flood fill from midpoint...

    /*
    const floodFill = (x, y, currentChildren = []) => {
      console.group(`children left: ${currentChildren.length}`);
      console.log('x', x, 'y', y);
      if (!currentChildren.length) {
        return;
      }

      currentChildren.pop();
      // child.x = currentPosition.x;
      // child.y = currentPosition.y;
      this.previews.push({ x, y });

      Object.keys(FLOOD_DIRECTIONS).forEach((key) => {
        currentChildren.pop();

        console.group(key);
        const [offsetX, offsetY] = FLOOD_DIRECTIONS[key];
        // const newPosition = currentPosition.copy().add(x, y);
        const newX = x + (offsetX * gridSize);
        const newY = y + (offsetY * gridSize);
        this.previews.push({ x: newX, y: newY });

        console.log('newX', newX, 'newY', newY);
        console.groupEnd();
        // floodFill(newX, newY, currentChildren);
      });
      Object.keys(FLOOD_DIRECTIONS).forEach((key) => {
        const [offsetX, offsetY] = FLOOD_DIRECTIONS[key];
        // const newPosition = currentPosition.copy().add(x, y);
        const newX = x + (offsetX * gridSize);
        const newY = y + (offsetY * gridSize);
        floodFill(newX, newY, currentChildren);
      });
        // floodFill(x, y - gridSize, currentChildren);
      // floodFill(x, y + gridSize, currentChildren);
      console.groupEnd();
    };

    this.previews = [];
    // floodFill(midpoint.x, midpoint.y, [ ...targetChildren ]);
*/
  }

  renderThing() {
    const { end, previews, start } = this;
    const gridSize = PluginConfig.get('gridSize');
    console.log('previews', previews);

    this.clear();
    this.lineStyle(3, 0x00ff00);

    this.strokeLineShape({ x1: start.centerX, y1: start.centerY, x2: end.centerX, y2: end.centerY });
    this.strokeLineShape(this.blah);

    this.fillStyle(TEST_COLOR, 1);
    this.fillCircle(end.centerX, end.centerY, TEST_RADIUS);
    this.strokeCircle(end.centerX, end.centerY, TEST_RADIUS);

    previews.forEach(preview => {
      this.fillStyle(TEST_COLOR, 1);
      this.fillRect(preview.x, preview.y, gridSize, gridSize);
    });
  }
}
