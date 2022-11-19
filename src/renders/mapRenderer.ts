import {
  BRICKS_COUNT,
  BRICK_COLOR,
  CONCRETE_COLOR,
  DOT_ZONE,
  TILE_SIZE,
  WALL_ZONE
} from '../maps/constants';
import { IMap } from '../maps/IMap';
import Context from '../context';

export const renderMap = (mapData: IMap) => {
  const ctx = Context.get().graphicContext;
  for (let row = 0; row < BRICKS_COUNT; row++) {
    for (let col = 0; col < BRICKS_COUNT; col++) {
      if (mapData[row][col] === WALL_ZONE) {
        renderWall(row, col, ctx);
      } else if (mapData[row][col] === DOT_ZONE) {
        renderDot(row, col, ctx);
      }
    }
  }
};

const renderWall = (
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = CONCRETE_COLOR;
  ctx.strokeStyle = CONCRETE_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(col * TILE_SIZE, row * TILE_SIZE + 1, TILE_SIZE * 0.2, 8);
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(
    col * TILE_SIZE + TILE_SIZE * 0.2 + 2,
    row * TILE_SIZE + 1,
    TILE_SIZE * 0.8 - 2,
    8
  );
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(col * TILE_SIZE, row * TILE_SIZE + 11, TILE_SIZE / 2 - 1, 8);
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(
    col * TILE_SIZE + TILE_SIZE / 2 + 1,
    row * TILE_SIZE + 11,
    TILE_SIZE / 2 - 1,
    8
  );
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(
    col * TILE_SIZE,
    row * TILE_SIZE + TILE_SIZE - 9,
    TILE_SIZE * 0.8,
    8
  );
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(
    col * TILE_SIZE + TILE_SIZE * 0.8 + 2,
    row * TILE_SIZE + TILE_SIZE - 9,
    TILE_SIZE * 0.2 - 2,
    8
  );
  ctx.fillStyle = BRICK_COLOR;
  ctx.strokeStyle = BRICK_COLOR;
  ctx.fill();
  ctx.closePath();
};

const renderDot = (row: number, col: number, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(
    col * TILE_SIZE + TILE_SIZE / 2,
    row * TILE_SIZE + TILE_SIZE / 2,
    10,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = '#efef5d';
  ctx.fill();
  ctx.strokeStyle = '#CC9933';
  ctx.arc(
    col * TILE_SIZE + TILE_SIZE / 2,
    row * TILE_SIZE + TILE_SIZE / 2,
    9,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#CC9933';
  ctx.fillText(
    '$',
    col * TILE_SIZE + TILE_SIZE / 2,
    row * TILE_SIZE + TILE_SIZE / 2 + 1
  );
};
