import Context from './context';
import { Level } from './level/level';
import { level1 } from './maps/level_1';
import { level2 } from './maps/level_2';
import { ILevel } from './maps/IMap';
import { renderGameOver } from './renders/gameOverRenderer';
import { renderGameToolbar } from './renders/gameToolbar';
import { renderGameStart } from './renders/newGameRenderer';
import { GameState } from './types/gameStateType';
import { LevelState } from './types/levelStateType';
import { renderGameCompleted } from './renders/gameCompletedRenderer';

class Game {
  private canvas: HTMLCanvasElement = null;
  private levels: Array<ILevel> = [level2, level1];
  private currentLevel: Level = null;
  constructor() {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = this.canvas.getContext('2d');
    Context.initContext({
      gameState: GameState.GAME_NOT_STARTED,
      levelState: LevelState.LEVEL_NOT_STARTED,
      graphicContext: ctx,
      lives: 3,
      scores: 0,
      levelIndex: 0
    });
    ctx.fillStyle = 'black';
    this.currentLevel = new Level(
      this.levels[0],
      this.onEarningPoints,
      this.onLevelCompleted
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
  onEarningPoints = (points: number) => {
    const scores = Context.get().scores;
    Context.set({ scores: points + scores });
  };
  onLevelCompleted = () => {
    const { levelIndex } = Context.get();
    if (levelIndex + 1 === this.levels.length) {
      Context.set({ gameState: GameState.GAME_COMPLETED });
    } else {
      const newLevelIndex = levelIndex + 1;
      Context.set({
        levelIndex: newLevelIndex,
        levelState: LevelState.LEVEL_NOT_STARTED
      });
      this.currentLevel = new Level(
        this.levels[newLevelIndex],
        this.onEarningPoints,
        this.onLevelCompleted
      );
      this.currentLevel.startLevel();
    }
  };
  draw = () => {
    const { gameState, graphicContext: ctx } = Context.get();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (gameState === GameState.GAME_IN_PROGRESS) {
      this.currentLevel.move();
      this.currentLevel.render();
    } else if (gameState === GameState.GAME_NOT_STARTED) {
      renderGameStart(this.startGame);
    } else if (gameState === GameState.GAME_OVER) {
      renderGameOver();
    } else if (gameState === GameState.GAME_COMPLETED) {
      renderGameCompleted();
    }
    renderGameToolbar();
    requestAnimationFrame(this.draw);
  };
  startGame = () => {
    Context.set({ gameState: GameState.GAME_IN_PROGRESS });
    this.currentLevel.startLevel();
  };
}

const game = new Game();

export { game };
