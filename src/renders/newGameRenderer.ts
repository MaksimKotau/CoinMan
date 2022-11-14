import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';
import { GameState } from './types/gameStateType';

export const renderGameStart = () => {
  const ctx = Context.get().graphicContext;
  const actionsBar = document.getElementById('actions');
  if (!document.getElementById('start_button')) {
    const buttonStart = document.createElement('button');
    buttonStart.innerText = 'START';
    buttonStart.id = 'start_button';
    buttonStart.onclick = () => {
      Context.set({ gameState: GameState.GAME_IN_PROGRESS });
      document.getElementById('start_button').remove();
    };
    actionsBar.appendChild(buttonStart);
  }
  ctx.beginPath();
  ctx.rect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
  ctx.fillStyle = 'purple';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 90px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('P A C M A N', SCREEN_SIZE / 2, SCREEN_SIZE / 2);
  ctx.closePath();
};
