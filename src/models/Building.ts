import type { Game } from "../Game";
import { GameObject } from "./GameObject";
import type { HasPosition } from "./hasPosition";
import type { Position } from "./Position";

/**
 * An abstract building.
 */
export abstract class Building extends GameObject implements HasPosition {
    protected _game: Game;
    protected _position: Position;
    protected _startingHealth = 100;
    protected _health = this._startingHealth;

    /**
     * Create a building
     *
     * @param game - the game
     * @param position - the location of the building
     */
    constructor(game: Game, position: Position) {
        super();
        this._game = game;
        this._position = position;
    }

    /**
     * The position of the building
     *
     * @readonly
     */
    get position(): Position {
        return this._position;
    }

    /**
     * Get health of building
     */
    get health(): number {
        return this._health;
    }

    /**
     * Get health of building, represented as percent of starting health
     */
    get healthAsPercent(): number {
        return this._health / this._startingHealth;
    }
}
