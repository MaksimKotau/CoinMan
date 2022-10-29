export type IMap = Array<Array<number>>;

export interface ILevel {
    map: IMap;
    enemies_start_position: Array<{id: number, x: number, y: number}>
    player_start_position: {x: number, y: number}
}