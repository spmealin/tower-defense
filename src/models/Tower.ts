import { Position } from "./Position";
import type { Game } from "../Game";
import { GameObject } from "./GameObject";

/**
 * An individual tower
 */
export class Tower extends GameObject {
    private _game: Game;
    private _position: Position;
    private _range = 2;
    private _cellsInRange: Position[] = [];

    /**
     * Initialize a tower
     *
     * @param game - the game
     * @param position - where the tower is
     */
    constructor(game: Game, position: Position) {
        super();
        this._game = game;
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
                if (this._game.gameBoard.isValidPosition(tile)) {
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

    // update() {
    // Get a list of enemies present on the range of cells

    // If there are any, pick the first enemy, and fire an event
    // }
}
