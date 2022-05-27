import type { Observer } from "../models/Observer";
import type { Position } from "../models/Position";
import type { audioCodeOptions } from "../types";

/**
 * An event for when an Observer moves.
 */
export class ObserverMovedEvent {
    readonly observer: Observer;
    readonly oldPosition: Position;
    readonly newPosition: Position;

    /**
     * Create a new ObserverMovedEvent event.
     *
     * @param observer  - the observer that moved
     * @param oldPosition - where the observer moved from
     * @param newPosition - where the observer moved to
     */
    constructor(
        observer: Observer,
        oldPosition: Position,
        newPosition: Position
    ) {
        this.observer = observer;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
}

/**
 * An event that holds a status message.
 * Status messages are typically spoken by screen readers and displayed somewhere on screen.
 */
export class UIStatusMessageEvent {
    private readonly _message: string;

    /**
     * Get the status message for this event.
     *
     * @param message - the status message
     */
    constructor(message: string) {
        this._message = message;
    }

    /**
     * The status message.
     *
     * @readonly
     */
    get message(): string {
        return this._message;
    }
}

/**
 * An event that holds metadata for a sound event, which is played by an audio player
 */
export class UIStatusSoundEvent {
    private readonly _audioCode: audioCodeOptions;
    // -1 = far left, 1 = far right, 0 = center
    private readonly _pan: number;
    private readonly _adjustment: 0 | 1 | -1;

    /**
     * Get the audio details for this event
     *
     * @param audio_code - which audio file to play
     * @param pan - where to pan the audio file
     * @param [adjustment] - octave adjustment
     */
    constructor(
        audio_code: audioCodeOptions,
        pan: number,
        adjustment: 0 | 1 | -1 = 0
    ) {
        this._audioCode = audio_code;
        this._pan = pan;
        this._adjustment = adjustment;
    }

    /**
     * The audio file
     *
     * @readonly
     */
    get audioCode(): audioCodeOptions {
        return this._audioCode;
    }

    /**
     * The audio's pan value
     * - -1 = far left
     * - 0 = center
     * - -1 = far right
     *
     * @readonly
     */
    get pan(): number {
        return this._pan;
    }

    /**
     * The number of octaves the sound should be adjusted
     *
     * Default: 0
     */
    get adjustment(): number {
        return this._adjustment;
    }
}
