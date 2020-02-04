### Phaser 3 Drag Select Plugin

### Config settings

In your game config:

```
import DragSelectPlugin from 'path-to';

const config = {
    ...
    plugins: {
        global: [
            { key: 'DragSelectPlugin', plugin: DragSelectPlugin }
        ]
    },
    ...
```

```
this.dragSelect = this.plugins.start('DragSelectPlugin', 'dragSelect');
this.dragSelect.setup(this, {
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
});
```

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
