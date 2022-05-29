import { ObserverMovedEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import { Position } from "./Position";

/**
 * An observer can observe the game.
 * Most of the time, this will be the player's perspective.
 */
export class Observer {
    private readonly _game: Game;
    private _position: Position;

    /**
     * Create an observer object.
     *
     * @param game - the game that this observer is watching
     * @param startingX - the starting X position of the observer
     * @param startingY - the starting Y position of the observer
     */
    constructor(game: Game, startingX = 0, startingY = 0) {
        this._game = game;
        this._position = new Position(startingX, startingY);
    }

    /**
     * Build a tower at the current location
     */
    buildTower(): void {
        this._game.gameBoard.buildTower(this._position);
        // Raise event.
        this._game.eventBus.raiseEvent(
            new ObserverMovedEvent(this, this._position, this._position)
        );
    }

    /**
     * Move right one position if possible.
     */
    moveRight(): void {
        this._moveIfValidPosition(
            new Position(this._position.x + 1, this._position.y)
        );
    }

    /**
     * Move left one position if possible.
     */
    moveLeft(): void {
        this._moveIfValidPosition(
            new Position(this._position.x - 1, this._position.y)
        );
    }

    /**
     * Move up one position if possible.
     */
    moveUp(): void {
        this._moveIfValidPosition(
            new Position(this._position.x, this._position.y + 1)
        );
    }

    /**
     * Move down one position if possible.
     */
    moveDown(): void {
        this._moveIfValidPosition(
            new Position(this._position.x, this._position.y - 1)
        );
    }

    /**
     * Move to the new position if possible.
     *
     * @param p - the new position to move to
     */
    _moveIfValidPosition(p: Position): void {
        if (this._game.gameBoard.isValidPosition(p)) {
            const oldPosition = this._position;
            this._position = p;
            // Raise event.
            this._game.eventBus.raiseEvent(
                new ObserverMovedEvent(this, oldPosition, p)
            );
        }
    }

    /**
     * Player character's position
     */
    get position(): Position {
        return this._position;
    }
}
