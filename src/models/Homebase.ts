import { AttackEvent, HomebaseEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import { Building } from "./Building";
import type { Position } from "./Position";

/**
 * The status of the homebase.
 */
export enum HomebaseStatus {
    normal,
    underattack,
    repairing,
    destroied
}

/**
 * The homebase of the player; if this dies, the game is over.
 */
export class Homebase extends Building {
    private _status = HomebaseStatus.normal;

    /**
     * Initialize homebase
     *
     * @param game - the game
     * @param position - where the tower is
     */
    constructor(game: Game, position: Position) {
        super(game, position);
        this._game.eventBus.addEventHandler(
            AttackEvent,
            this._handleAttackEvent
        );
    }

    /**
     * Destroy homebase.
     */
    destroy(): void {
        this._game.eventBus.removeEventHandler(
            AttackEvent,
            this._handleAttackEvent
        );
        super.destroy();
    }

    /**
     *
     * Update each frame.
     */
    public update(): void {
        if (this._health < 0) {
            this._game.gameBoard.destroyChild(this);
        }
    }

    /**
     * Handle attack events.
     *
     * @param event - the event
     */
    private _handleAttackEvent = (event: AttackEvent) => {
        if (event.target === this) {
            this._health -= event.attackPoints;
            if (this._health < 0) {
                this._status = HomebaseStatus.destroied;
                this._game.eventBus.raiseEvent(
                    new HomebaseEvent(HomebaseStatus.destroied)
                );
            }
        }
    };
}
