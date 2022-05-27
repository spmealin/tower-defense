import { AnimationClock } from "./AnimationClock";
import { UIStatusMessageEvent } from "./events/StatusEvents";
import { Game } from "./Game";
import { KeyboardManager, KeyTransition } from "./input/KeyboardManager";
import * as keys from "./input/KeyConstants";
import { Observer } from "./models/Observer";
import { SpeechRenderer } from "./ui/renderers/SpeechRenderer";
import { ScreenReaderBridge } from "./ui/ScreenReaderBridge";

let sr: ScreenReaderBridge;
let game: Game;
let keyboardManager: KeyboardManager;
let observer: Observer;
let speechRenderer: SpeechRenderer;
let animationClock: AnimationClock;

/**
 * The main entry point of the application.
 *
 * @param root - the root element of the application
 */
export function main(root: HTMLElement): void {
    pageInit(root);
    handlerInit();
    startGame();
}

/**
 * Set up the elements of the page and the global objects that we need.
 *
 * @param root - the root element that we should be adding elements to on the page
 */
function pageInit(root: HTMLElement): void {
    const focusDiv = document.createElement("div");
    focusDiv.setAttribute("tabIndex", "0");
    root.appendChild(focusDiv);
    focusDiv.focus();
    const speechDiv = document.createElement("div");
    ScreenReaderBridge.addAriaAttributes(speechDiv);
    root.appendChild(speechDiv);
    sr = new ScreenReaderBridge(speechDiv);
    game = new Game();
    game.initialize();
    keyboardManager = new KeyboardManager(focusDiv);
    observer = new Observer(game);
    speechRenderer = new SpeechRenderer(game);
    speechRenderer.startListening();
    animationClock = new AnimationClock((delta) => handleNewFrame(delta));
}

/**
 * Set up the handlers that we need.
 */
function handlerInit(): void {
    // Use a SpeechRenderer to display/speak status messages.
    game.eventBus.addEventHandler(UIStatusMessageEvent, (event) => {
        if (event instanceof UIStatusMessageEvent) {
            sr.render(event.message);
        }
    });
    // Set up the arrow keys.
    keyboardManager.addHandler(
        keys.ARROW_RIGHT,
        () => observer.moveRight(),
        KeyTransition.KeyPressed
    );
    keyboardManager.addHandler(
        keys.ARROW_LEFT,
        () => observer.moveLeft(),
        KeyTransition.KeyPressed
    );
    keyboardManager.addHandler(
        keys.ARROW_UP,
        () => observer.moveUp(),
        KeyTransition.KeyPressed
    );
    keyboardManager.addHandler(
        keys.ARROW_DOWN,
        () => observer.moveDown(),
        KeyTransition.KeyPressed
    );
}

/**
 * Start the game and the animation frame requests.
 */
function startGame() {
    keyboardManager.startListening();
    animationClock.start();
}

/**
 * Handle each animation frame.
 *
 * @param delta - the time in milliseconds since the last frame
 */
function handleNewFrame(delta: number): void {
    game.update(delta);
    keyboardManager.update();
}
