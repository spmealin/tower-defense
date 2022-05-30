import {
    ObserverMovedEvent,
    UIStatusErrorMessage
} from "../events/StatusEvents";
import type { Game } from "../Game";
import { Position } from "./Position";
import { Tower } from "./Tower";
import { ErrorMessage } from "../events/ErrorMessages";

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
        this._game.gameBoard.buildTower(this._game, this._position);
        // Raise event.
        this._game.eventBus.raiseEvent(
            new ObserverMovedEvent(this, this._position, this._position)
        );
    }

    /**
     * Jump to next tower in the list
     */
    jumpToTower(): void {
        const gameObjects = this._game.gameBoard.children;
        const towers: Tower[] = [];

        // I wanted to use array filter but Typescript didn't trust it
        gameObjects.forEach((obj) => {
            if (obj instanceof Tower) {
                towers.push(obj);
            }
        });

        if (towers.length === 0) {
            this._game.eventBus.raiseEvent(
                new UIStatusErrorMessage(ErrorMessage.NO_TOWERS_FOR_JUMPING)
            );
            return;
        }

        // Am I on a tower?
        const currentTowerIndex = towers.findIndex((obj) =>
            this._position.equals?.(obj.position)
        );

        // If you're not focused on a tower, move to the first one in the list
        // If you're focused on the last tower, move to the first one in the list
        if (
            currentTowerIndex === -1 ||
            currentTowerIndex === towers.length - 1
        ) {
            this._moveIfValidPosition(towers[0].position);
            return;
        }

        this._moveIfValidPosition(towers[currentTowerIndex + 1].position);
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
     * Restate current status
     */
    refresh(): void {
        this._moveIfValidPosition(this._position);
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
