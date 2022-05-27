import {
    ObserverMovedEvent,
    UIStatusSoundEvent
} from "../../events/StatusEvents";
import type { Game } from "../../Game";
import { Position } from "../../models/Position";
import { audioCodeOptions } from "../../types";

/**
 * Determines what sound files are appropriate based on game events
 */
export class AudioRenderer {
    private _game: Game;
    private static speed = 200;

    /**
     * Construct a AudioRenderer object.
     *
     * @param game - the game to render
     */
    constructor(game: Game) {
        this._game = game;
    }

    /**
     * Start listening for events.
     */
    startListening(): void {
        this._game.eventBus.addEventHandler(ObserverMovedEvent, (event) =>
            this._handleObserverMovedEvents(event)
        );
    }

    /**
     * React to movement with an appropriate sound
     *
     * @param event - The move event
     */
    private _handleObserverMovedEvents(event: ObserverMovedEvent): void {
        const isOpenLeft = this._game.gameBoard.isValidPosition(
            new Position(event.newPosition.x - 1, event.newPosition.y)
        );
        const isOpenUp = this._game.gameBoard.isValidPosition(
            new Position(event.newPosition.x, event.newPosition.y + 1)
        );
        const isOpenRight = this._game.gameBoard.isValidPosition(
            new Position(event.newPosition.x + 1, event.newPosition.y)
        );
        const isOpenDown = this._game.gameBoard.isValidPosition(
            new Position(event.newPosition.x, event.newPosition.y - 1)
        );

        // For testing purposes, play the same sound whenever any movement happens

        // Play sound to the left (if open)
        if (isOpenLeft) {
            this._game.eventBus.raiseEvent(
                new UIStatusSoundEvent(audioCodeOptions.WIND, -0.9)
            );
        }

        // After a beat, play sound up (if open)
        if (isOpenDown)
            setTimeout(() => {
                this._game.eventBus.raiseEvent(
                    new UIStatusSoundEvent(audioCodeOptions.WIND, 0, -1)
                );
            }, AudioRenderer.speed);

        // After a bat, play sound to the right (if open)
        if (isOpenRight)
            setTimeout(() => {
                this._game.eventBus.raiseEvent(
                    new UIStatusSoundEvent(audioCodeOptions.WIND, 0.9)
                );
            }, AudioRenderer.speed * 2);

        // After a beat, play sound down (if open)
        if (isOpenUp)
            setTimeout(() => {
                this._game.eventBus.raiseEvent(
                    new UIStatusSoundEvent(audioCodeOptions.WIND, 0, 1)
                );
            }, AudioRenderer.speed * 3);
    }
}
