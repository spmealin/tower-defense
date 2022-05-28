import type { Position } from "./Position";
import type { Tower } from "./Tower";

/**
 * The possible terrains in a position.
 */
export const enum Terrain {
    normal,
    blocked
}

/** The width of the board. */
const X_MAX = 51;
/** The height of the board. */
const Y_MAX = 51;

/**
 * The game board where everything happens.
 */
export class GameBoard {
    private readonly _terrainMap: Terrain[][];
    private readonly _boardWidth = X_MAX;
    private readonly _boardHeight = Y_MAX;
    private _contentsMap: (Tower | null)[][] = [];

    /**
     * Create a GameBoard.
     */
    constructor() {
        this._terrainMap = [];
        this._createTerrainMap(this._terrainMap);
        this._createEmptyContentsMap();
    }

    /**
     * Set up the terrain.
     *
     * @param terrainMap - the root of the terrain map
     * @private
     */
    _createTerrainMap(terrainMap: Terrain[][]) {
        // TODO: rewrite this not to be hardcoded.
        for (let i = 0; i < this._boardWidth; i++) {
            const col: Terrain[] = [];
            terrainMap.push(col);
            for (let j = 0; j < this._boardHeight; j++) {
                if (j !== 0 && Math.random() <= 0.2) {
                    col.push(Terrain.blocked);
                } else {
                    col.push(Terrain.normal);
                }
            }
        }
    }

    /**
     * Create an empty contents map that's scaled to the size of the board
     */
    _createEmptyContentsMap() {
        for (let i = 0; i < this._boardWidth; i++) {
            const temp: (Tower | null)[] = [];
            for (let j = 0; j < this._boardHeight; j++) {
                temp.push(null);
            }
            this._contentsMap.push(temp);
        }
    }

    /**
     * Check if the given position is valid.
     * A position is valid if it is on the game board and it is a type of terrain that can be moved to.
     *
     * @param p - the position to check
     */
    isValidPosition(p: Position) {
        let valid = false;
        const x = p.x;
        const y = p.y;
        if (x >= 0 && x < this._boardWidth && y >= 0 && y < this._boardHeight) {
            if (this._terrainMap[x][y] === Terrain.normal) {
                valid = true;
            }
        }
        return valid;
    }

    /**
     * Get the contents of the map
     *
     * @param p position on map
     * @returns the item on the cell (null if nothing)
     */
    getContents(p: Position): Tower | null {
        if (
            p.x < 0 ||
            p.y < 0 ||
            p.x >= this.boardWidth ||
            p.y >= this.boardHeight
        ) {
            return null;
        }
        return this._contentsMap[p.x][p.y];
    }

    /**
     * Add a tower to the map
     *
     * @param tower tower
     */
    addTowerToMap(tower: Tower) {
        const { x, y } = tower.position;
        this._contentsMap[x][y] = tower;
    }

    /**
     * Get the boardWidth
     *
     * @readonly
     */
    get boardWidth(): number {
        return this._boardWidth;
    }

    /**
     * Get the boardWidth
     *
     * @readonly
     */
    get boardHeight(): number {
        return this._boardHeight;
    }
}
