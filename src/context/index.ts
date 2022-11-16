import { GameState } from '../types/gameStateType';
import { LevelState } from '../types/levelStateType';

export interface IGameContext {
  graphicContext: CanvasRenderingContext2D;
  lives: number;
  scores: number;
  gameState: GameState;
  levelState: LevelState;
  levelIndex: number;
  levelsCount: number;
  canvas: HTMLCanvasElement;
}

class GameContext {
  private context: IGameContext = null;
  initContext = (context: IGameContext) => {
    this.context = context;
  };
  set(data: Partial<IGameContext>) {
    if (this.context === null) {
      throw new Error('Context is not initialized');
    }
    this.context = { ...this.context, ...data };
  }
  get() {
    if (this.context === null) {
      throw new Error('Context is not initialized');
    }
    return this.context;
  }
}

const gameContext = new GameContext();

export default gameContext;
