import { EventBus } from "./events/EventBus";
import { GameBoard } from "./models/GameBoard";
import { GameObject } from "./models/GameObject";
import { PointManager } from "./models/PointManager";

/**
 * The main game.
 */
export class Game extends GameObject {
    private readonly _gameBoard;
    private readonly _eventBus;
    private readonly _pointManager;
    private _elapsedGameTime = 0;

    /**
     * Create a game object.
     */
    constructor() {
        super();
        this._gameBoard = new GameBoard();
        this._eventBus = new EventBus();
        this._pointManager = new PointManager(this, 100);
        this._children.push(this._gameBoard);
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
     * Get the point manager for this game
     *
     * @readonly
     */
    get pointManager(): PointManager {
        return this.pointManager;
    }

    /**
     * Do any necessary loading.
     *
     * @param board - 2D array of codes, representing aspects of the board
     */
    initialize(board: string[][]): void {
        this._gameBoard.loadTerrainMap?.(board);
    }

    /**
     * Update the game.
     * This will be called once each frame. Use the delta parameter to make sure that updates stay stable across all
     * framerates.
     *
     * @param delta - the time in milliseconds since the last frame
     */
    update = (delta: number) => {
        this._elapsedGameTime += delta;
        this._eventBus.dispatchEvents();
        super.update(delta);
    };
}
