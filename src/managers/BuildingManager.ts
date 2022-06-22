import { HandlerPriority } from "../events/EventBus";
import { GameBoardInitializedEvent, TowerEvent } from "../events/StatusEvents";
import type { Game } from "../Game";
import type { Building } from "../models/Building";
import { Homebase } from "../models/Homebase";
import type { Position } from "../models/Position";
import { Tower } from "../models/Tower";
import { TowerEventType } from "../types";

/**
 * Manages adding/removing towers from the game board.
 */
export class BuildingManager {
    private readonly _game: Game;
    private _buildingDestroyedCount = 0;
    private _homeBase: Building | null = null;
    private readonly _activeTowers: Building[] = [];

    /**
     * Create a BuildingManager.
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
            TowerEvent,
            this._handleTowerEvent,
            HandlerPriority.high
        );
    }

    /**
     * The number of buildings destroyed during the game.
     *
     * @readonly
     */
    get buildingDestroyedCount(): number {
        return this._buildingDestroyedCount;
    }

    /**
     * Get all of the towers on the game board.
     *
     * @readonly
     */
    get towers(): Building[] {
        return this._activeTowers;
    }

    /**
     * The home base for this game.
     *
     * @readonly
     */
    get homeBase(): Building {
        if (!this._homeBase) {
            throw new Error(
                "There is no home base, have you initialized the game board?"
            );
        }
        return this._homeBase;
    }

    /**
     * Add a basic tower to the map.
     * This will do nothing if the tower cannot be placed at that position.
     *
     * @param position - the position of the new tower
     */
    addBasicTower = (position: Position) => {
        if (this._game.gameBoard.isValidAndClearPosition(position)) {
            const tower = new Tower(this._game, position);
            if (this._game.gameBoard.addGameObjectToMap(tower, position)) {
                this._activeTowers.push(tower);
            }
        }
    };

    /**
     * Handle GameBoardInitialized events.
     *
     * @param event - the event
     */
    private _handleGameBoardInitializedEvent = (
        event: GameBoardInitializedEvent
    ) => {
        const homebasePosition = event.gameboard.homebasePosition;
        this._homeBase = new Homebase(this._game, homebasePosition);
        event.gameboard.addGameObjectToMap(this._homeBase, homebasePosition);
    };

    /**
     * Handel tower events.
     *
     * @param event - the event
     */
    private _handleTowerEvent = (event: TowerEvent) => {
        if (event.type === TowerEventType.died) {
            const index = this._activeTowers.indexOf(event.tower);
            if (index !== -1) {
                this._activeTowers.splice(index, 1);
                this._buildingDestroyedCount++;
                this._game.gameBoard.clearPosition(event.tower.position);
                this._game.gameBoard.destroyChild(event.tower);
            }
        }
    };
}
