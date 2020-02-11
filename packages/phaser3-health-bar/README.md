## Phaser 3 Heath Bar Plugin

## How to install:

Add it to your project as a normal dependency:

```
yarn add @pixelburp/phaser3-health-bar
```

## How to use:

This operates as a global plugin in your Phaser Game, then loading it into your main gameplay scene. First you must define the new global plugin in your game's global config:

```
import HealthBarPlugin from '../js/health-bar-plugin';
// ... any other imports for your project...

const config = {
    ...
    plugins: {
        global: [
    global: [{ key: 'HealthBarPlugin', plugin: HealthBarPlugin }],
        ]
    },
    ...
```

Then, in the `create()` function / method of your main gameplay `Scene` (ie, the scene containing all the `GameObject`s you wish to be selectable), you set up the Plugin like so:

```
create() {
    this.healthBarPlugin = this.plugins.start('HealthBarPlugin', 'healthBarPlugin');
    this.healthBarPlugin.setup(
      {
        camera: this.cameras.main,
        offsetY: 10,
        scene: this,
        childSelector: (child) => {
          // Function that controls what Objects within the scene can have a health-bar
          // If this function isn't specified, by default the plugin assumes any Phaser.GameObject.Sprite
        },
        visibleOnSelector: child => {
          // Function to control how and when the health-bar should appear for this child `GameObject`
          // If not specified, by default it shows above any Object with input.enabled === true
        },
      },
      [
        {
          barHeight: 15,
          backgroundColor: 0x0000ff,
          outlineColor: 0xffffff,
          camera: this.cameras.main,
          outlineWidth: 2,
          currentValueColor: 0x00ff00,
          propsToWatch: {
            current: 'health',
            max: 'maxHealth',
            min: 'minHealth',
          },
        },
        // You can create multiple health-bars that'll stack above the Sprite / GameObject
      ]
    );
}

```

## Setup Configuration

In the `setup()` method of the plugin, we pass in a global configuration object, and Array of desired Health Bars.

### Global configuration:

These are the 'global' values that are used across the plugin

`camera`

> What is the main "Gameplay" camera being used in this scene?

`childSelector` (default: `Function`)

> Function to calculate what Objects in the scene can accept Health Bars

`offsetX` (default: `0`)

> Optional X offset to position the HealthBars

`offsetY` (default: `15`)

> Optional Y offset to position the HealthBars

`scene` (required)

> Required param of the target `Phaser.Scene` where we're drawing the target Game Objects to have assigned health-bars

`visibleOnSelector` (default: `Function`)

> Function calculate how and when a healthbar is displayed above the target Object. Function should return `true|false` depending on conditions you wish to use (eg, display on `activePointer` hover)

### Health Bar configuration:

You can assigned as many health-bars as you wish, which is useful in cases where you might have (for example), a health bar, but also shields, mana, stamina, that sort of thing. The array takes a sequence of objects, whose properties are

`backgroundColor` (default: `0x000000`)

> The backdrop to use for this health-bar. Note you can also supply an Array of tints (as seen with `Sprite.setTint()`)

`barHeight` (default: `15`)

> The height for this particular health-bar

`currentValueColor` (default: `0x33ff33`)

> The color to use for the current value of the health-bar. Note you can also supply an Array of tints (as seen with `Sprite.setTint()`)

`propsToWatch` (default: `Object`)

> What properties should we watch on the target Object? Note, that if the values are within child objects, you can specify using dot notation (eg, `current: 'shields.value'`) The default properties are:

```
{
  current: 'health',
  max: 'maxHealth',
  min: 'minHealth',
}
```

## Functions

## setup(globalConfig, config)

**Kind**: global function

| Param        | Type                | Description                                      |
| ------------ | ------------------- | ------------------------------------------------ |
| globalConfig | <code>Object</code> | Global configuration for the plugin              |
| config       | <code>Array</code>  | Configuration array of the health-bars to create |

<a name="isEnabled"></a>

## isEnabled() ⇒ <code>Boolean</code>

Returns the current "enabled" status of the Plugin's "interface" scene

**Kind**: global function
<a name="disable"></a>

## disable()

If enabled, disable the plugin

**Kind**: global function
<a name="enable"></a>

## enable()

If not already enabled, enable the plugin

**Kind**: global function
<a name="setConfig"></a>
