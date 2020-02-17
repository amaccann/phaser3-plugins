// 0: No button or un-initialized
// 1: Left button
// 2: Right button
// 4: Wheel button or middle button
// 8: 4th button (typically the "Browser Back" button)
// 16: 5th button (typically the "Browser Forward" button)
export const MOUSE_BUTTONS = {
  NO_BUTTON: 0,
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4,
  FOURTH_BUTTON: 8,
  FIFTH_BUTTON: 16,
};

export const MOUSE_BUTTONS_VALUES = Object.values(MOUSE_BUTTONS);
