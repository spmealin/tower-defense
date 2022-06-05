import type { Game } from "../../Game";
import type { Observer } from "../../models/Observer";
import { Position } from "../../models/Position";
import type { Artist } from "./Artist";

/**
 * Determines what sound files are appropriate based on game events
 */
export class VisualManager {
    private _game: Game;
    private _observer: Observer;
    private _artist: Artist;

    /**
     * Construct a AudioRenderer object.
     *
     * @param game - the game to render
     * @param observer - the observer (camera)
     * @param artist - does the drawing
     */
    constructor(game: Game, observer: Observer, artist: Artist) {
        this._game = game;
        this._observer = observer;
        this._artist = artist;
    }

    /**
     * Redraw page
     */
    public update(): void {
        const player_position = this._observer.position;
        const left = new Position(player_position.x - 1, player_position.y);
        const up = new Position(player_position.x, player_position.y + 1);
        const right = new Position(player_position.x + 1, player_position.y);
        const down = new Position(player_position.x, player_position.y - 1);

        this._artist.drawTiles([player_position, left, up, right, down]);
    }
}
