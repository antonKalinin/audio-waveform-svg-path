## Audio Waveform SVG Path

[![npm version](https://badge.fury.io/js/audio-waveform-svg-path.svg)](https://badge.fury.io/js/audio-waveform-svg-path)

Building path for SVG element to perform waveform view of audio file

#### Inspired by:
https://robots.thoughtbot.com/javascript-audio-api

## Installation

```bash
npm install --save audio-waveform-svg-path
```

## Usage
```js

const trackWaveform = new AudioSVGWaveform({url: 'url of audio file'});

trackWaveform.loadFromUrl().then(() => {
    const path = trackWaveform.getPath();

    document.getElementById('my-path-element').setAttribute('d', path);
});

```

## License

  [MIT](LICENSE)

