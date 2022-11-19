import {
  CONCRETE_COLOR,
  SCREEN_SIZE,
  TILE_SIZE,
  TOOLBAR_HEIGHT
} from '../maps/constants';
import Context from '../context';

export const renderGameToolbar = () => {
  const { lives, graphicContext: ctx } = Context.get();
  ctx.beginPath();
  ctx.rect(0, SCREEN_SIZE, SCREEN_SIZE, TOOLBAR_HEIGHT);
  ctx.strokeStyle = CONCRETE_COLOR;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
  for (let i = 0; i < lives; i++) {
    renderHeart(i);
  }
  renderScores();
  renderLevelNumber();
};

const renderHeart = (index: number) => {
  const ctx = Context.get().graphicContext;
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

const renderScores = () => {
  const { graphicContext: ctx, scores } = Context.get();
  ctx.beginPath();
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'end';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `SCORES: ${scores}`,
    SCREEN_SIZE - 5,
    SCREEN_SIZE + TILE_SIZE / 2 + 1
  );
  ctx.closePath();
};

const renderLevelNumber = () => {
  const { graphicContext: ctx, levelIndex } = Context.get();
  ctx.beginPath();
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `LEVEL: ${levelIndex + 1}`,
    SCREEN_SIZE / 2,
    SCREEN_SIZE + TILE_SIZE / 2 + 1
  );
  ctx.closePath();
};
