import Context from '../context';
import { GameState } from '../types/gameStateType';

export const mouseClickHandler = (data: {
  x: number;
  y: number;
  start: () => void;
  restart: () => void;
}) => {
  const { x, y, start, restart } = data;
  const { gameState } = Context.get();
  if (gameState === GameState.GAME_NOT_STARTED) {
    if (x >= 220 && x <= 350 && y >= 400 && y <= 440) {
      start();
    }
  }
  if (
    gameState === GameState.GAME_COMPLETED ||
    gameState === GameState.GAME_OVER
  ) {
    if (x >= 210 && x <= 360 && y >= 500 && y <= 540) {
      restart();
    }
  }
};
