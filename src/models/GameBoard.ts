import type { Position } from "./Position";

/**
 * The possible terrains in a position.
 */
export const enum Terrain {
    road,
    blocked,
    home
}

const tileCodeMap = {
    "0": Terrain.blocked,
    "1": Terrain.road,
    X: Terrain.home
};

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

    /**
     * Create a GameBoard.
     */
    constructor() {
        this._terrainMap = [];
    }

    /**
     * Load board based on a file's level design
     *
     * @param board Array from file of level design
     */
    public loadTerrainMap(board: string[][]) {
        for (let i = 0; i < board.length; i++) {
            const col: Terrain[] = [];
            for (let j = 0; j < board[i].length; j++) {
                const tile = board[i][j] as keyof typeof tileCodeMap;
                col.push(tileCodeMap[tile]);
            }
            this._terrainMap.push(col);
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
            if (this._terrainMap[x][y] !== Terrain.blocked) {
                valid = true;
            }
        }
        return valid;
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
