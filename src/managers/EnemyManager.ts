import { HardCodedPath } from "../ai/HardCodedPath";
import { HandlerPriority } from "../events/EventBus";
import { EnemyEvent, GameBoardInitializedEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import { Enemy } from "../models/Enemy";
import type { Position } from "../models/Position";
import { EnemyEventType } from "../types";

/**
 * Manages adding/removing enemies from the game board.
 */
export class EnemyManager {
    private readonly _game: Game;
    private _enemyDestroyedCount = 0;
    private _spawnPoints: Position[] | null = null;

    /**
     * Create a EnemyManager.
     *
     * @param game - the game
     */
    constructor(game: Game) {
        this._game = game;
        game.eventBus.addEventHandler(
            GameBoardInitializedEvent,
            this._handleGameBoardInitializedEvent,
            HandlerPriority.high
        );
        game.eventBus.addEventHandler(
            EnemyEvent,
            this._handleEnemyEvent,
            HandlerPriority.high
        );
    }

    /**
     * The number of enemies destroyed during the game.
     *
     * @readonly
     */
    get enemyDestroyedCount(): number {
        return this._enemyDestroyedCount;
    }

    /**
     * Add a basic enemy to the map.
     * The enemy will start at one of the map's spawn points.
     */
    addBasicEnemy = () => {
        if (!this._spawnPoints) {
            throw new Error(
                "Did you forget to initialize the game board before calling this?"
            );
        }
        // Randomly select a spawn point for the new enemy.
        const spawnPosition =
            this._spawnPoints[
                Math.floor(Math.random() * this._spawnPoints.length)
            ];
        const enemy = new Enemy(
            this._game.gameBoard,
            this._game.eventBus,
            spawnPosition,
            new HardCodedPath()
        );
        this._game.gameBoard.addGameObjectToMap(enemy, spawnPosition);
    };

    /**
     * Handle GameBoardInitialized events.
     *
     * @param event - the event
     */
    private _handleGameBoardInitializedEvent = (
        event: GameBoardInitializedEvent
    ) => {
        this._spawnPoints = event.gameboard.enemySpawnPoints;
    };

    /**
     * Handel enemy events.
     *
     * @param event - the event
     */
    private _handleEnemyEvent = (event: EnemyEvent) => {
        if (event.type === EnemyEventType.died) {
            this._game.gameBoard.clearPosition(event.enemy.position);
            this._game.gameBoard.destroyChild(event.enemy);
            this._enemyDestroyedCount++;
        }
    };
}
