import {
    EnemyEvent,
    GameObjectMovedEvent,
    TowerEvent
} from "../events/StatusEvents";
import type { Game } from "../Game";
import { EnemyEventType, TowerEventType } from "../types";
import type { Enemy } from "./Enemy";
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

/**
 * The game board where everything happens.
 */
export class GameBoard extends GameObject {
    private readonly _game: Game;
    private readonly _terrainMap: Terrain[][] = [];
    private _boardWidth = -1; // Set by the initializeBoard method
    private _boardHeight = -1; // Set by the initializeBoard method
    private _contentsMap: (GameObject | null)[][] = [];

    /**
     * Create a GameBoard.
     *
     * @param game - the game that this board is associated with
     */
    constructor(game: Game) {
        super();
        this._game = game;
        this._startListening();
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
        // Create the terrain map.
        for (let i = 0; i < board.length; i++) {
            const col: Terrain[] = [];
            for (let j = 0; j < board[i].length; j++) {
                const tile = board[i][j] as keyof typeof tileCodeMap;
                col.push(tileCodeMap[tile]);
            }
            if (col.length !== this._boardHeight) {
                throw new Error(
                    `Column ${i} has a length of ${col.length} when ${this._boardHeight} was expected.`
                );
            }
            this._terrainMap.push(col);
        }
        // Create the contents of the board.
        for (let i = 0; i < this._boardWidth; i++) {
            const temp: (GameObject | null)[] = [];
            for (let j = 0; j < this._boardHeight; j++) {
                temp.push(null);
            }
            this._contentsMap.push(temp);
        }
    }

    /**
     * Start listening for relevant events
     */
    _startListening() {
        this._game.eventBus.addEventHandler(TowerEvent, (event: TowerEvent) => {
            if (event.type === TowerEventType.died) {
                this.clearPosition(event.tower.position);
            }
        });
        this._game.eventBus.addEventHandler(EnemyEvent, (event: EnemyEvent) => {
            if (event.type === EnemyEventType.died) {
                this.clearPosition(event.enemy.position);
            }
        });
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
     * @param position - location of tower
     */
    buildTower(position: Position): void {
        const tower = new Tower(this._game, position);
        this._addGameObjectToMap(tower);
    }

    /**
     * Remove object from map
     *
     * @param position - position
     */
    clearPosition(position: Position): void {
        const { x, y } = position;
        this._contentsMap[x][y] = null;
    }

    /**
     * Add an enemy to the map.
     * TODO: this does not do any error checking, fix that at some point so we cannot add enemies on top of each other.
     *
     * @param enemy - the enemy to add
     */
    addEnemy(enemy: Enemy): void {
        this._addGameObjectToMap(enemy);
    }

    /**
     * Add a game object to the map
     *
     * @param gameObject - the object to add
     */
    private _addGameObjectToMap(gameObject: Tower | Enemy | GameObject) {
        if ("position" in gameObject) {
            const { x, y } = gameObject.position;
            this._contentsMap[x][y] = gameObject;
        }
        this._children.push(gameObject);
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
