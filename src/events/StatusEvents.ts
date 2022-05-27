import type { Observer } from "../models/Observer";
import type { Position } from "../models/Position";

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
     *The status message.
     *
     * @readonly
     */
    get message(): string {
        return this._message;
    }
}
