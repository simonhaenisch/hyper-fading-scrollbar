# Hyper Fading Scrollbar

[![NPM version](https://img.shields.io/npm/v/hyper-fading-scrollbar.svg)](https://www.npmjs.com/hyper-fading-scrollbar) [![NPM download count](https://img.shields.io/npm/dm/hyper-fading-scrollbar.svg)](https://www.npmjs.com/hyper-fading-scrollbar)

<img src="https://file-ewlrgwalzv.now.sh/kapture.gif" alt="Screen capture of the fading scrollbar Hyper plugin" width="480">

A hyper plugin that fades the scrollbar when not in use.

## Installation

```sh
hyper i hyper-fading-scrollbar
```

_You may want to make sure that your color theme package comes first in the `config.plugins` array in `.hyper.js`, so that the right color is applied to the scrollbar (it is inherited from the `borderColor` setting by default)._

## Options

You can customize the scrollbar color by using the `scrollbarColor` and `scrollbarOpacity` settings in your `.hyper.js` config:

```js
module.exports = {
  config: {
    // ...

    scrollbarColor: 'tomato', // any valid css color
    scrollbarOpacity: 0.1, // value between 0 and 1
  }
}
```

## Compatibility

This plugin has been updated to work with Hyper v3. To use it with v2, please use version 1.1.4 of this plugin.
