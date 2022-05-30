import { Position } from "./Position";
import { GameObject } from "./GameObject";
import { TowerEventType, TowerStatus } from "../types";
import type { GameBoard } from "./GameBoard";
import type { Game } from "../Game";
import { TowerEvent } from "../events/StatusEvents";

/**
 * An individual tower
 */
export class Tower extends GameObject {
    private _game: Game;
    private _gameBoard: GameBoard;
    private _position: Position;
    private _range = 2;
    private _cellsInRange: Position[] = [];
    private _towerStatus = TowerStatus.building;
    private _elapsedTime = 0;
    private readonly _startingHealth = 100;
    private _health = this._startingHealth;
    private _attack = 10;
    private _timeSinceBuild = 0;
    private readonly _startingBuild = 10;
    private _buildCountdown = this._startingBuild;

    /**
     * Initialize a tower
     *
     * @param game - the game
     * @param gameBoard - the gameBoard
     * @param position - where the tower is
     */
    constructor(game: Game, gameBoard: GameBoard, position: Position) {
        super();
        this._game = game;
        this._gameBoard = gameBoard;
        this._position = position;

        // Determine which cells are in range:
        for (
            let i = this._position.x - this._range;
            i < this._position.x + this._range;
            i++
        ) {
            for (
                let j = this._position.y - this._range;
                j < this._position.y + this._range;
                j++
            ) {
                const tile = new Position(i, j);
                if (this._gameBoard.isValidPosition(tile)) {
                    this._cellsInRange.push(tile);
                }
            }
        }

        this._game.eventBus.raiseEvent(
            new TowerEvent(this, TowerEventType.placed)
        );
    }

    /**
     * The position of the tower
     */
    get position(): Position {
        return this._position;
    }

    /**
     * Tower's status
     */
    get towerStatus(): TowerStatus {
        return this._towerStatus;
    }

    /**
     * Get health of tower
     */
    get health(): number {
        return this._health;
    }

    /**
     * Get health of tower, represented as percent of starting health
     */
    get healthAsPercent(): number {
        return this._health / this._startingHealth;
    }

    /**
     * Get build progress as percent
     */
    get buildProgress(): number {
        return 0 - this._buildCountdown / this._startingBuild;
    }

    /**
     * On frame change
     *
     * @param delta seconds passed
     */
    update(delta: number) {
        this._elapsedTime += delta;

        if (this._towerStatus === TowerStatus.building) {
            this._timeSinceBuild += delta;
            if (this._buildCountdown === 0) {
                this._towerStatus = TowerStatus.active;

                this._game.eventBus.raiseEvent(
                    new TowerEvent(this, TowerEventType.finishedBuilding)
                );
                return;
            }
            if (this._timeSinceBuild < -1000) {
                this._timeSinceBuild = 0;
                if (this._game.pointManager.deduct(10)) {
                    this._buildCountdown--;
                }
            }

            // If the tower is building, or just finished building,
            // it should wait another frame before trying to do things,
            // like fire on enemies.
            return;
        }

        // Get a list of enemies present on the range of cells

        // If there are any, pick the first enemy, and fire an event
    }
}
