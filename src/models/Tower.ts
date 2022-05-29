import { Position } from "./Position";
import { GameObject } from "./GameObject";
import { TowerStatus } from "../types";
import type { GameBoard } from "./GameBoard";

/**
 * An individual tower
 */
export class Tower extends GameObject {
    private _gameBoard: GameBoard;
    private _position: Position;
    private _range = 2;
    private _cellsInRange: Position[] = [];
    private _towerStatus = TowerStatus.building;
    private _elapsedTime = 0;
    private _builtTime = -10 * 1000;

    /**
     * Initialize a tower
     *
     * @param gameBoard - the gameBoard
     * @param position - where the tower is
     */
    constructor(gameBoard: GameBoard, position: Position) {
        super();
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
     * On frame change
     *
     * @param delta seconds passed
     */
    update(delta: number) {
        this._elapsedTime += delta;

        if (this._towerStatus === TowerStatus.building) {
            if (this._elapsedTime < this._builtTime) {
                this._towerStatus = TowerStatus.active;
            }
        }
        // Get a list of enemies present on the range of cells

        // If there are any, pick the first enemy, and fire an event
    }
}
