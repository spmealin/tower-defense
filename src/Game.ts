import { EventBus } from "./events/EventBus";
import { GameBoard } from "./models/GameBoard";
import type { Position } from "./models/Position";
import { Tower } from "./models/Tower";

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
     * Get the event bus for this game.
     *
     * @readonly
     */
    get eventBus(): EventBus {
        return this._eventBus;
    }

    /**
     * Do any necessary loading.
     *
     * @param board - 2D array of codes, representing aspects of the board
     */
    initialize(board: string[][]): void {
        this._gameBoard.loadTerrainMap(board);
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

    /**
     * Build a tower
     *
     * @param position location of tower
     */
    buildTower(position: Position): void {
        const tower = new Tower(this, position);
        this._gameBoard.addTowerToMap(tower);
    }
}
