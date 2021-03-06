import { EventBus } from "./events/EventBus";
import { HomebaseEvent } from "./events/StatusEvents";
import { BuildingManager } from "./managers/BuildingManager";
import { EnemyManager } from "./managers/EnemyManager";
import { GameBoard } from "./models/GameBoard";
import { GameObject } from "./models/GameObject";
import { HomebaseStatus } from "./models/Homebase";

const ENEMY_SPAWN_RATE = 10000; // Spawn a new enemy every 10s

/**
 * The statuses that the game can be in.
 */
export enum GameStatus {
    uninitialized,
    running,
    completed
}

/**
 * The main game.
 */
export class Game extends GameObject {
    private readonly _gameBoard;
    private readonly _eventBus;
    private _elapsedGameTime = 0;
    private _lastEnemySpawn = 0;
    private _status = GameStatus.uninitialized;
    private readonly _buildingManager: BuildingManager;
    private readonly _enemyManager: EnemyManager;

    /**
     * Create a game object.
     */
    constructor() {
        super();
        this._eventBus = new EventBus();
        this._gameBoard = new GameBoard(this);
        this._buildingManager = new BuildingManager(this);
        this._enemyManager = new EnemyManager(this);
        this._children.push(this._gameBoard);
        this._eventBus.addEventHandler(
            HomebaseEvent,
            this._handleHomebaseEvent
        );
    }

    /**
     * The status of the game.
     *
     * @readonly
     */
    get status(): GameStatus {
        return this._status;
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
     * The building manager for this game.
     *
     * @readonly
     */
    get buildingManager(): BuildingManager {
        return this._buildingManager;
    }

    /**
     * The enemy manager associated with this game.
     *
     * @readonly
     */
    get enemyManager(): EnemyManager {
        return this._enemyManager;
    }

    /**
     * Do any necessary loading.
     *
     * @param board - 2D array of codes, representing aspects of the board
     */
    initialize(board: string[][]): void {
        this._gameBoard.initializeBoard?.(board);
        this._status = GameStatus.running;
    }

    /**
     * Update the game.
     * This will be called once each frame. Use the delta parameter to make sure that updates stay stable across all
     * framerates.
     *
     * @param delta - the time in milliseconds since the last frame
     */
    update = (delta: number) => {
        if (this._status === GameStatus.completed) {
            // No point in updating if we're done here.
            return;
        }
        this._elapsedGameTime += delta;
        this._lastEnemySpawn += delta;
        if (this._lastEnemySpawn >= ENEMY_SPAWN_RATE) {
            this._lastEnemySpawn = 0;
            this._enemyManager.addBasicEnemy();
        }
        this._eventBus.dispatchEvents();
        super.update(delta);
    };

    /**
     * Handle events from home base.
     *
     * @param event - the event
     */
    private _handleHomebaseEvent = (event: HomebaseEvent) => {
        if (event.status === HomebaseStatus.destroied) {
            this._status = GameStatus.completed;
        }
    };
}
