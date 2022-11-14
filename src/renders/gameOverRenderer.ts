import Context from '../context';

export const renderGameOver = () => {
  const ctx = Context.get().graphicContext;
  ctx.beginPath();
  ctx.rect(70, 185, 430, 200);
  ctx.fillStyle = '#f44336';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GAME OVER', 285, 270);
  ctx.closePath();
};
