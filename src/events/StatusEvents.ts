import type { Enemy } from "../models/Enemy";
import type { GameBoard } from "../models/GameBoard";
import type { GameObject } from "../models/GameObject";
import type { HomebaseStatus } from "../models/Homebase";
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
export class AttackEvent<T> {
    readonly origin: T;
    readonly target: T;
    readonly attackPoints: number;

    /**
     * Create a new AttackEvent
     *
     * @param origin - who fired
     * @param target - who is being fired on
     * @param attackPoints - the attack power
     */
    constructor(origin: T, target: T, attackPoints: number) {
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

/**
 * An event for when a game object is added to the game board.
 */
export class GameObjectAddedEvent {
    readonly gameObject: GameObject;
    readonly position: Position;

    /**
     * Create a new GameObjectAddedEvent event.
     *
     * @param object - the new game object
     * @param position - the position of the object
     */
    constructor(object: GameObject, position: Position) {
        this.gameObject = object;
        this.position = position;
    }
}

/**
 * An event for when a game object is removed from the game board.
 */
export class GameObjectRemovedEvent {
    readonly gameObject: GameObject;
    readonly position: Position;

    /**
     * Create a new GameObjectRemovedEvent event.
     *
     * @param object - the game object being removed
     * @param position - the last position of the object
     */
    constructor(object: GameObject, position: Position) {
        this.gameObject = object;
        this.position = position;
    }
}

/**
 * An event to communicate a change in homebase.
 */
export class HomebaseEvent {
    public readonly status: HomebaseStatus;

    /**
     * Create a HomebaseEvent.
     *
     * @param status - the status of the homebase
     */
    constructor(status: HomebaseStatus) {
        this.status = status;
    }
}

/**
 * An event to indicate the game board has been initialized.
 */
export class GameBoardInitializedEvent {
    public readonly gameboard: GameBoard;

    /**
     * Create a new GameBoardInitialized event.
     *
     * @param gameboard - the gameboard that has been initialized
     */
    constructor(gameboard: GameBoard) {
        this.gameboard = gameboard;
    }
}
