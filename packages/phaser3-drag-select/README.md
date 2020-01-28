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
