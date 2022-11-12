import { EMPTY_ZONE } from '../maps/constants';
import { ILevel, IMap } from '../maps/IMap';
import { Enemy } from '../renders/enemy';
import { renderMap } from '../renders/mapRenderer';
import { Player } from '../renders/player';
import { Direction } from '../renders/types/directionType';
import { getEnemyCollisionID } from '../renders/utils';

export class Level {
  private ctx: CanvasRenderingContext2D = null;
  private mapData: IMap = null;
  private player: Player = null;
  private enemies: Array<Enemy> = [];
  private onPlayerDied: () => void = null;
  private level: ILevel = null;
  constructor(
    ctx: CanvasRenderingContext2D,
    level: ILevel,
    onPlayerDied: () => void,
  ) {
    this.mapData = level.map;
    this.ctx = ctx;
    this.level = level;
    this.onPlayerDied = onPlayerDied;
    this.player = new Player(
      level.player_start_position.x,
      level.player_start_position.y,
      this.ctx
    );
    level.enemies_start_position.forEach((en, index) => {
      this.enemies.push(new Enemy(en.y, en.x, index, this.ctx));
    });
  }
  handleDirectionChange = (direction: Direction) => {
    this.player.handleDirectionChange(direction);
  };
  render = () => {
    renderMap(this.mapData, this.ctx);
    this.player.render();
    this.enemies.forEach((enemy) => {
      enemy.render();
    });
  };
  onEatingDot = (data: { col: number; row: number }) => {
    this.mapData[data.row][data.col] = EMPTY_ZONE;
  };
  move = () => {
    this.player.move(this.mapData, this.onEatingDot);
    this.enemies.forEach((enemy) => {
      enemy.move(this.mapData);
    });
    this.detectEnemiesCollision();
  };
  detectEnemiesCollision = () => {
    const enemyID = getEnemyCollisionID(this.player, this.enemies);
    if (enemyID !== null) {
      this.onPlayerDied();
    }
  };
  resetAfterPlayerDie = () => {
    this.player = new Player(
      this.level.player_start_position.x,
      this.level.player_start_position.y,
      this.ctx
    );
    this.enemies = [];
    this.level.enemies_start_position.forEach((en, index) => {
      this.enemies.push(new Enemy(en.y, en.x, index, this.ctx));
    });
  }
}
