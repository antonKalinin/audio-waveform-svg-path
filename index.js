import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AudioSVGWaveform from '../index.js';

import 'babel-polyfill';

const defaultURLs = [
    'https://s52f.storage.yandex.net/get-mp3/12e248bb94f696448861687c384d7cd9/000551377deab34a/music/46/4/data-0.2:9209747592:6268759',
    'https://s08h.storage.yandex.net/get-mp3/a794df344510bef03d9514d2c277d21c/000551396b9dcd48/music/21/5/data-0.2:29365386376:6426748',
    'https://s42e.storage.yandex.net/get-mp3/953bb8c5338b7456da6ee1d6c37cc8db/0005513ae557b11a/music/23/3/data-0.2:11728522362:6611068',
];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioUrl: '',
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

    _handleFormSubmit(event) {
        event.preventDefault();

        this.loadAudioFromUrl(this.urlInput.value);
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
                <form className="url-form" onSubmit={(event) => this._handleFormSubmit(event)}>
                    <input
                        className="url-form__input"
                        type="text"
                        value={audioUrl}
                        placeholder="Audio URL"
                        onChange={event => { this.setState({audioUrl: event.target.value}); }}
                        ref={component => { this.urlInput = component; }}
                    />
                    <button className="url-form__button">
                        Load
                    </button>
                </form>

                <audio
                    className="player"
                    ref={component => { this.player = component; }}
                    src={fullPath && diffPath ? audioUrl : undefined}
                    autoPlay
                    controls
                >
                    You browser doesn't support <code>audio</code> element.
                </audio>
                

                <div className="waveforms">
                    {this._renderSVGWaveform([fullPath, diffPath])}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
