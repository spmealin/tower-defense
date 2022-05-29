import { AnimationClock } from "./AnimationClock";
import {
    UIStatusErrorMessage,
    UIStatusMessageEvent,
    UIStatusSoundEvent
} from "./events/StatusEvents";
import { Game } from "./Game";
import { KeyboardManager, KeyTransition } from "./input/KeyboardManager";
import * as keys from "./input/KeyConstants";
import { Observer } from "./models/Observer";
import { AudioPlayer } from "./ui/AudioPlayer";
import { AudioRenderer } from "./ui/renderers/AudioRenderer";
import { SpeechRenderer } from "./ui/renderers/SpeechRenderer";
import { ScreenReaderBridge } from "./ui/ScreenReaderBridge";
import { Artist } from "./ui/visuals/Artist";
import { VisualManager } from "./ui/visuals/VisualManager";

const levelMapFiles = ["./maps/loop.txt", "./maps/zigzag.txt"];

/**
 * Return a random item from an array
 *
 * @param arr An array of anything
 * @returns a random item
 */
function randomArrayItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

let sr: ScreenReaderBridge;
let game: Game;
let keyboardManager: KeyboardManager;
let observer: Observer;
let speechRenderer: SpeechRenderer;
let audioRenderer: AudioRenderer;
let visualManager: VisualManager;
let animationClock: AnimationClock;
let player: AudioPlayer;
let artist: Artist;

/**
 * The main entry point of the application.
 *
 * @param root - the root element of the application
 */
export function main(root: HTMLElement): void {
    void initializeGameBoard((board) => {
        pageInit(root, board);
        handlerInit();
        startGame();
    });
}

/**
 * AudioContext can't initialize until a user has done something.
 * So, wait for the user to do something, initialize the audio,
 * and then remove the initializations
 *
 * @param player - the audio player
 */
function waitToInitializeAudio(player: AudioPlayer) {
    const userInitCheck = () => {
        player.init();
        removeEventListener("keydown", userInitCheck);
    };
    window.addEventListener("keydown", userInitCheck);
    window.addEventListener("click", userInitCheck);
}

/**
 * Fetch level plan from a text file, and then initialize the board
 *
 * @param cb Gameboard initialization callback
 */
async function initializeGameBoard(cb: (board: string[][]) => void) {
    const filename = randomArrayItem<string>(levelMapFiles);
    const textFile = await (await fetch(filename)).text();
    const board = textFile.split("\n").map((row) => row.trim().split(""));
    cb(board);
}

/**
 * Set up the elements of the page and the global objects that we need.
 *
 * @param root - the root element that we should be adding elements to on the page
 * @param board - the board of the game
 */
function pageInit(root: HTMLElement, board: string[][]): void {
    // Page setup - interactive focus eleemnt
    const focusDiv = document.createElement("div");
    focusDiv.setAttribute("tabIndex", "0");
    root.appendChild(focusDiv);
    focusDiv.focus();

    // ScreenReaderBridge setup
    const speechDiv = document.createElement("div");
    ScreenReaderBridge.addAriaAttributes(speechDiv);
    root.appendChild(speechDiv);
    sr = new ScreenReaderBridge(speechDiv);

    // Audio player setup
    player = new AudioPlayer();
    waitToInitializeAudio(player);

    // Game setup
    game = new Game();
    game.initialize(board);

    // Input setup
    keyboardManager = new KeyboardManager(focusDiv);
    observer = new Observer(game, 25, 25);

    // SpeechRenderer setup
    speechRenderer = new SpeechRenderer(game);
    speechRenderer.startListening();

    // AudioRenderer setup
    audioRenderer = new AudioRenderer(game);
    audioRenderer.startListening();

    // more game setup
    animationClock = new AnimationClock((delta) => handleNewFrame(delta));

    // visual setup
    const drawingContainer = document.createElement("div");
    root.appendChild(drawingContainer);
    artist = new Artist(drawingContainer, game);
    visualManager = new VisualManager(game, observer, artist);
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
    game.eventBus.addEventHandler(UIStatusErrorMessage, (event) => {
        if (event instanceof UIStatusErrorMessage) {
            sr.render(event.message);
        }
    });
    game.eventBus.addEventHandler(UIStatusSoundEvent, (event) => {
        if (event instanceof UIStatusSoundEvent) {
            void player.render(event.audioCode, event.pan, event.adjustment);
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
    keyboardManager.addHandler(
        keys.KEY_T,
        () => {
            observer.buildTower();
        },
        KeyTransition.KeyPressed
    );
    keyboardManager.addHandler(
        keys.KEY_J,
        () => {
            observer.jumpToTower();
        },
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
    visualManager.update();
}
