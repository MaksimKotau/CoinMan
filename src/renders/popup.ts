import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';

export const renderPopup = (type: 'info' | 'warn', messages: Array<string>) => {
  const ctx = Context.get().graphicContext;
  ctx.beginPath();
  ctx.rect(70, 135, SCREEN_SIZE - 140, 300);
  ctx.fillStyle = type == 'info' ? '#7b1fa2' : '#f44336';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  const startY =
    SCREEN_SIZE / 2 -
    (messages.length - 1) * 40 +
    (messages.length % 2 > 0 ? 0 : 20);
  for (let i = 0; i < messages.length; i++) {
    ctx.fillText(messages[i], SCREEN_SIZE / 2, startY + i * 40);
  }
  ctx.closePath();
};
