import {
    AttackEvent,
    GameObjectAddedEvent,
    GameObjectMovedEvent,
    ObserverMovedEvent,
    TowerEvent,
    UIStatusMessageEvent
} from "../../events/StatusEvents";
import type { Game } from "../../Game";
import { Enemy } from "../../models/Enemy";
import type { GameObject } from "../../models/GameObject";
import { Homebase } from "../../models/Homebase";
import type { Observer } from "../../models/Observer";
import { Tower } from "../../models/Tower";
import { TowerStatus } from "../../types";

/**
 * Generate a description of the contents of a tile
 *
 * @param contents contents of a tile
 * @returns description
 */
function describeContents(contents: GameObject | null): string {
    if (!contents) {
        return "";
    }

    if (
        contents instanceof Tower &&
        contents.towerStatus === TowerStatus.building
    ) {
        return "building tower";
    }

    if (
        contents instanceof Tower &&
        contents.towerStatus === TowerStatus.active
    ) {
        return `Tower, ${Math.floor(contents.healthAsPercent * 100)}%`;
    }

    if (contents instanceof Homebase) {
        return `Homebase, ${Math.floor(contents.healthAsPercent * 100)}%`;
    }

    if (contents instanceof Enemy) {
        return `Enemy, ${contents.health} HP.`;
    }

    return "unknown";
}

/**
 * Converts game events to user friendly UIStringMessageEvents.
 */
export class SpeechRenderer {
    private _game: Game;
    private _observer: Observer | null = null;

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
        this._game.eventBus.addEventHandler(
            ObserverMovedEvent,
            this._handleObserverMovedEvents
        );
        this._game.eventBus.addEventHandler(
            GameObjectMovedEvent,
            this._handleObjectMovedEvent
        );
        this._game.eventBus.addEventHandler(
            GameObjectAddedEvent,
            this._handleObjectAddedEvent
        );
        this._game.eventBus.addEventHandler(
            TowerEvent,
            this._handleTowerStatusUpdateEvent
        );
        this._game.eventBus.addEventHandler(
            AttackEvent,
            this._handleHealthChangeEvent
        );
    }

    get observer(): Observer | null {
        return this._observer;
    }

    /**
     * The observer that this renderer tracks.
     */
    set observer(observer: Observer | null) {
        this._observer = observer;
    }

    /**
     * Handle when an observer moves.
     *
     * @param event - the ObserverMovedEvent
     */
    private _handleObserverMovedEvents = (event: ObserverMovedEvent) => {
        if (event.observer === this._observer) {
            const p = event.newPosition;
            const contents = this._game.gameBoard.getContents(p);
            const spokenContents = describeContents(contents);
            const message = `${p.x}, ${p.y}. ${spokenContents}`;
            this._game.eventBus.raiseEvent(new UIStatusMessageEvent(message));
        }
    };

    /**
     * Handle when an object moves into the same square as the tracked observer.
     *
     * @param event - the event
     */
    private _handleObjectMovedEvent = (event: GameObjectMovedEvent) => {
        if (
            this._observer &&
            event.newPosition.equals(this._observer.position)
        ) {
            const spokenContents = describeContents(event.gameObject);
            this._game.eventBus.raiseEvent(
                new UIStatusMessageEvent(spokenContents)
            );
        }
    };

    /**
     * Handle when an object moves into the same square as the tracked observer.
     *
     * @param event - the event
     */
    private _handleTowerStatusUpdateEvent = (event: TowerEvent) => {
        if (
            this._observer &&
            event.tower.position.equals(this._observer.position)
        ) {
            const p = event.tower.position;
            const contents = this._game.gameBoard.getContents(p);
            const spokenContents = describeContents(contents);
            this._game.eventBus.raiseEvent(
                new UIStatusMessageEvent(spokenContents)
            );
        }
    };

    /**
     * Handle when an object moves into the same square as the tracked observer.
     *
     * @param event - the event
     */
    private _handleHealthChangeEvent = (event: AttackEvent) => {
        if (event.target instanceof Tower || event.target instanceof Enemy) {
            const { position } = event.target;

            if (this._observer && position.equals(this._observer.position)) {
                const contents = this._game.gameBoard.getContents(position);
                const spokenContents = describeContents(contents);
                this._game.eventBus.raiseEvent(
                    new UIStatusMessageEvent(spokenContents)
                );
            }
        }
    };

    /**
     * Handle when an object is added to the board at the same location as the tracked observer.
     *
     * @param event - the event
     */
    private _handleObjectAddedEvent = (event: GameObjectAddedEvent) => {
        if (this._observer && event.position.equals(this._observer.position)) {
            const spokenContents = describeContents(event.gameObject);
            this._game.eventBus.raiseEvent(
                new UIStatusMessageEvent(spokenContents)
            );
        }
    };
}
