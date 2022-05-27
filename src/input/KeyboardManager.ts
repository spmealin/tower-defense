import {
    ALT_LEFT,
    ALT_RIGHT,
    CONTROL_LEFT,
    CONTROL_RIGHT,
    SHIFT_LEFT,
    SHIFT_RIGHT
} from "./KeyConstants";

/**
 * The callback when a key changes state.
 */
type keyCallback = (info: KeyEvent) => void;

/**
 * The states of the keys that we raise an event for.
 */
export const enum KeyState {
    down,
    up
}

/**
 * The relevant keyboard info when events are fired.
 */
export interface KeyEvent {
    key: string;
    state: KeyState;
    shift: boolean;
    control: boolean;
    alt: boolean;
}

/**
 * Interface that tracks when a key is pressed but update() hasn't been called yet.
 */
interface UnprocessedKeyEntry {
    key: string;
    state: KeyState;
}

/**
 * The key transitions that a listener may be interested in.
 */
export const enum KeyTransition {
    both,
    KeyPressed,
    KeyReleased
}

/**
 * Tracks a callback handler and the key transition that it is interested in.
 */
interface callbackInfo {
    callback: keyCallback;
    interestedTransition: KeyTransition;
}

/**
 * This class listens for keyboard events and calls callbacks when a key changes state.
 */
export class KeyboardManager {
    private readonly _element: HTMLElement;
    private _isListening = false;
    private _pressedKeys: Set<string> = new Set();
    private readonly _handlers: Map<string, callbackInfo[]> = new Map();
    private _unprocessedKeys: UnprocessedKeyEntry[] = [];

    /**
     *Creates an instance of KeyboardManager.
     *
     * @param element - the element to listen for keyboard events
     */
    constructor(element: HTMLElement) {
        this._element = element;
    }

    /**
     * Is control pressed?
     *
     * @readonly
     */
    get isControlPressed(): boolean {
        return (
            this._pressedKeys.has(CONTROL_LEFT) ||
            this._pressedKeys.has(CONTROL_RIGHT)
        );
    }

    /**
     * Is shift pressed?
     *
     * @readonly
     */
    get isShiftPressed(): boolean {
        return (
            this._pressedKeys.has(SHIFT_LEFT) ||
            this._pressedKeys.has(SHIFT_RIGHT)
        );
    }

    /**
     * Is alt pressed?
     *
     * @readonly
     */
    get isAltPressed(): boolean {
        return (
            this._pressedKeys.has(ALT_LEFT) || this._pressedKeys.has(ALT_RIGHT)
        );
    }

    /**
     * Start listening for keyboard events.
     */
    public startListening(): void {
        if (!this._isListening) {
            this._element.addEventListener("keydown", this._onKeyDownEvent);
            this._element.addEventListener("keyup", this._onKeyUpEvent);
            this._isListening = true;
        }
    }

    /**
     * Stop listening for keyboard events.
     */
    public stopListening(): void {
        if (this._isListening) {
            this._element.removeEventListener("keydown", this._onKeyDownEvent);
            this._element.removeEventListener("keyup", this._onKeyUpEvent);
            this._pressedKeys.forEach((k) => {
                if (this._handlers.has(k)) {
                    const event = this._createKeyEvent(k, KeyState.up);
                    this._handlers
                        .get(k)
                        ?.forEach((callbackInfo) =>
                            callbackInfo.callback(event)
                        );
                }
            });
            this._pressedKeys = new Set();
        }
    }

    /**
     * Add a callback to be called when the state of a key changes.
     *
     * @param key - the key to listen for
     * @param callback - the callback to call
     * @param transition - the key transitions of interest
     */
    addHandler(
        key: string,
        callback: keyCallback,
        transition = KeyTransition.both
    ): void {
        let handlers = this._handlers.get(key);
        if (!handlers) {
            handlers = [];
            this._handlers.set(key, handlers);
        }
        handlers.push({ callback: callback, interestedTransition: transition });
    }

    /**
     * Fire any events
     */
    public update(): void {
        if (!this._isListening || this._unprocessedKeys.length === 0) {
            return;
        }
        const unprocessed = this._unprocessedKeys;
        this._unprocessedKeys = [];
        unprocessed.forEach((u) => {
            if (u.state === KeyState.up) {
                this._pressedKeys.add(u.key);
            } else {
                this._pressedKeys.delete(u.key);
            }
            if (this._handlers?.has(u.key)) {
                const event = this._createKeyEvent(
                    u.key,
                    u.state,
                    this.isControlPressed,
                    this.isAltPressed,
                    this.isShiftPressed
                );
                this._handlers.get(u.key)?.forEach((callbackInfo) => {
                    if (
                        callbackInfo.interestedTransition ===
                            KeyTransition.both ||
                        (callbackInfo.interestedTransition ===
                            KeyTransition.KeyPressed &&
                            event.state === KeyState.down) ||
                        (callbackInfo.interestedTransition ===
                            KeyTransition.KeyReleased &&
                            event.state === KeyState.up)
                    ) {
                        callbackInfo.callback(event);
                    }
                });
            }
        });
    }

    /**
     * Called when a key is pressed.
     *
     * @param e - the keyboard event
     * @private
     */
    private _onKeyDownEvent = (e: KeyboardEvent): void => {
        this._unprocessedKeys.push({ key: e.code, state: KeyState.down });
    };

    /**
     * Called when a key is released.
     *
     * @param e - the keyboard event
     * @private
     */
    private _onKeyUpEvent = (e: KeyboardEvent): void => {
        this._unprocessedKeys.push({ key: e.code, state: KeyState.up });
    };

    /**
     * Helper method to create a key event.
     *
     * @param key - the key
     * @param state - the state of the key
     * @param [control = false] - if the control key is pressed
     * @param [alt = false] - if the alt key is pressed
     * @param [shift = false] - if the shift key is pressed
     * @returns a new KeyEvent object
     */
    _createKeyEvent(
        key: string,
        state: KeyState,
        control = false,
        alt = false,
        shift = false
    ): KeyEvent {
        return {
            key: key,
            state: state,
            control: control,
            alt: alt,
            shift: shift
        };
    }
}
