import type { Updatable } from "../components/Updatable";

/**
 * An abstract GameObject that contains logic that all game objects should have.
 */
export abstract class GameObject implements Updatable {
    protected _children: GameObject[] = [];

    /**
     * Update this and all of the children.
     *
     * @param delta - the time in milliseconds since the last update
     */
    update(delta: number): void {
        this._children.forEach((child) => child.update(delta));
    }
}
