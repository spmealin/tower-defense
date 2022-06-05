import { HardCodedPath } from "./ai/HardCodedPath";
import { EventBus } from "./events/EventBus";
import { Enemy } from "./models/Enemy";
import { GameBoard } from "./models/GameBoard";
import { GameObject } from "./models/GameObject";
import { Position } from "./models/Position";

const ENEMY_SPAWN_RATE = 10000; // Spawn a new enemy every 10s

/**
 * The main game.
 */
export class Game extends GameObject {
    private readonly _gameBoard;
    private readonly _eventBus;
    private _elapsedGameTime = 0;
    private _lastEnemySpawn = 0;

    /**
     * Create a game object.
     */
    constructor() {
        super();
        this._eventBus = new EventBus();
        this._gameBoard = new GameBoard(this);
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
     * Do any necessary loading.
     *
     * @param board - 2D array of codes, representing aspects of the board
     */
    initialize(board: string[][]): void {
        this._gameBoard.initializeBoard?.(board);
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
        this._lastEnemySpawn += delta;
        this._eventBus.dispatchEvents();
        if (this._lastEnemySpawn >= ENEMY_SPAWN_RATE) {
            this._lastEnemySpawn = 0;
            const enemy = new Enemy(
                this._gameBoard,
                this._eventBus,
                new Position(25, 0),
                new HardCodedPath()
            );
            this._gameBoard.addEnemy?.(enemy);
        }
        super.update(delta);
    };
}
