/**
 * An abstract GameObject that contains logic that all game objects should have.
 */
export abstract class GameObject {
    protected _children: GameObject[] = [];

    /**
     * Called when this object should be destroied.
     */
    destroy(): void {
        this._children.forEach((child) => child.destroy());
        this._children = [];
    }

    /**
     * Destroy a specific GameObject.
     *
     * @param child - the GameObject to destroy
     */
    destroyChild(child: GameObject): void {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child.destroy();
            this._children.splice(index, 1);
        }
    }

    /**
     * Update this and all of the children.
     *
     * @param delta - the time in milliseconds since the last update
     */
    update(delta: number): void {
        this._children.forEach((child) => child.update(delta));
    }
}
