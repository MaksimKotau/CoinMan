export const renderOnLevelCompleted = (ctx: CanvasRenderingContext2D) => {
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
  ctx.fillText(`LEVEL COMPLETED!!!`, 285, 300);
  ctx.closePath();
};
