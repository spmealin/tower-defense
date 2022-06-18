import { AttackEvent, TowerEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import { TowerEventType, TowerStatus } from "../types";
import { Building } from "./Building";
import type { Position } from "./Position";

/**
 * An individual tower
 */
export class TowerBarricade extends Building {
    private _towerStatus = TowerStatus.building;
    private _elapsedTime = 0;
    private _builtTime = 1 * 1000;

    /**
     * Initialize a tower
     *
     * @param game - the game
     * @param position - where the tower is
     */
    constructor(game: Game, position: Position) {
        super(game, position);
        this._health = 50;

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
            this._game.gameBoard.destroyChild(this);
            return;
        }
    }

    /**
     * Handle attack events.
     *
     * @param event - the event
     */
    private _handleAttackEvent = (event: AttackEvent<TowerBarricade>) => {
        if (event.target === this) {
            this._health -= event.attackPoints;
            if (this._health < 0) {
                this._game.eventBus.raiseEvent(
                    new TowerEvent(this, TowerEventType.died)
                );
                this._towerStatus = TowerStatus.dead;
            }
        }
    };
}
