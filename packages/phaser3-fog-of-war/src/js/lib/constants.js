export const DEBUG_PREVIEW_COLOR = 0x00ff00;
export const DEBUG_SELECTION_COLOR = 0xff00ff;
export const IMAGE_DEPTH = 9999;
export const BYTE_LENGTH = 255;
export const VIEW_DISTANCE_BUFFER = 10;

export const toArrayFromObject = point => [point.x, point.y];
export const toObjectFromArray = point => ({ x: point[0], y: point[1] });
