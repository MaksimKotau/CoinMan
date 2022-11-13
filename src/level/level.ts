import { EMPTY_ZONE } from '../maps/constants';
import { ILevel, IMap } from '../maps/IMap';
import { Enemy } from '../renders/enemy';
import { renderMap } from '../renders/mapRenderer';
import { Player } from '../renders/player';
import { renderOnPlayerDied } from '../renders/playerDiedPopUp';
import { renderStartNewLevel } from '../renders/startNewLevelRenderer';
import { Direction } from '../renders/types/directionType';
import { LevelState } from '../renders/types/levelStateType';
import { getEnemyCollisionID } from '../renders/utils';

export class Level {
  private mapData: IMap = null;
  private player: Player = null;
  private enemies: Array<Enemy> = [];
  private onPlayerDied: () => void = null;
  private onEarningPoints: (points: number) => void = null;
  private level: ILevel = null;
  private levelState: LevelState;
  constructor(
    level: ILevel,
    onPlayerDied: () => void,
    onEarningPoints: (points: number) => void
  ) {
    this.mapData = level.map;
    this.level = level;
    this.levelState = LevelState.LEVEL_NOT_STARTED;
    this.onPlayerDied = onPlayerDied;
    this.onEarningPoints = onEarningPoints;
    this.player = new Player(
      level.player_start_position.x,
      level.player_start_position.y
    );
    level.enemies_start_position.forEach((en, index) => {
      this.enemies.push(new Enemy(en.y, en.x, index));
    });
    this.startLevel()
  }
  handleDirectionChange = (direction: Direction) => {
    this.player.handleDirectionChange(direction);
  };
  startLevel = () => {
    setTimeout(() => (this.levelState = LevelState.LEVEL_IN_PROGRESS), 3000);
  }
  render = () => {
    renderMap(this.mapData);
    if (this.levelState === LevelState.LEVEL_NOT_STARTED){
      renderStartNewLevel()
    }
    if (this.levelState === LevelState.PLAYER_DIED) {
      renderOnPlayerDied();
      setTimeout(() => (this.levelState = LevelState.LEVEL_IN_PROGRESS), 3000);
    }
    
    this.player.render();
    this.enemies.forEach((enemy) => {
      enemy.render();
    });
  };
  onEatingDot = (data: { col: number; row: number }) => {
    this.onEarningPoints(1);
    this.mapData[data.row][data.col] = EMPTY_ZONE;
  };
  move = () => {
    if (this.levelState === LevelState.LEVEL_IN_PROGRESS) {
      this.player.move(this.mapData, this.onEatingDot);
      this.enemies.forEach((enemy) => {
        enemy.move(this.mapData);
      });
      this.detectEnemiesCollision();
    }
  };
  detectEnemiesCollision = () => {
    const enemyID = getEnemyCollisionID(this.player, this.enemies);
    if (enemyID !== null) {
      this.resetAfterPlayerDie();
    }
  };
  resetAfterPlayerDie = () => {
    this.player = new Player(
      this.level.player_start_position.x,
      this.level.player_start_position.y
    );
    this.enemies = [];
    this.level.enemies_start_position.forEach((en, index) => {
      this.enemies.push(new Enemy(en.y, en.x, index));
    });
  };
}
