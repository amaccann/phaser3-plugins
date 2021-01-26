# phaser-navmesh-generation

### Warning: this plugin is still heavy Work in Progress (WIP). It's possibly not stable enough for use in a production product - use at your own risk (for now!)

This Phaser plugin generates Navigation Meshes from supplied `Phaser.TilemapLayer` data and collison indices thereof. Contains configuration options

#### Current version: `0.2.2`

### Getting Started:

#### ES6 / Node

import it as you would any other project:

```
import NavMeshPlugin from 'phaser-navmesh-generation';
```

#### Legacy

If you're doing it the old fashioned way, simply add `<script>` tag after your main Phaser tag:

```
<script src="my/path/to/phaser.js"></script>
<script src="my/path/to/navmesh-plugin.js"></script>
```

Then in your game's JS code:

```
  preload() {
    var plugin = this.game.plugins.add(NavMeshPlugin);
  }

```

#### Usage:

1. First, we need to generate a new navigation mesh using the following method (options are below)

```
var navMesh = plugin.buildFromTileLayer({
  collisionIndices: [1, 2, 3],
  midPointThreshold: 0,
  useMidPoint: false,
  scene: Phaser.Scene,
  tileMap: <Phaser.Tilemaps.Tilemap>,
  tileLayer: <Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer>,
  debug: {
    hulls: false,
    navMesh: false,
    navMeshNodes: false,
    polygonBounds: false,
    aStarPath: false
  }
});
```

2. Then, to find a path between two `Phaser.Point` instances, call:

```
navMesh.getPath(position, destination, offset);
```

### navMeshPlugin.buildFromTileLayer()

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)

| Param                        | Type                                      | Default            | Description                                                                                                               |
| ---------------------------- | ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| options.tileMap              | <code>Phaser.Tilemaps.Tilemap</code>      |                    |                                                                                                                           |
| options.tileLayer            | <code>Phaser.Tilemaps.TilemapLayer</code> |                    |                                                                                                                           |
| options.scene                | <code>Phaser.Scene</code>                 |                    |                                                                                                                           |
| options.collisionIndices     | <code>Array.&lt;Number&gt;</code>         |                    | an Array of collision indices that your tilemap uses for collisions                                                       |
| [options.midPointThreshold]  | <code>Number</code>                       | <code>0</code>     | a Number value telling how narrow a navmesh triangle needs to be before it's ignored during pathing                       |
| [options.timingInfo]         | <code>Boolean</code>                      | <code>false</code> | Show in the console how long it took to build the NavMesh - and search for paths                                          |
| [options.useMidPoint]        | <code>Boolean</code>                      | <code>true</code>  | a Boolean value on whether to include all triangle edge mid-points in calculating triangulation                           |
| [options.offsetHullsBy]      | <code>Number</code>                       | <code>0.1</code>   | a Number value to offset (expand) each hull cluster by. Useful to use a small value to prevent excessively parallel edges |
| options.debug                | <code>Object</code>                       |                    | various optional debug options to Render the stages of NavMesh calculation:                                               |
| options.debug.hulls:         | <code>Boolean</code>                      |                    | Every (recursive) 'chunk' of impassable tiles found on the tilemap                                                        |
| options.debug.navMesh:       | <code>Boolean</code>                      |                    | Draw all the actual triangles generated for this navmesh                                                                  |
| options.debug.navMeshNodes:  | <code>Boolean</code>                      |                    | Draw all connections found between neighbouring triangles                                                                 |
| options.debug.polygonBounds: | <code>Boolean</code>                      |                    | Draw the bonding radius between each navmesh triangle                                                                     |
| options.debug.aStarPath:     | <code>Boolean</code>                      |                    | Draw the aStar path found between points (WIP debug, will remove later)                                                   |

<a name="NavMeshPlugin+getClosestPolygon"></a>

### navMeshPlugin.getClosestPolygon(position, [includeOutOfBounds])

Finds the closest NavMesh polygon, based on world point

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)

| Param                | Type                                                               | Default            | Description                                 |
| -------------------- | ------------------------------------------------------------------ | ------------------ | ------------------------------------------- |
| position             | <code>Phaser.Geom.Point</code> \| <code>Phaser.Math.Vector2</code> |                    | The world point                             |
| [includeOutOfBounds] | <code>Boolean</code>                                               | <code>false</code> | whether to include "out of bounds" searches |

<a name="NavMeshPlugin+getPath"></a>

### navMeshPlugin.getPath(position, position, offset)

Finds Calculate the shortest path to a given destination

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)

| Param    | Type                                                               | Description                                                |
| -------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| position | <code>Phaser.Geom.Point</code> \| <code>Phaser.Math.Vector2</code> | startPosition                                              |
| position | <code>Phaser.Geom.Point</code> \| <code>Phaser.Math.Vector2</code> | endPosition                                                |
| offset   | <code>Number</code>                                                | An offset value to keep a distance (optional, default `0`) |

<a name="NavMeshPlugin+getAllTilesWithin"></a>

### navMeshPlugin.getAllTilesWithin(worldX, worldY, spriteWidth, spriteHeight) ⇒

Given world coords & "sprite" size, find all overlapping Tiles in the tileLayer

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)  
**Returns**: Array

| Param        | Type                | Description                                      |
| ------------ | ------------------- | ------------------------------------------------ |
| worldX       | <code>Number</code> | World X coordinate                               |
| worldY       | <code>Number</code> | World Y coordinate                               |
| spriteWidth  | <code>Number</code> | width (in pixels) of the Sprite you wish to add  |
| spriteHeight | <code>Number</code> | height (in pixels) of the Sprite you wish to add |

<a name="NavMeshPlugin+addSprite"></a>

### navMeshPlugin.addSprite(worldX, worldY, spriteWidth, spriteHeight)

Adds a "sprite" (like an immovable prop), that navmesh should include in its calculations.

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)

| Param        | Type                | Description                                      |
| ------------ | ------------------- | ------------------------------------------------ |
| worldX       | <code>Number</code> | World X coordinate                               |
| worldY       | <code>Number</code> | World Y coordinate                               |
| spriteWidth  | <code>Number</code> | width (in pixels) of the Sprite you wish to add  |
| spriteHeight | <code>Number</code> | height (in pixels) of the Sprite you wish to add |

<a name="NavMeshPlugin+removeSprite"></a>

### navMeshPlugin.removeSprite(worldX, worldY, spriteWidth, spriteHeight)

Find any previously cached "sprites" within these bounds, and reset to the original value

**Kind**: instance method of [<code>NavMeshPlugin</code>](#NavMeshPlugin)

| Param        | Type                | Description                                         |
| ------------ | ------------------- | --------------------------------------------------- |
| worldX       | <code>Number</code> | World X coordinate                                  |
| worldY       | <code>Number</code> | World Y coordinate                                  |
| spriteWidth  | <code>Number</code> | width (in pixels) of the Sprite you wish to remove  |
| spriteHeight | <code>Number</code> | height (in pixels) of the Sprite you wish to remove |
