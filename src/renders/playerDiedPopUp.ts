import Context from '../context';

export const renderOnPlayerDied = () => {
  const { graphicContext: ctx, lives } = Context.get();
  ctx.beginPath();
  ctx.rect(70, 185, 430, 200);
  ctx.fillStyle = '#f44336';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Player Died', 285, 270);
  ctx.fillText(`${lives} ${lives === 1 ? 'life' : 'lives'} left`, 285, 300);
  ctx.closePath();
};
