export type IMap = Array<Array<number>>;

export interface ILevel {
  map: IMap;
  enemies_start_position: Array<{ x: number; y: number }>;
  player_start_position: { x: number; y: number };
}
