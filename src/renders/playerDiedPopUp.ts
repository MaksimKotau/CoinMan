export const renderOnPlayerDied = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.rect(100, 200, 400, 200);
  ctx.fillStyle = 'purple';
  ctx.fill();
  ctx.font = 'bold 24px verdana, sans-serif ';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Player Died', 250, 300);
  ctx.closePath();
};
