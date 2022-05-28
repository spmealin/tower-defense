import {
    ObserverMovedEvent,
    UIStatusMessageEvent
} from "../../events/StatusEvents";
import type { Game } from "../../Game";

/**
 * Converts game events to user friendly UIStringMessageEvents.
 */
export class SpeechRenderer {
    private _game: Game;

    /**
     * Construct a SpeechRenderer object.
     *
     * @param game - the game to render
     */
    constructor(game: Game) {
        this._game = game;
    }

    /**
     * Start listening for events.
     */
    startListening(): void {
        this._game.eventBus.addEventHandler(ObserverMovedEvent, (event) =>
            this._handleObserverMovedEvents(event)
        );
    }

    /**
     * Handle when an observer moves.
     *
     * @param event - the ObserverMovedEvent
     */
    private _handleObserverMovedEvents(event: ObserverMovedEvent): void {
        const p = event.newPosition;
        const contents = this._game.gameBoard.getContents(p);
        const spokenContents = contents === null ? "" : "Tower";
        const message = `${p.x}, ${p.y}. ${spokenContents}`;
        this._game.eventBus.raiseEvent(new UIStatusMessageEvent(message));
    }
}
