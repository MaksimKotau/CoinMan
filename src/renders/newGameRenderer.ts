import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';

export const renderGameStart = () => {
  const { graphicContext: ctx } = Context.get();
  ctx.beginPath();
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#7b1fa2';
  ctx.shadowBlur = 50;
  ctx.fillStyle = '#7b1fa2';
  ctx.fillText('C', 50, SCREEN_SIZE / 2);
  ctx.fillText('I N M A N', 195, SCREEN_SIZE / 2);
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(150, SCREEN_SIZE / 2 - 5, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#efef5d';
  ctx.fill();
  ctx.strokeStyle = '#CC9933';
  ctx.arc(150, SCREEN_SIZE / 2 - 5, 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 45px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#CC9933';
  ctx.fillText('$', 150, SCREEN_SIZE / 2 - 2);
  ctx.closePath();

  ctx.beginPath();
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
