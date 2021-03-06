import type { HardCodedPath } from "../ai/HardCodedPath";
import type { EventBus } from "../events/EventBus";
import { AttackEvent, EnemyEvent } from "../events/StatusEvents";
import { EnemyEventType } from "../types";
import { Building } from "./Building";
import type { GameBoard } from "./GameBoard";
import { GameObject } from "./GameObject";
import type { HasPosition } from "./hasPosition";
import type { Position } from "./Position";

/** How long it takes for an enemy to cross a position in milliseconds */
const SPEED = 3000;

/**
 * A simple enemy.
 */
export class Enemy extends GameObject implements HasPosition {
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
        this._eventBus.addEventHandler(AttackEvent, this._handleAttackEvent);
    }

    /**
     * Clean up this enemy when it is being destroied.
     */
    destroy(): void {
        this._eventBus.removeEventHandler(AttackEvent, this._handleAttackEvent);
        super.destroy();
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
     * Handle attack events.
     *
     * @param event - the event
     */
    private _handleAttackEvent = (event: AttackEvent<Enemy>) => {
        if (event.target === this) {
            this._health -= event.attackPoints;
            if (this._health < 0) {
                this._health = 0;
            }
        }
    };

    /**
     * Update the enemy.
     *
     * @param delta - the time since update was last called in milliseconds
     */
    update(delta: number): void {
        if (this._health === 0) {
            this._eventBus.raiseEvent(
                new EnemyEvent(this, EnemyEventType.died)
            );
            return;
        }
        this._timeSinceLastMovement -= delta;
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
            if (blockage instanceof Building) {
                this._eventBus.raiseEvent(
                    new AttackEvent<HasPosition>(this, blockage, this._attack)
                );
            }
        }
    }
}
