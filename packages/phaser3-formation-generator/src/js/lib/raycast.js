/*
this.rayStepRate = 4;

Phaser.TilemapLayer.prototype.getRayCastTiles = function (line, stepRate, collides, interestingFace) {

  if (!stepRate) { stepRate = this.rayStepRate; }
  if (collides === undefined) { collides = false; }
  if (interestingFace === undefined) { interestingFace = false; }

  //  First get all tiles that touch the bounds of the line
  var tiles = this.getTiles(line.x, line.y, line.width, line.height, collides, interestingFace);

  if (tiles.length === 0)
  {
    return [];
  }

  //  Now we only want the tiles that intersect with the points on this line
  // @TODO - Use Phaser.Geom.Line.BresenhamPoints
  var coords = line.coordinatesOnLine(stepRate);
  var results = [];

  for (var i = 0; i < tiles.length; i++)
  {
    for (var t = 0; t < coords.length; t++)
    {
      var tile = tiles[i];
      var coord = coords[t];
      if (tile.containsPoint(coord[0], coord[1]))
      {
        results.push(tile);
        break;
      }
    }
  }

  return results;

};
*/

class RayCast {
  rayStepRate = 4;

  getRayCastTiles(line, tileLayer, { collides = false, interestingFaces = false, stepRate = 8 } = {}) {
    const width = Phaser.Geom.Line.Width(line);
    const height = Phaser.Geom.Line.Height(line);
    const tiles = tileLayer.getTilesWithinWorldXY(line.x1, line.y1, width, height, { isNotEmpty: false });

    if (!tiles.length) {
      return [];
    }

    //  Now we only want the tiles that intersect with the points on this line
    // @TODO - Use Phaser.Geom.Line.BresenhamPoints
    // const coords = line.coordinatesOnLine(stepRate);
    const coords = Phaser.Geom.Line.BresenhamPoints(line, stepRate);
    const results = [];

    for (var i = 0; i < tiles.length; i++) {
      for (var t = 0; t < coords.length; t++) {
        const tile = tiles[i];
        const coord = coords[t];
        if (tile.containsPoint(coord[0], coord[1])) {
          results.push(tile);
          break;
        }
      }
    }

    return results;
  }
}

export default new RayCast();
