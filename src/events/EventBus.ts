/**
 * When a client registers a handler, they can register it with these priorities.
 */
export enum HandlerPriority {
    high,
    normal,
    low
}

/** Type for mapping priority to handlers */
type PriorityToHandlers = Map<HandlerPriority, unknown[]>;

/**
 * Get a new handler map properly configured with the priority keys.
 *
 * @returns a new map with no handlers
 */
function newPriorityHandlerMap(): PriorityToHandlers {
    const m: Map<HandlerPriority, unknown[]> = new Map();
    m.set(HandlerPriority.high, []);
    m.set(HandlerPriority.normal, []);
    m.set(HandlerPriority.low, []);
    return m;
}

/**
 * An event bus which allows adding and removing handlers, as well as raising events.
 * Make sure to call dispatchEvents to actually send all of the events.
 */
export class EventBus {
    private _handlerMap: Map<string, PriorityToHandlers> = new Map();
    private _queuedEvents: unknown[] = [];

    /**
     * Add an event listener. This will do nothing if the event listener already exists for the event type.
     *
     * @param eventType - the type of events that should be listened for
     * @param handler - a function to handle the event
     * @param priority - the priority of the handler, defaults to normal
     */
    public addEventHandler<T>(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        eventType: { new (...args: any[]): T },
        handler: (event: T) => void,
        priority = HandlerPriority.normal
    ): void {
        // Check if this is the first handler for this event type.
        if (!this._handlerMap.has(eventType.name)) {
            const m = newPriorityHandlerMap();
            m.get(priority)?.push(handler);
            this._handlerMap.set(eventType.name, m);
            return;
        }
        // Only add this handler to the list of event type handlers if isn't already there.
        const currentMap = this._handlerMap.get(eventType.name);
        let found = false;
        [
            currentMap?.get(HandlerPriority.high),
            currentMap?.get(HandlerPriority.normal),
            currentMap?.get(HandlerPriority.low)
        ].forEach((handlerList) => {
            if (!found && handlerList && handlerList.includes(handler)) {
                found = true;
            }
        });
        if (!found) {
            currentMap?.get(priority)?.push(handler);
        }
    }

    /**
     * Remove an event listener. This will do nothing if the event listener does not exist for the event type.
     *
     * @param eventType - the type of events that should not be listened to
     * @param handler - a function to remove
     */
    public removeEventHandler<T>(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        eventType: { new (...args: any[]): T },
        handler: (event: T) => void
    ): void {
        // Check if we have listeners for that event type.
        if (!this._handlerMap.has(eventType.name)) {
            return;
        }
        // Find and remove this handler.
        const currentMap = this._handlerMap.get(eventType.name);
        [
            currentMap?.get(HandlerPriority.high),
            currentMap?.get(HandlerPriority.normal),
            currentMap?.get(HandlerPriority.low)
        ].forEach((handlerList) => {
            if (handlerList && handlerList.includes(handler)) {
                handlerList.splice(handlerList.indexOf(handler), 1);
            }
        });
    }

    /**
     * Queue an event to be sent to all listeners.
     *
     * @param event - the event to queue
     */
    raiseEvent(event: unknown): void {
        this._queuedEvents.push(event);
    }

    /**
     * Send all of the queued events to their listeners.
     */
    dispatchEvents(): void {
        // If we have no events do nothing.
        if (this._queuedEvents.length === 0) {
            return;
        }
        const eventsToSend = this._queuedEvents;
        this._queuedEvents = [];
        eventsToSend.forEach((e) => this._dispatchEvent(e));
    }

    /**
     * Send a single event to all of its listeners.
     *
     * @param event - the event to send
     * @private
     */
    public _dispatchEvent(event: unknown): void {
        // If we have no handlers, do nothing.
        if (
            typeof event !== "object" ||
            !event ||
            !this._handlerMap.has(event.constructor.name)
        ) {
            return;
        }
        // Go through all of the handler priorities.
        const currentMap = this._handlerMap.get(event.constructor.name);
        [
            currentMap?.get(HandlerPriority.high),
            currentMap?.get(HandlerPriority.normal),
            currentMap?.get(HandlerPriority.low)
        ].forEach((handlerList) => {
            if (handlerList && handlerList.length > 0) {
                // Call each handler with the event.
                handlerList.forEach((handler) => {
                    if(typeof handler === "function") {
                        handler(event);
                    }
                });
            }
        });
    }
}
