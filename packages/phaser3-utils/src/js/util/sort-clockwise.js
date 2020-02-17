/**
 * Sorts an array of points in a clockwise direction, relative to a reference point.
 *
 * The sort is clockwise relative to the display, starting from a 12 o'clock position.
 * (In the Cartesian plane, it is anticlockwise, starting from the -y direction.)
 *
 * Example sequence: (0, -1), (1, 0), (0, 1), (-1, 0)
 *
 * @method Phaser.Point#sortClockwise
 * @static
 * @param {array} points - An array of Points or point-like objects (e.g., sprites).
 * @param {object|Phaser.Point} [center] - The reference point. If omitted, the {@link #centroid} (midpoint) of the points is used.
 * @return {array} The sorted array.
 */
export default function sortClockwise(points, center) {
  // Adapted from <https://stackoverflow.com/a/6989383/822138> (ciamej)
  let cx = center.x;
  let cy = center.y;

  const sort = (a, b) => {
    if (a.x - cx >= 0 && b.x - cx < 0) {
      return -1;
    }

    if (a.x - cx < 0 && b.x - cx >= 0) {
      return 1;
    }

    if (a.x - cx === 0 && b.x - cx === 0) {
      if (a.y - cy >= 0 || b.y - cy >= 0)
      {
        return (a.y > b.y) ? 1 : -1;
      }

      return (b.y > a.y) ? 1 : -1;
    }

    // Compute the cross product of vectors (center -> a) * (center -> b)
    const det = (a.x - cx) * -(b.y - cy) - (b.x - cx) * -(a.y - cy);

    if (det < 0) {
      return -1;
    }

    if (det > 0) {
      return 1;
    }

    // Points a and b are on the same line from the center. Check which point is closer to the center
    const d1 = (a.x - cx) * (a.x - cx) + (a.y - cy) * (a.y - cy);
    const d2 = (b.x - cx) * (b.x - cx) + (b.y - cy) * (b.y - cy);

    return (d1 > d2) ? -1 : 1;
  };

  return points.sort(sort);
};
