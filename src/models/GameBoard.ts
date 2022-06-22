import {
    GameBoardInitializedEvent,
    GameObjectAddedEvent,
    GameObjectMovedEvent
} from "../events/StatusEvents";
import type { Game } from "../Game";
import type { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { Position } from "./Position";
import { Tower } from "./Tower";

/**
 * The possible terrains in a position.
 */
export const enum Terrain {
    road,
    blocked
}

const tileCodeMap = {
    "0": Terrain.blocked,
    "1": Terrain.road,
    X: Terrain.road,
    S: Terrain.road
};

/**
 * The game board where everything happens.
 */
export class GameBoard extends GameObject {
    private readonly _game: Game;
    private readonly _terrainMap: Terrain[][] = [];
    private readonly _contentsMap: (GameObject | null)[][] = [];
    private _boardWidth = -1; // Set by the initializeBoard method
    private _boardHeight = -1; // Set by the initializeBoard method
    private readonly _enemySpawnPoints: Position[] = [];
    private _homebasePosition: Position | null = null;

    /**
     * Create a GameBoard.
     *
     * @param game - the game that this board is associated with
     */
    constructor(game: Game) {
        super();
        this._game = game;
    }

    /**
     * Load board based on a file's level design
     *
     * @param board Array from file of level design
     */
    public initializeBoard(board: string[][]) {
        // Get the board width and height from the number of columns and the first column.
        this._boardWidth = board.length;
        this._boardHeight = board[0].length;
        // Create the terrain map and look for objects like the homebase and enemy spawn points.
        for (let i = 0; i < board.length; i++) {
            const col: Terrain[] = [];
            for (let j = 0; j < board[i].length; j++) {
                const tile = board[i][j] as keyof typeof tileCodeMap;
                col.push(tileCodeMap[tile]);
                // TODO: using a hardcoded "S" here is going to screw us over at some point.
                if (board[i][j] === "S") {
                    this._enemySpawnPoints.push(new Position(i, j));
                }
                // Like above, using "X" is going to matter at some point.
                else if (board[i][j] === "X" && !this._homebasePosition) {
                    this._homebasePosition = new Position(i, j);
                }
            }
            if (col.length !== this._boardHeight) {
                throw new Error(
                    `Column ${i} has a length of ${col.length} when ${this._boardHeight} was expected.`
                );
            }
            this._terrainMap.push(col);
        }
        // Check that we have at least one enemy spawn point.
        if (this._enemySpawnPoints.length === 0) {
            throw new Error("There are no enemy spawn points on the map.");
        }
        // Make sure there's a homebase.
        if (!this._homebasePosition) {
            throw new Error("There must be a homebase on the map.");
        }
        // Create the contents of the board.
        for (let i = 0; i < this._boardWidth; i++) {
            const temp: (GameObject | null)[] = [];
            for (let j = 0; j < this._boardHeight; j++) {
                temp.push(null);
            }
            this._contentsMap.push(temp);
        }
        this._game.eventBus.raiseEvent(new GameBoardInitializedEvent(this));
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
    getContents(p: Position): GameObject | Tower | Enemy | null {
        if (!this.isValidPosition(p)) {
            return null;
        }
        return this._contentsMap[p.x][p.y];
    }

    /**
     * Check if a position is both valid and clear.
     *
     * @param p - the position to check
     * @returns true if the position is valid and clear false otherwise
     */
    isValidAndClearPosition(p: Position): boolean {
        return this.isValidPosition(p) && !this.getContents(p);
    }

    /**
     * Remove object from map
     *
     * @param position - position
     */
    clearPosition(position: Position): void {
        if (this.isValidPosition(position)) {
            this._contentsMap[position.x][position.y] = null;
        }
    }

    /**
     * Add a game object to the map
     *
     * @param gameObject - the object to add
     * @param position - where to add the object
     * @returns true if the game object was added false otherwise
     */
    public addGameObjectToMap(
        gameObject: GameObject,
        position: Position
    ): boolean {
        if (!this.isValidAndClearPosition(position)) {
            return false;
        }
        const { x, y } = position;
        this._contentsMap[x][y] = gameObject;
        this._game.eventBus.raiseEvent(
            new GameObjectAddedEvent(gameObject, position)
        );
        this._children.push(gameObject);
        return true;
    }

    /**
     * Move a game object from one position to another.
     * There must be a game object at the provided position and the new position must be empty for this to succeed.
     *
     * @param currentPosition - the position of the object to move
     * @param newPosition - the new position to move to
     * @returns true if the object was moved, false otherwise
     */
    moveGameObject(currentPosition: Position, newPosition: Position): boolean {
        const obj = this._contentsMap[currentPosition.x][currentPosition.y];
        if (!obj) {
            // We cannot move an empty object.
            return false;
        }
        if (this._contentsMap[newPosition.x][newPosition.y]) {
            // We cannot move to a place that already has an object in it.
            return false;
        }
        this._contentsMap[newPosition.x][newPosition.y] = obj;
        this._contentsMap[currentPosition.x][currentPosition.y] = null;
        this._game.eventBus.raiseEvent(
            new GameObjectMovedEvent(obj, currentPosition, newPosition)
        );
        return true;
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
     * Get the height of the board
     *
     * @readonly
     */
    get boardHeight(): number {
        return this._boardHeight;
    }

    /**
     * Get all of the towers on the board.
     *
     * @returns a list of the towers
     */
    getAllTowers(): Tower[] {
        const towers: Tower[] = [];
        this._children.forEach((child) => {
            if (child instanceof Tower) {
                towers.push(child);
            }
        });
        return towers;
    }

    /**
     * Get a list of the enemy spawn points on the map.
     *
     * @readonly
     */
    get enemySpawnPoints(): Position[] {
        return this._enemySpawnPoints;
    }

    /**
     * The homebase position.
     *
     * @readonly
     */
    get homebasePosition(): Position {
        if (!this._homebasePosition) {
            throw new Error(
                "There is no homebase, have you initialized the game board?"
            );
        }
        return this._homebasePosition;
    }
}
