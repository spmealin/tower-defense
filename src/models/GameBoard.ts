import type { Position } from "./Position";

/**
 * The possible terrains in a position.
 */
export const enum Terrain {
    normal,
    blocked
}

/** The width of the board. */
const X_MAX = 50;
/** The height of the board. */
const Y_MAX = 50;

/**
 * The game board where everything happens.
 */
export class GameBoard {
    private readonly _terrainMap: Terrain[][];

    /**
     * Create a GameBoard.
     */
    constructor() {
        this._terrainMap = [];
        this._createTerrainMap(this._terrainMap);
    }

    /**
     * Set up the terrain.
     *
     * @param terrainMap - the root of the terrain map
     * @private
     */
    _createTerrainMap(terrainMap: Terrain[][]) {
        // TODO: rewrite this not to be hardcoded.
        for (let i = 0; i < 50; i++) {
            const col: Terrain[] = [];
            terrainMap.push(col);
            for (let j = 0; j < 50; j++) {
                if (j !== 0 && Math.random() <= 0.2) {
                    col.push(Terrain.blocked);
                } else {
                    col.push(Terrain.normal);
                }
            }
        }
    }

    /**
     * Check if the given position is valid.
     * A position is valid if it is on the game board and it is a type of terrain that can be moved to.
     *
     * @param p - the position to check
     */
    isValidPosition(p: Position) {
        return (
            p.x >= 0 &&
            p.x < X_MAX &&
            p.y >= 0 &&
            p.y < Y_MAX &&
            this._terrainMap[p.x][p.y] === Terrain.normal
        );
    }
}
