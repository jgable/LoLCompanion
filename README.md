# LoLCompanion

A React-Native app for looking up League of Legends info.

## Overview

- Uses FluxBone architecture;
    - Stores are Backbone Collections
    - Views dispatch actions
    - Views listen to Stores
- Backbone.sync with fetch() api

## Getting Started

Everything is still being developed actively, but if you'd like to get it running locally;

0. Due to a limitation with the packager, some npm modules like lodash aren't being bundled
   correctly.  To fix temporarily, comment out the `define.amd = {}` in `haste/polyfills/require.js`
0. Signup for a [Riot API Key](https://developer.riotgames.com/)
0. Copy the `config.example.js` to `config.js` and update your API key
0. Run bundler with `npm start`
0. Run app in XCode
0. Hit Ctrl-D to explore/debug the JavaScript

## License

Copyright Jacob Gable 2015, MIT License, see LICENSE file.
