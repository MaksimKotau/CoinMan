import Context from '../context';
import { EMPTY_ZONE } from '../maps/constants';
import { ILevel, IMap } from '../maps/IMap';
import { Enemy } from '../renders/enemy';
import { renderMap } from '../renders/mapRenderer';
import { Player } from '../renders/player';
import { renderOnPlayerDied } from '../renders/playerDiedPopUp';
import { renderStartNewLevel } from '../renders/startNewLevelRenderer';
import { Direction } from '../renders/types/directionType';
import { GameState } from '../renders/types/gameStateType';
import { LevelState } from '../renders/types/levelStateType';
import { getEnemyCollisionID } from '../renders/utils';

export class Level {
  private mapData: IMap = null;
  private player: Player = null;
  private enemies: Array<Enemy> = [];
  private onEarningPoints: (points: number) => void = null;
  private level: ILevel = null;
  constructor(level: ILevel, onEarningPoints: (points: number) => void) {
    this.mapData = level.map;
    this.level = level;
    this.onEarningPoints = onEarningPoints;
    this.player = new Player(
      level.player_start_position.x,
      level.player_start_position.y
    );
    level.enemies_start_position.forEach((en, index) => {
      this.enemies.push(new Enemy(en.y, en.x, index));
    });
  }
  handleDirectionChange = (direction: Direction) => {
    this.player.handleDirectionChange(direction);
  };
  startLevel = () => {
    setTimeout(
      () => Context.set({ levelState: LevelState.LEVEL_IN_PROGRESS }),
      3000
    );
  };
  render = () => {
    const { levelState } = Context.get();
    renderMap(this.mapData);
    this.player.render();
    this.enemies.forEach((enemy) => {
      enemy.render();
    });
    if (levelState === LevelState.LEVEL_NOT_STARTED) {
      renderStartNewLevel();
    }
    if (levelState === LevelState.PLAYER_DIED) {
      renderOnPlayerDied();
    }
  };
  onEatingDot = (data: { col: number; row: number }) => {
    this.onEarningPoints(1);
    this.mapData[data.row][data.col] = EMPTY_ZONE;
  };
  move = () => {
    if (Context.get().levelState === LevelState.LEVEL_IN_PROGRESS) {
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
      let { lives } = Context.get();
      Context.set({ lives: --lives });
      if (Context.get().lives > 0) {
        this.resetAfterPlayerDie();
        Context.set({ levelState: LevelState.PLAYER_DIED });
        setTimeout(
          () => Context.set({ levelState: LevelState.LEVEL_IN_PROGRESS }),
          3000
        );
      } else {
        Context.set({ gameState: GameState.GAME_OVER });
      }
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
