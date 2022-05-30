import type { Game } from "../Game";

/**
 * Accountant
 */
export class PointManager {
    private _game: Game;
    private _points: number;

    /**
     * Constructs the PointManager
     *
     * @param game - the game
     * @param startingPoints - number of points to start with
     */
    constructor(game: Game, startingPoints = 100) {
        this._game = game;
        this._points = startingPoints;
    }

    /**
     * Take away a number of points
     *
     * @param points - cost of something
     * @returns If the deduction was successful (true = points were deducted, false = couldn't afford it)
     */
    deduct(points: number) {
        if (this._points < points) {
            return false;
        }
        this._points -= points;
        return true;
    }
}
