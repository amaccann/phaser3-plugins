### Phaser 3 Drag Select Plugin

### How to install:

Add it to your project as a normal dependency:

```
yarn add @pixelburp/phaser3-drag-select
```

### How to use:

This operates as a global plugin in your Phaser Game, then loading it into your main gameplay scene. First you must define the new global plugin in your game's global config:

```
import DragSelectPlugin from '@pixelburp/phaser3-drag-select';
// ... any other imports for your project...

const config = {
    ...
    plugins: {
        global: [
            { key: 'DragSelectPlugin', plugin: DragSelectPlugin }
        ]
    },
    ...
```

Then, in the `create()` function / method of your main gameplay `Scene` (ie, the scene containing all the `GameObject`s you wish to be selectable), you set up the Plugin like so:

```
create() {
    this.dragSelect = this.plugins.start('DragSelectPlugin', 'dragSelect');

    this.dragSelect.setup(<MyScene>, {
        camera: <MainGameSceneCamera>,
        cameraEdgeAcceleration: 0.015,
        cameraEdgeBuffer: 50,
        childSelector: <Function>,
        dragCameraBy: 2,        // right-button
        mouseClickToTrack: 1,   // left-button
        mouseAmendSelectWith: 'shift',
        mouseToggleSelectWith: 'ctrl',
        outlineColor: 0x00ff00,
        outlineWidth: 2,
        onPreview: <Function>,
        onSelect: <Function>,
        rectBgColor: 0x33ff33,
        rectAlpha: 0.5,
        singleClickThreshold: 20,
    });
}

```

### Setup Configuration

In the `setup()` method of the plugin, we pass in a configuration object. The possible values are

`camera`

> What is the main "Gameplay" camera being used in this scene?

`cameraEdgeAcceleration` (default: `0.009`)

> The acceleration value to use when, during drag-selection, the mouse reaches the edge of the viewport / screen.

`cameraEdgeBuffer` (default: `50`)

> How close to the edge of the viewport / screen the cursor should be (during drag selection) before panning the camera

`childSelector` (default: return "interactive" children)

> If you want, you can supply a custom function to determine what will count as a "selectable" `GameObject`. By default it checks for `GameObject`s that have `input.enabled`

`dragCameraBy` (default: `2`)

> The mouse button that controls how to pan the camera around. Default is `2`, right-click. Set to `false` to disable altogether

`mouseClickToTrack` (default: `1`)

> The mouse button to track click-drag actions. Defaults to `1`, the left-click.

`mouseAmendSelectWith` (default: `shift`. Possible values: `alt|ctrl|shift`)

> Allow ability to amend your selection if this key is held down. Defaults to `Shift` key.

`mouseToggleSelectWith` (default: `ctrl`. Possible values: `alt|ctrl|shift`)

> Allows ability to group select, if this key is held down. Defaults to `Ctrl` key.

`outlineColor` (default: `0x00ff00`)

> The color to use on the outline of the selection rectangle during dragging

`outlineWidth` (default: `2`)

> The width of the selection outline during dragging

`onPreview` (default: `noop`)

> During dragging, this function callback returns any `GameObject`s already overlapping selection rectangle. Callback's arguments:

```
{
    items: [],
    isAmendActive: false|true,
    isSingleClick: false|true,
    isToggleSelect: false|true
}
```

`onSelect` (default: `noop`)

> On `mouseUp` after a drag event, this function callback returns any `GameObject`s that returned true for `childSelector`. Callback's arguments:

```
{
    items: [],
    isAmendActive: false|true,
    isSingleClick: false|true,
    isToggleSelect: false|true
}
```

`rectBgColor` (default: `0x33ff33`)

> The background color to use on the selection rectangle during dragging

`rectAlpha` (default: `0.5`)

> The background alpha value to use on the selection rectangle during dragging

`singleClickThreshold` (default: `20`)

> The area of the selection rectangle that, on `mouseUp`, will still count as a "single click". Defaults to `20`

## Functions

## setup(scene, config)

**Kind**: global function

| Param  | Type                      | Description                                       |
| ------ | ------------------------- | ------------------------------------------------- |
| scene  | <code>Phaser.Scene</code> | Target scene to attach the plugin's logic against |
| config | <code>Object</code>       | Configuration object to pass to plugin            |

<a name="isEnabled"></a>

## isEnabled() ⇒ <code>Boolean</code>

Returns the current "enabled" status of the Plugin's "interface" scene

**Kind**: global function  
<a name="setConfig"></a>

## setConfig(config)

Updates the plugin's configuration with new values

**Kind**: global function

| Param  | Type                | Description              |
| ------ | ------------------- | ------------------------ |
| config | <code>Object</code> | new configuration object |

<a name="disable"></a>

## disable()

If enabled, disable the plugin

**Kind**: global function  
<a name="enable"></a>

## enable()

If not already enabled, enable the plugin

**Kind**: global function
