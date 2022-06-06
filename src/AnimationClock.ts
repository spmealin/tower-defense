/**
 * The type of the callback to be called when a new frame should be rendered.
 */
type newFrameCallback = (delta: number) => void;

/**
 * Call a new frame handler as regularly as possible.
 */
export class AnimationClock {
    private readonly _callback: newFrameCallback;
    private _cancelRenderToken: number | null;
    private _lastFrameTime: number | null;
    // Use stopRequested since cancel tokens don't always work.
    private _stopRequested = false;

    /**
     * Create a new AnimationClock object.
     *
     * @param callback - a callback to call each frame
     */
    constructor(callback: newFrameCallback) {
        this._callback = callback;
        this._cancelRenderToken = null;
        this._lastFrameTime = null;
    }

    /**
     * Start requesting frames.
     */
    start(): void {
        this._cancelRenderToken = window.requestAnimationFrame(
            this._handleNewFrame
        );
        this._stopRequested = false;
    }

    /**
     * Stop getting frames.
     */
    stop(): void {
        if (this._cancelRenderToken) {
            window.cancelAnimationFrame(this._cancelRenderToken);
            this._cancelRenderToken = null;
        }
        this._lastFrameTime = null;
        this._stopRequested = true;
    }

    /**
     * Handel each new frame.
     *
     * @param time - the time of the frame
     * @private
     */
    private _handleNewFrame = (time: DOMHighResTimeStamp) => {
        if (this._stopRequested) {
            return;
        }
        if (this._lastFrameTime) {
            const delta = time - this._lastFrameTime;
            this._callback(delta);
            this._lastFrameTime = time;
        } else {
            // If this is the first frame, we will not call the callback so they never have to deal with deltas that are not defined.
            this._lastFrameTime = time;
        }
        this._cancelRenderToken = window.requestAnimationFrame(
            this._handleNewFrame
        );
    };
}
