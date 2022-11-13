import { Level } from './level/level';
import { level1 } from './maps/1stLevel';
import { ILevel } from './maps/IMap';
import { renderOnPlayerDied } from './renders/playerDiedPopUp';
import { GameState } from './renders/types/gameStateType';

class Game {
  private canvas: HTMLCanvasElement = null;
  private ctx: CanvasRenderingContext2D = null;
  private levels: Array<ILevel> = [level1];
  private currentLevelIndex = 0;
  private currentLevel: Level = null;
  private state: GameState = null;
  private lives: number = 3;
  private scores: number = 0;
  constructor() {
    this.state = GameState.GAME_IN_PROGRESS;
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    this.currentLevel = new Level(
      this.ctx,
      this.levels[this.currentLevelIndex],
      this.onPlayerDied,
      this.onEarningPoints
    );
    document.addEventListener('keydown', this.keyDownHandler, false);
    this.draw();
  }
  keyDownHandler = (e) => {
    if (e.keyCode === 39) {
      this.currentLevel.handleDirectionChange('Right');
    } else if (e.keyCode === 37) {
      this.currentLevel.handleDirectionChange('Left');
    } else if (e.keyCode === 38) {
      this.currentLevel.handleDirectionChange('Up');
    } else if (e.keyCode === 40) {
      this.currentLevel.handleDirectionChange('Down');
    }
  };
  onPlayerDied = () => {
    if (this.lives === 1) {
      this.lives = 0;
      this.state = GameState.GAME_OVER
    } else {
      this.lives--
      this.state = GameState.PLAYER_DIED;
      this.currentLevel.resetAfterPlayerDie()
    }
  };
  onEarningPoints = (points: number) => {
    this.scores = this.scores + points;
  }
  draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.state === GameState.GAME_IN_PROGRESS) {
      this.currentLevel.move();
    }
    this.currentLevel.render();
    if (this.state === GameState.PLAYER_DIED) {
      renderOnPlayerDied(this.ctx, this.lives);
      setTimeout(() => (this.state = GameState.GAME_IN_PROGRESS), 3000);
    }
    requestAnimationFrame(this.draw);
  };
}

const game = new Game();

export { game };
