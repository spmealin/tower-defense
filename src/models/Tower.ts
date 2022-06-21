import { AttackEvent, TowerEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import { TowerEventType, TowerStatus } from "../types";
import { Building } from "./Building";
import { Enemy } from "./Enemy";
import type { HasPosition } from "./hasPosition";
import { Position } from "./Position";

/**
 * An individual tower
 */
export class Tower extends Building {
    private _range = 2;
    private _cellsInRange: Position[] = [];
    private _towerStatus = TowerStatus.building;
    private _elapsedTime = 0;
    private _builtTime = 10 * 1000;
    private _attack = 10;
    private _timeSinceFiring = 0;

    /**
     * Initialize a tower
     *
     * @param game - the game
     * @param position - where the tower is
     */
    constructor(game: Game, position: Position) {
        super(game, position);
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
                if (this._game.gameBoard.isValidPosition(tile)) {
                    this._cellsInRange.push(tile);
                }
            }
        }

        this._game.eventBus.raiseEvent(
            new TowerEvent(this, TowerEventType.placed)
        );

        this._game.eventBus.addEventHandler(
            AttackEvent,
            this._handleAttackEvent
        );
    }

    /**
     * Destroy this tower.
     */
    destroy(): void {
        this._game.eventBus.removeEventHandler(
            AttackEvent,
            this._handleAttackEvent
        );
        super.destroy();
    }

    /**
     * Tower's status
     */
    get towerStatus(): TowerStatus {
        return this._towerStatus;
    }

    /**
     * On frame change
     *
     * @param delta seconds passed
     */
    update(delta: number) {
        super.update(delta);
        this._elapsedTime += delta;
        this._timeSinceFiring += delta;

        if (this._towerStatus === TowerStatus.building) {
            if (this._elapsedTime > this._builtTime) {
                this._towerStatus = TowerStatus.active;
                this._game.eventBus.raiseEvent(
                    new TowerEvent(this, TowerEventType.finishedBuilding)
                );
            }
            // If the tower is building, or just finished building,
            // it should wait another frame before trying to do things,
            // like fire on enemies.
            return;
        }
        // Check if this tower is dead but not yet removed from the board.
        else if (this._towerStatus === TowerStatus.dead) {
            // Announce that we are dead then do nothing.
            this._game.eventBus.raiseEvent(
                new TowerEvent(this, TowerEventType.died)
            );
            return;
        }

        if (this._timeSinceFiring >= 1000) {
            // Get a list of all enemies in range
            const enemies: Enemy[] = [];
            for (let i = 0; i < this._cellsInRange.length; i++) {
                const cell = this._game.gameBoard.getContents(
                    this._cellsInRange[i]
                );
                if (cell instanceof Enemy) {
                    enemies.push(cell);
                }
            }

            // If there are no enemies in range, there's nothing to do
            if (enemies.length === 0) {
                return;
            }

            // If there are any, pick the first enemy, and fire an event
            const target = enemies[0];
            this._game.eventBus.raiseEvent(
                new AttackEvent<HasPosition>(this, target, this._attack)
            );
            this._timeSinceFiring = 0;
        }
    }

    /**
     * Handle attack events.
     *
     * @param event - the event
     */
    private _handleAttackEvent = (event: AttackEvent<Tower>) => {
        if (event.target === this) {
            this._health -= event.attackPoints;
            if (this._health <= 0) {
                this._health = 0;
                this._towerStatus = TowerStatus.dead;
            }
        }
    };
}
