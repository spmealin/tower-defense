import type { HardCodedPath } from "../ai/HardCodedPath";
import type { EventBus } from "../events/EventBus";
import { AttackEvent, EnemyEvent } from "../events/StatusEvents";
import { EnemyEventType } from "../types";
import type { GameBoard } from "./GameBoard";
import { GameObject } from "./GameObject";
import type { Position } from "./Position";
import { Tower } from "./Tower";

/** How long it takes for an enemy to cross a position in milliseconds */
const SPEED = 3000;

/**
 * A simple enemy.
 */
export class Enemy extends GameObject {
    private readonly _gameBoard: GameBoard;
    private readonly _path: HardCodedPath;
    private readonly _eventBus: EventBus;
    private _position: Position;
    private _timeSinceLastMovement = SPEED;
    private _health = 100;
    private _attack = 15;

    /**
     * Create an enemy.
     *
     * @param gameBoard - the game board that this enemy is on
     * @param eventBus - the event bus to publish events
     * @param position - the starting position of the enemy
     * @param path - the path that the enemy should follow
     */
    constructor(
        gameBoard: GameBoard,
        eventBus: EventBus,
        position: Position,
        path: HardCodedPath
    ) {
        super();
        this._gameBoard = gameBoard;
        this._eventBus = eventBus;
        this._path = path;
        this._position = position;
    }

    /**
     *Get the position of this enemy.
     *
     * @readonly
     */
    get position(): Position {
        return this._position;
    }

    /**
     * Current health of enemy
     *
     * @readonly
     */
    get health(): number {
        return this._health;
    }

    /**
     * Get hit
     *
     * @param attackPoints - points the enemy was attacked with
     */
    getHit(attackPoints: number): void {
        this._health -= attackPoints;
        if (this._health < 0) {
            this._eventBus.raiseEvent(
                new EnemyEvent(this, EnemyEventType.died)
            );
        }
    }

    /**
     * Update the enemy.
     *
     * @param delta - the time since update was last called in milliseconds
     */
    update(delta: number): void {
        if (this._health < 0) {
            return;
        }
        this._timeSinceLastMovement -= Math.abs(delta);
        if (this._timeSinceLastMovement <= 0) {
            const newPosition = this._path.nextPositionOnPath(this._position);
            if (newPosition) {
                this._updatePosition(newPosition);
            }
        }
        super.update(delta);
    }

    /**
     * Update the position of this enemy.
     * If this enemy cannot move to the new position, this will do nothing.
     *
     * @param newPosition - the new position to move to
     */
    private _updatePosition(newPosition: Position) {
        this._timeSinceLastMovement = SPEED;
        if (this._gameBoard.moveGameObject(this._position, newPosition)) {
            // We moved.
            this._position = newPosition;
        } else {
            const blockage = this._gameBoard.getContents(newPosition);
            if (blockage instanceof Tower) {
                this._eventBus.raiseEvent(
                    new AttackEvent(this, blockage, this._attack)
                );
            }
        }
    }
}
