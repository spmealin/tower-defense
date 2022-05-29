import type { Game } from "../Game";
import { GameObject } from "./GameObject";
import type { Position } from "./Position";
import { Tower } from "./Tower";

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
export class GameBoard extends GameObject {
    private readonly _terrainMap: Terrain[][];
    private readonly _boardWidth = X_MAX;
    private readonly _boardHeight = Y_MAX;
    private _contentsMap: (Tower | null)[][] = [];

    /**
     * Create a GameBoard.
     */
    constructor() {
        super();
        this._terrainMap = [];
        this._createEmptyContentsMap();
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
            if (this._terrainMap[x][y] !== Terrain.blocked) {
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
     * Build a tower
     *
     * @param game - the game
     * @param position - location of tower
     */
    buildTower(game: Game, position: Position): void {
        const tower = new Tower(game, this, position);
        this._addTowerToMap(tower);
    }

    /**
     * Add a tower to the map
     *
     * @param tower tower
     */
    private _addTowerToMap(tower: Tower) {
        const { x, y } = tower.position;
        this._contentsMap[x][y] = tower;
        this._children.push(tower);
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

    /**
     * Get the children
     */
    get children(): GameObject[] {
        return this._children;
    }
}
