/**
 * A simple X/Y position.
 * The x-axis runs from left to right and the y-axis runs from bottom to top.
 */
export class Position {
    private readonly _x: number;
    private readonly _y: number;

    /**
     * Create a Position object.
     *
     * @param x - the x value
     * @param y - the y value
     */
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    /**
     * Get the x value.
     *
     * @readonly
     */
    get x(): number {
        return this._x;
    }

    /**
     * Get the y value.
     *
     * @readonly
     */
    get y(): number {
        return this._y;
    }

    /**
     * Check if another position is the same as this one
     *
     * @param newPosition another position being checked against
     * @returns if they're equal
     */
    equals(newPosition: Position): boolean {
        return this._x === newPosition.x && this._y === newPosition.y;
    }
}
