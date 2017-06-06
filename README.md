## Audio Waveform SVG Path

[![npm version](https://badge.fury.io/js/audio-waveform-svg-path.svg)](https://badge.fury.io/js/audio-waveform-svg-path)

Building path for SVG element to perform waveform view of audio file

#### Inspired by:
https://robots.thoughtbot.com/javascript-audio-api

#### Demo:
https://antonkalinin.github.io/audio-waveform-svg-path/

## Installation

```bash
npm install --save audio-waveform-svg-path
```

## Usage
```js
import AudioSVGWaveform from 'audio-waveform-svg-path';

const trackWaveform = new AudioSVGWaveform({url: 'url of audio file'});

trackWaveform.loadFromUrl().then(() => {
    const path = trackWaveform.getPath();

    document.getElementById('my-path-element').setAttribute('d', path);
});

```

![](https://raw.githubusercontent.com/antonKalinin/audio-waveform-svg-path/master/static/waveform.png)


Constructor assepts object with one of keys:

```js
{
    url: 'url address of audio file',
    buffer: 'audio as AudioBuffer'
}
```

### Methods

- loadFromUrl - loads audio from url, returns Promise

- getPath(preprocessChannels) - returns a path of waveform, accepts callback function as only arument


#### Example of getPath with callback

```js
const diffPath = trackWaveform.getPath(
    /*
        Use preprocessChannels callback to modify final list of channels.
        This callback will be invocked as a argument of reduce method of channels array.
     */
    (channels, channel) => {
        const prevChannel = channels[0];
        const length = channel.length;
        const outputChannel = [];

        if (prevChannel) {
            for (let i = 0; i < length; i++) {
                // flip phase of right channel
                outputChannel[i] = (channel[i] - prevChannel[i]);
            }

            channels[0] = outputChannel;
        } else {
            channels.push(channel);
        }

        return channels;
    },
    []
);
```

## License

  [MIT](LICENSE)
