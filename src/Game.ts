import { EventBus } from "./events/EventBus";
import { GameBoard } from "./models/GameBoard";

/**
 * The main game.
 */
export class Game {
    private readonly _gameBoard;
    private readonly _eventBus;
    private _elapsedGameTime = 0;

    /**
     * Create a game object.
     */
    constructor() {
        this._gameBoard = new GameBoard();
        this._eventBus = new EventBus();
    }

    /**
     *Get the game board associated with this game.
     *
     * @readonly
     */
    get gameBoard(): GameBoard {
        return this._gameBoard;
    }

    /**
     * Get the vent bus for this game.
     *
     * @readonly
     */
    get eventBus(): EventBus {
        return this._eventBus;
    }

    /**
     * Do any necessary loading.
     */
    initialize(): void {
        // Do something at some point.
    }

    /**
     * Update the game.
     * This will be called once each frame. Use the delta parameter to make sure that updates stay stable across all
     * framerates.
     *
     * @param delta - the time in milliseconds since the last frame
     */
    update(delta: number): void {
        this._elapsedGameTime += delta;
        this._eventBus.dispatchEvents();
    }
}
