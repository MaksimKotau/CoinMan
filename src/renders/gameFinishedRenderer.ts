import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';
import { GameState } from '../types/gameStateType';

const results = [
  { name: 'Pavel', scores: 1000 },
  { name: 'Max', scores: 500 },
  { name: 'Dimon', scores: 300 }
];

export const renderGameFinished = () => {
  const { graphicContext: ctx, scores, gameState } = Context.get();
  ctx.beginPath();
  ctx.font = `bold ${gameState === GameState.GAME_OVER ? 90 : 50}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = gameState === GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
  ctx.shadowBlur = 50;
  ctx.fillStyle = gameState === GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
  ctx.fillText(
    gameState === GameState.GAME_OVER ? 'GAME OVER' : 'YOU WON THE GAME',
    285,
    150
  );
  ctx.rect(210, 500, 150, 40);
  ctx.fillStyle = gameState === GameState.GAME_OVER ? '#f44336' : '#7b1fa2';
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESTART', 285, 520);
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('Best scores:', 285, 250);
  ctx.font = 'bold 20px sans-serif';
  const records = [...results, { name: 'You', scores: scores }].sort(
    (a, b) => b.scores - a.scores
  );
  records.forEach((el, index) => {
    ctx.fillStyle = el.name === 'You' ? '#7b1fa2' : 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`${index + 1}. ${el.name}`, 100, 320 + index * 40);
    ctx.textAlign = 'right';
    ctx.fillText(
      `${new Array(54 - el.name.length - el.scores.toString().length)
        .fill(null)
        .map(() => '.')
        .join('')} ${el.scores}`,
      SCREEN_SIZE - 100,
      320 + index * 40
    );
  });
  ctx.closePath();
};
