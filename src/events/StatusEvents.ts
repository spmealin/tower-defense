import type { Enemy } from "../models/Enemy";
import type { GameObject } from "../models/GameObject";
import type { Observer } from "../models/Observer";
import type { Position } from "../models/Position";
import type { Tower } from "../models/Tower";
import type {
    audioCodeOptions,
    EnemyEventType,
    TowerEventType
} from "../types";
import type { ErrorMessage } from "./ErrorMessages";

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
 * Event called by a tower
 */
export class TowerEvent {
    readonly tower: Tower;
    readonly type: TowerEventType;

    /**
     * Create a new TowerEvent event.
     *
     * @param origin - originating tower
     * @param type - type of event
     */
    constructor(origin: Tower, type: TowerEventType) {
        this.tower = origin;
        this.type = type;
    }
}

/**
 * Attack event, called by an enemy or a tower
 */
export class AttackEvent {
    readonly origin: Tower | Enemy;
    readonly target: Tower | Enemy;
    readonly attackPoints: number;

    /**
     * Create a new AttackEvent
     *
     * @param origin - who fired
     * @param target - who is being fired on
     * @param attackPoints - the attack power
     */
    constructor(
        origin: Tower | Enemy,
        target: Enemy | Tower,
        attackPoints: number
    ) {
        this.origin = origin;
        this.target = target;
        this.attackPoints = attackPoints;
    }
}

/**
 * Event called by an enemy
 */
export class EnemyEvent {
    readonly enemy: Enemy;
    readonly type: EnemyEventType;

    /**
     * Create a new EnemyEvent
     *
     * @param enemy - relevant enemy
     * @param type - event type
     */
    constructor(enemy: Enemy, type: EnemyEventType) {
        this.enemy = enemy;
        this.type = type;
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
 * Status message for errros
 */
export class UIStatusErrorMessage {
    private readonly _type: ErrorMessage;

    /**
     * Generate the error type
     *
     * @param type - the type of error
     */
    constructor(type: ErrorMessage) {
        this._type = type;
    }

    /**
     * A message for this error
     *
     * @readonly
     */
    get message(): string {
        return "No towers to jump to";
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

/**
 * An event for when a game object moves on the game board.
 */
export class GameObjectMovedEvent {
    readonly gameObject: GameObject;
    readonly oldPosition: Position;
    readonly newPosition: Position;

    /**
     * Create a new GameObjectMovedEvent event.
     *
     * @param object - the game object that moved
     * @param oldPosition - where the game object moved from
     * @param newPosition - where the game object moved to
     */
    constructor(
        object: GameObject,
        oldPosition: Position,
        newPosition: Position
    ) {
        this.gameObject = object;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
}
