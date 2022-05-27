import type { Game } from "../../Game";
import type { Position } from "../../models/Position";

const VISUAL_WIDTH = 800;
const VISUAL_HEIGHT = 800;

/**
 * Determines what sound files are appropriate based on game events
 */
export class Artist {
    private _container: HTMLElement;
    private _game: Game;
    private _boardWidth: number;
    private _boardHeight: number;
    private _canvas: HTMLCanvasElement;
    private _cellWidth: number;
    private _cellHeight: number;

    /**
     * Construct a AudioRenderer object.
     *
     * @param container - element for drawing to go
     * @param game - game board
     */
    constructor(container: HTMLElement, game: Game) {
        this._container = container;
        this._game = game;
        this._boardWidth = this._game.gameBoard.boardWidth;
        this._boardHeight = this._game.gameBoard.boardHeight;
        this._cellWidth = VISUAL_WIDTH / this._boardWidth;
        this._cellHeight = VISUAL_HEIGHT / this._boardHeight;

        // Initialize canvas
        this._canvas = document.createElement("canvas");
        this._canvas.setAttribute("width", `${VISUAL_WIDTH}`);
        this._canvas.setAttribute("height", `${VISUAL_HEIGHT}`);
        this._container.appendChild(this._canvas);
    }

    /**
     * Clear the canvas
     */
    private _clearCanvas(): void {
        const ctx = this._canvas.getContext("2d");
        ctx?.clearRect(0, 0, VISUAL_WIDTH, VISUAL_HEIGHT);
    }

    /**
     * Draw a set of tiles
     *
     * @param tiles - tiles to draw
     */
    drawTiles(tiles: Position[]): void {
        this._clearCanvas();

        const ctx = this._canvas.getContext("2d");
        if (!ctx) {
            // eslint-disable-next-line no-console
            console.error("Couldn't draw on canvas");
            return;
        }

        tiles.forEach((tile) => {
            this.drawTile(ctx, tile);
        });
    }

    /**
     * Draw a given square
     *
     * @param ctx CanvasContext
     * @param pos position of cell
     */
    drawTile(ctx: CanvasRenderingContext2D, pos: Position): void {
        ctx.strokeRect(
            pos.x * this._cellWidth,
            (50 - pos.y) * this._cellHeight,
            this._cellWidth,
            this._cellHeight
        );

        if (!this._game.gameBoard.isValidPosition(pos)) {
            ctx.strokeText(
                "X",
                (pos.x + 0.3) * this._cellWidth,
                (50 - pos.y + 0.7) * this._cellHeight
            );
        }
    }
}

/*

// Drawing a circle
ctx.beginPath();
ctx.arc(
    ((pos.x+0.5)*this._cellWidth),
    ((50-pos.y+0.5)*this._cellHeight),
    this._cellWidth/4,
    0,
    2 * Math.PI
);
ctx.fill();
*/
