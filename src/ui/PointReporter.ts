import type { PointManager } from "../models/PointManager";

/**
 * Determines what sound files are appropriate based on game events
 */
export class PointReporter {
    private _pointManager: PointManager;
    private _scoreBox: HTMLElement;

    /**
     * Report on the current points
     *
     * @param pointManager - the point manager, whose points will be reported on
     * @param elem - the element to visually display the points
     */
    constructor(pointManager: PointManager, elem: HTMLElement) {
        this._pointManager = pointManager;
        this._scoreBox = elem;
    }

    /**
     * Redraw page
     */
    public update(): void {
        this._scoreBox.textContent = `${this._pointManager.points}`;
    }
}
