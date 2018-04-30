# Hyper Fading Scrollbar

![Screen capture of the fading scrollbar Hyper plugin](https://file-uvyxnepufu.now.sh)

A hyper plugin that fades the scrollbar when not in use.

## Installation

```sh
hyper i hyper-fading-scrollbar
```

_You may want to make sure that your color theme package comes first in the `config.plugins` array in `.hyper.js`, so that the right color is applied to the scrollbar (it is inherited from the `borderColor` setting by default)._

## Options

You can customize the scrollbar color by using the `scrollbarColor` setting in your `.hyper.js` config:

```js
module.exports = {
  config: {
    // ...

    scrollbarColor: 'tomato',
  }
}
```
