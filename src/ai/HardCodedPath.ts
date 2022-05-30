import { Position } from "../models/Position";

/**
 * A hard coded path that only works for one map.
 * TODO: this needs to be change so it creates the path at runtime.
 */
export class HardCodedPath {
    /**
     * Get the next position on the path given the current position.
     * If the current position is not on the path, this will return null.
     *
     * @param current - the current position
     * @returns the next position on the path
     */
    nextPositionOnPath(current: Position): Position | null {
        let nextPosition: Position | null = null;
        if (current.x === 25 && current.y >= 0 && current.y < 25) {
            nextPosition = new Position(25, current.y + 1);
        }
        return nextPosition;
    }
}
