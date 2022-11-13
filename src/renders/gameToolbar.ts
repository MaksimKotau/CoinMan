import { SCREEN_SIZE, TILE_SIZE, TOOLBAR_HEIGHT } from '../maps/constants';
import Context from '../context';

export const renderGameToolbar = () => {
  const { lives, scores, graphicContext: ctx } = Context.get();
  ctx.beginPath();
  ctx.rect(0, SCREEN_SIZE, SCREEN_SIZE, TOOLBAR_HEIGHT);
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
  for (let i = 0; i < lives; i++) {
    renderHeart(ctx, i);
  }
  renderScores(ctx, scores);
};

const renderHeart = (ctx: CanvasRenderingContext2D, index: number) => {
  ctx.beginPath();
  ctx.arc(10 + index * TILE_SIZE, SCREEN_SIZE + 10, 5, 0, Math.PI, true);
  ctx.arc(20 + index * TILE_SIZE, SCREEN_SIZE + 10, 5, 0, Math.PI, true);
  ctx.moveTo(25 + index * TILE_SIZE, SCREEN_SIZE + 10);
  ctx.bezierCurveTo(
    25 + index * TILE_SIZE,
    SCREEN_SIZE + 14,
    20 + index * TILE_SIZE,
    SCREEN_SIZE + 22,
    15 + index * TILE_SIZE,
    SCREEN_SIZE + 25
  );
  ctx.bezierCurveTo(
    10 + index * TILE_SIZE,
    SCREEN_SIZE + 22,
    5 + index * TILE_SIZE,
    SCREEN_SIZE + 14,
    5 + index * TILE_SIZE,
    SCREEN_SIZE + 10
  );
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
};

const renderScores = (ctx: CanvasRenderingContext2D, scores: number) => {
  ctx.beginPath();
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'end';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `SCORES: ${scores}`,
    SCREEN_SIZE - 5,
    SCREEN_SIZE + TILE_SIZE / 2
  );
  ctx.closePath();
};
