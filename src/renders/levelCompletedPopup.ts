import Context from '../context';

export const renderOnLevelCompleted = () => {
  const { levelIndex, graphicContext: ctx } = Context.get();
  ctx.beginPath();
  ctx.rect(70, 185, 430, 200);
  ctx.fillStyle = 'red';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CONGRATULATIONS!!!', 285, 270);
  ctx.fillText(`LEVEL ${levelIndex} COMPLETED!!!`, 285, 300);
  ctx.closePath();
};
