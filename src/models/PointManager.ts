/**
 * The point manager
 */
export class PointManager {
    private _points: number;

    /**
     * Create a point manager with a starting number of points
     *
     * @param startingPoints - number of points to start with
     */
    constructor(startingPoints: number) {
        this._points = startingPoints;
    }

    /**
     * Add points to the total
     *
     * @param point - number of points to add
     */
    addPoints(point: number) {
        this._points += point;
    }

    /**
     * Deduct points if possible. Returns false if not possible.
     *
     * @param point - points to deduct
     * @returns whether or not deduction was successful
     */
    deductPoints(point: number) {
        if (this._points < point) {
            return false;
        }

        this._points -= point;
        return true;
    }

    /**
     * Get the current number of points available
     */
    get points(): number {
        return this._points;
    }
}
