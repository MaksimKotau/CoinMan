import Context from '../context';
import { EMPTY_ZONE } from '../maps/constants';
import { ILevel, IMap } from '../maps/IMap';
import { Enemy } from '../renders/enemy';
import { renderMap } from '../renders/mapRenderer';
import { Player } from '../renders/player';
import { renderPopup } from '../renders/popup';
import { getEnemyCollisionID, numberOfDotsLeftOnMap } from '../renders/utils';
import { Direction } from '../types/directionType';
import { GameState } from '../types/gameStateType';
import { LevelState } from '../types/levelStateType';

export class Level {
  private mapData: IMap = null;
  private player: Player = null;
  private enemies: Array<Enemy> = [];
  private onEarningPoints: (points: number) => void = null;
  private onLevelCompleted: () => void = null;
  private level: ILevel = null;
  constructor(
    level: ILevel,
    onEarningPoints: (points: number) => void,
    onLevelCompleted: () => void
  ) {
    this.mapData = JSON.parse(JSON.stringify(level.map));
    this.level = JSON.parse(JSON.stringify(level));
    this.onEarningPoints = onEarningPoints;
    this.onLevelCompleted = onLevelCompleted;
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
    const { levelState, levelIndex, lives } = Context.get();
    renderMap(this.mapData);
    this.player.render();
    this.enemies.forEach((enemy) => {
      enemy.render();
    });
    if (levelState === LevelState.LEVEL_NOT_STARTED) {
      renderPopup('info', [`Level ${levelIndex + 1}`]);
    }
    if (levelState === LevelState.PLAYER_DIED) {
      renderPopup('warn', [
        'Player died...',
        `${lives} ${lives === 1 ? 'life' : 'lives'} left`
      ]);
    }
    if (levelState === LevelState.LEVEL_COMPLETED) {
      renderPopup('info', [
        'Congratulations!!!',
        `Level ${levelIndex + 1} completed!!!`
      ]);
    }
  };
  onEatingDot = (data: { col: number; row: number }) => {
    this.onEarningPoints(1);
    this.mapData[data.row][data.col] = EMPTY_ZONE;
    const dotsLeft: number = numberOfDotsLeftOnMap(this.mapData);
    const { levelsCount, levelIndex } = Context.get();
    if (dotsLeft === 0) {
      if (levelIndex + 1 === levelsCount) {
        this.onLevelCompleted();
      } else {
        Context.set({ levelState: LevelState.LEVEL_COMPLETED });
        setTimeout(() => this.onLevelCompleted(), 3000);
      }
    }
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
