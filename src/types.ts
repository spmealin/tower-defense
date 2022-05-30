/**
 * The available audio codes
 */
export enum audioCodeOptions {
    WIND = "wind"
}

/**
 * States the tower can be in
 */
export enum TowerStatus {
    building,
    active,
    dead
}

/**
 * Types of events called by a tower
 */
export enum TowerEventType {
    placed,
    finishedBuilding,
    firing,
    died
}

/**
 * Types of events called by an enemy
 */
export enum EnemyEventType {
    active,
    died
}
