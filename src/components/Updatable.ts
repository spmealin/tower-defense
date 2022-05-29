/**
 * A component which updates every frame.
 */
export interface Updatable {
    update(delta: number): void;
}

/**
 * Check if an object implements the Updatable interface.
 *
 * @param obj - the object to check
 */
export function isInstanceOfUpdatable(obj: unknown): obj is Updatable {
    return obj instanceof Object && "update" in obj;
}
