import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';

export const renderGameStart = () => {
  const { graphicContext: ctx } = Context.get();
  ctx.beginPath();
  ctx.font = 'bold 90px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#7b1fa2';
  ctx.shadowBlur = 50;
  ctx.fillStyle = '#7b1fa2';
  ctx.fillText('P A C M A N', SCREEN_SIZE / 2, SCREEN_SIZE / 2);
  ctx.rect(220, 400, 130, 40);
  ctx.fillStyle = '#7b1fa2';
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', 285, 420);
  ctx.closePath();
};
