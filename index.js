import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AudioSVGWaveform from '../index.js';

import 'babel-polyfill';

const defaultURLs = [
    'https://s52f.storage.yandex.net/get-mp3/12e248bb94f696448861687c384d7cd9/000551377deab34a/music/46/4/data-0.2:9209747592:6268759',
    'https://s74e.storage.yandex.net/get-mp3/b84642664978be649eab9461b4e5eb6e/0005513888ea22bd/music/1/6/data-0.2:3773227631:6331453',
];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioUrl: defaultURLs[1],
            audioProgress: 0,
            fullPath: '',
            diffPath: '',
        };
    }

    componentDidMount() {
        if (this.state.audioUrl) {
            this.loadAudioFromUrl(this.state.audioUrl);
        }

        this.player.addEventListener('timeupdate', () => {
            const currentTime = this.player.currentTime;
            const duration = this.player.duration;

            this.setState({audioProgress: ((currentTime / duration) * 100).toPrecision(4)});
        });
    }

    loadAudioFromUrl(url) {
        if (!url) {
            return;
        }

        const trackWaveform = new AudioSVGWaveform({url});

        trackWaveform.loadFromUrl().then(() => {
            const fullPath = trackWaveform.getPath();
            /*
            const leftPath = trackWaveform.getPath(
                (channels, channel, index) => channels.concat(index === 0 ? channel : []),
                []
            );
            const rightPath = trackWaveform.getPath(
                (channels, channel, index) => channels.concat(index === 1 ? channel : []),
                []
            );
            */
            const diffPath = trackWaveform.getPath(
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

            this.setState({audioUrl: url, fullPath, diffPath});
        });
    }

    _renderSVGWaveform(paths) {
        const {audioProgress} = this.state;

        return (
            <div className="audio-graph">
                {paths.filter(Boolean).map((path, index) => (
                    <svg
                        className={`waveform waveform_${index}`}
                        viewBox="0 -1 6000 2"
                        preserveAspectRatio="none"
                    >
                        <g>
                            <path className={`waveform__path waveform__path_${index}`} d={path} />
                        </g>
                    </svg>
                ))}
                <div className="audio-progress" style={{width: `${audioProgress}%`}}></div>
            </div>
        );
    }

    render() {
        const {audioUrl, fullPath, diffPath} = this.state;

        return (
            <div className="container">
                <div className="url-form">
                    <input
                        className="url-form__input"
                        type="text"
                        value={audioUrl}
                        placeholder="Audio URL"
                        ref={component => { this.urlInput = component; }}
                    />
                    <button
                        className="url-form__button"
                        onClick={() => this.loadAudioFromUrl(this.urlInput.value)}
                    >
                        Load
                    </button>
                </div>

                {audioUrl &&
                    <audio
                        className="player"
                        ref={component => { this.player = component; }}
                        src={audioUrl}
                        autoPlay
                        controls
                    >
                        You browser does't support <code>audio</code> element.
                    </audio>
                }

                <div className="waveforms">
                    {this._renderSVGWaveform([fullPath, diffPath])}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.body);
