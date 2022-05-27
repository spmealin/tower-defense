import { audioCodeOptions } from "../types";

const boundNumber = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
};

const ADJUSTMENT_COVARIATE = 1200; // 1200 detunes a value by an octave

/**
 * Defining the map of audio codes to audio buffers
 */
type audioBufferLibraryType = {
    [key in audioCodeOptions]?: AudioBuffer;
};

/**
 * Defining the map of audio codes to audio files
 */
type audioCodeToFileMapType = {
    [key in audioCodeOptions]: string;
};

const audioCodeToFileMap: audioCodeToFileMapType = {
    [audioCodeOptions.WIND]: "/sounds/wind.mp3"
};

/**
 * lorem ipsum
 */
export class AudioPlayer {
    private static audioContext: AudioContext;
    private audioBufferLibrary: audioBufferLibraryType = {};

    /**
     * Load all available audio files
     */
    public init() {
        AudioPlayer.audioContext = new window.AudioContext();

        window
            .fetch(audioCodeToFileMap[audioCodeOptions.WIND])
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) =>
                AudioPlayer.audioContext.decodeAudioData(arrayBuffer)
            )
            .then((audioBuffer) => {
                this.audioBufferLibrary[audioCodeOptions.WIND] = audioBuffer;
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }

    /**
     * Speak the provided text.
     *
     * @param audioCode - which audio to play
     * @param [pan] - where to pan the audio
     * @param [adjustment] - octave adjustment
     */
    public render(audioCode: audioCodeOptions, pan = 0, adjustment = 0): void {
        const panNode = AudioPlayer.audioContext.createPanner();
        panNode.connect(AudioPlayer.audioContext.destination);
        panNode.positionX.value = boundNumber(pan, -1, 1);

        const source = AudioPlayer.audioContext.createBufferSource();
        source.buffer = this.audioBufferLibrary[audioCode] ?? null;
        source.detune.value = ADJUSTMENT_COVARIATE * adjustment;
        source.connect(panNode);
        source.start();
    }
}
