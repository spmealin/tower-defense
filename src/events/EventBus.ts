/**
 * An event bus which allows adding and removing handlers, as well as raising events.
 * Make sure to call dispatchEvents to actually send all of the events.
 */
export class EventBus {
    private _handlerMap: Map<string, unknown[]> = new Map();
    private _queuedEvents: unknown[] = [];

    /**
     * Add an event listener. This will do nothing if the event listener already exists for the event type.
     *
     * @param eventType - the type of events that should be listened for
     * @param handler - a function to handle the event
     */
    public addEventHandler<T>(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        eventType: { new (...args: any[]): T },
        handler: (event: T) => void
    ): void {
        // Check if this is the first handler for this event type.
        if (!this._handlerMap.has(eventType.name)) {
            this._handlerMap.set(eventType.name, [handler]);
            return;
        }
        // Only add this handler to the list of event type handlers if isn't already there.
        const currentHandlers = this._handlerMap.get(eventType.name);
        if (currentHandlers && !currentHandlers.includes(handler)) {
            currentHandlers.push(handler);
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
        const currentHandlers = this._handlerMap.get(eventType.name);
        if (currentHandlers) {
            const index = currentHandlers.indexOf(handler);
            if (index >= 0) {
                currentHandlers.splice(index, 1);
            }
        }
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
        // For each handler, call it with the event.
        const currentHandlers = this._handlerMap.get(event.constructor.name);
        if (currentHandlers) {
            currentHandlers.forEach((handler: unknown) => {
                if (typeof handler === "function") {
                    handler(event);
                }
            });
        }
    }
}
